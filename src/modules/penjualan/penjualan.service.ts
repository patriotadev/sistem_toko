import {BarangPenjualanDTO, PembayaranPenjualanDTO, PenjualanDTO} from "./dto/penjualan.dto";
import { IParamsQuery } from "./interfaces/penjualan.interface";
import prisma from "../../libs/prisma";
import moment from "moment";
const Penjualan = prisma.penjualan;
const BarangPenjualan = prisma.barangPenjualan;
const PembayaranPenjualan = prisma.pembayaranPenjualan;
const Toko = prisma.toko;
const debug = require('debug')('hbpos-server:penjualan-service');

class PenjualanService {
    async create(payload: PenjualanDTO) {
        const { 
            namaPelanggan,
            kontakPelanggan,
            alamatPelanggan,
            createdBy,
            tokoId,
        } = payload;
        const generateCode = await this.generateCode(tokoId, new Date());
        if (generateCode) {
            const result = await Penjualan.create({
                data : {
                    nomor: generateCode,
                    namaPelanggan,
                    kontakPelanggan,
                    alamatPelanggan,
                    createdBy,
                    tokoId,
                }
            });
            return result;
        }
    }

    async generateCode(tokoId: string, createdAt: Date) {
        const toko = await Toko.findUnique({
            where: {
                id: tokoId
            }
        });

        if (toko) {
            const tokoDescription = toko.description.split(" ");
            let locationCode: string = '';
            tokoDescription.map((item) => locationCode += item[0]);
            const menuCode = 'PN';
            const dateCode = moment(createdAt).format('DDMMYY');
            const filterCode = `${locationCode}/${menuCode}/${dateCode}`;

            const result = await Penjualan.findMany({
                where: {
                    nomor: {
                        contains: filterCode,
                        mode: 'insensitive'
                    }
                },
                orderBy: {
                    id: 'desc'
                }
            });
            if (result[0]) {
                const lastNumber = result[0]?.nomor.split("/")[3];
                if (lastNumber) {
                    return `${locationCode}/${menuCode}/${dateCode}/${Number(lastNumber) + 1}`;
                }
            } else {
                return `${locationCode}/${menuCode}/${dateCode}/1`;
            }
        }
    }

    async createBarang(payload: Omit<BarangPenjualanDTO, "id">[]) {
        const result = await BarangPenjualan.createMany({
            data: [...(payload as unknown as [])]
        });
        return result;
    }

    async findAll({search, page, perPage, tokoId, dateStart, dateEnd}: IParamsQuery) {
        const sizePerPage = perPage ? Number(perPage) : 100;                                         
        const skipPage = sizePerPage * page - sizePerPage;
        const totalCount = await Penjualan.count();
        const totalPages = Math.ceil(totalCount / perPage);
        const startDate = String(dateStart);
        const endDate = String(dateEnd);
        let result;

        if (tokoId === 'all' && search === 'undefined' && startDate === 'null' && endDate === 'null') {
            result = await Penjualan.findMany({
                skip: skipPage,
                take: Number(perPage),
                include: {
                    BarangPenjualan: true,
                    SuratJalanPenjualan: true,
                    PembayaranPenjualan: true,
                },
                orderBy: {
                    createdAt: 'desc'
                }
            });
        } else if (tokoId === 'all' && search !== 'undefined' && startDate === 'null' && endDate === 'null') {
            result = await Penjualan.findMany({
                where: {
                    nomor: {
                        contains: search,
                        mode: 'insensitive'
                    }
                },
                skip: skipPage,
                take: Number(perPage),
                include: {
                    BarangPenjualan: true,
                    SuratJalanPenjualan: true,
                    PembayaranPenjualan: true,
                },
                orderBy: {
                    createdAt: 'desc'
                }
            });
        } else if (tokoId === 'all' && search === 'undefined' && startDate !== 'null' && endDate !== 'null') {
            result = await Penjualan.findMany({
                where: {
                    createdAt: {
                        gte: new Date(startDate),
                        lte: new Date(endDate)
                    }
                },
                skip: skipPage,
                take: Number(perPage),
                include: {
                    BarangPenjualan: true,
                    SuratJalanPenjualan: true,
                    PembayaranPenjualan: true,
                },
                orderBy: {
                    createdAt: 'desc'
                }
            });
        } else if (tokoId === 'all' && search !== 'undefined' && startDate !== 'null' && endDate !== 'null') {
            result = await Penjualan.findMany({
                where: {
                    nomor: {
                        contains: search,
                        mode: 'insensitive'
                    },
                    createdAt: {
                        gte: new Date(startDate),
                        lte: new Date(endDate)
                    }
                },
                skip: skipPage,
                take: Number(perPage),
                include: {
                    BarangPenjualan: true,
                    SuratJalanPenjualan: true,
                    PembayaranPenjualan: true,
                },
                orderBy: {
                    createdAt: 'desc'
                }
            });
        }

        if (tokoId !== 'all' && search === 'undefined' && startDate === 'null' && endDate === 'null') {
            result = await Penjualan.findMany({
                where: {
                    tokoId
                },
                skip: skipPage,
                take: Number(perPage),
                include: {
                    BarangPenjualan: true,
                    SuratJalanPenjualan: true,
                    PembayaranPenjualan: true,
                },
                orderBy: {
                    createdAt: 'desc'
                }
            });
        } else if (tokoId !== 'all' && search !== 'undefined' && startDate === 'null' && endDate === 'null') {
            result = await Penjualan.findMany({
                where: {
                    nomor: {
                        contains: search,
                        mode: 'insensitive'
                    },
                    tokoId
                },
                skip: skipPage,
                take: Number(perPage),
                include: {
                    BarangPenjualan: true,
                    SuratJalanPenjualan: true,
                    PembayaranPenjualan: true,
                },
                orderBy: {
                    createdAt: 'desc'
                }
            });
        } else if (tokoId !== 'all' && search === 'undefined' && startDate !== 'null' && endDate !== 'null') {
            result = await Penjualan.findMany({
                where: {
                    createdAt: {
                        gte: dateStart,
                        lte: dateEnd
                    },
                    tokoId
                },
                skip: skipPage,
                take: Number(perPage),
                include: {
                    BarangPenjualan: true,
                    SuratJalanPenjualan: true,
                    PembayaranPenjualan: true,
                },
                orderBy: {
                    createdAt: 'desc'
                }
            });
        } else if (tokoId !== 'all' && search !== 'undefined' && startDate !== 'null' && endDate !== 'null') {
            result = await Penjualan.findMany({
                where: {
                    nomor: {
                        contains: search,
                        mode: 'insensitive'
                    },
                    createdAt: {
                        gte: new Date(startDate),
                        lte: new Date(endDate)
                    },
                    tokoId
                },
                skip: skipPage,
                take: Number(perPage),
                include: {
                    BarangPenjualan: true,
                    SuratJalanPenjualan: true,
                    PembayaranPenjualan: true,
                },
                orderBy: {
                    createdAt: 'desc'
                }
            });
        }

        return {
            data: result,
            document: {
                currentPage: Number(page),
                pageSize: Number(perPage),
                totalCount,
                totalPages,
            }
        };
    }

    async findOneById(id: string) {
        const result = await Penjualan.findUnique({
            where: {
                id
            },
            include: {
                PembayaranPenjualan: true
            }
        });
        return result;
    }

    async findManyById(id: any) {
        const penjualanId = id?.split(", ");
        const result = await Penjualan.findMany({
            where: {
                id: {
                    in: penjualanId
                }
            },
        });
        debug(result);
        return result;
    }

    async updateOneById(id: string, payload: PenjualanDTO) {
        const { 
            namaPelanggan,
            kontakPelanggan,
            alamatPelanggan,
            createdBy,
            tokoId,
            updatedBy
        } = payload;
        const result = await Penjualan.update({
            where: {
                id
            },
            data : {
                namaPelanggan,
                kontakPelanggan,
                alamatPelanggan,
                createdBy,
                tokoId,
                updatedBy,
                updatedAt: new Date()
            }
        });
        return result;
    }

    async updatePembayaran(payload: PembayaranPenjualanDTO) {
        const { id, jumlahBayar, metode, updatedAt, updatedBy, isApprove, approvedAt, approvedBy } = payload;
        const result = await PembayaranPenjualan.update({
            where: {
                id
            },
            data: {
                jumlahBayar: Number(jumlahBayar),
                metode,
                updatedAt,
                updatedBy,
                isApprove,
                approvedAt,
                approvedBy,
            }
        });
        return result;
    }

    async updateTotalPembayaran(id: string, totalPembayaran: number) {
        const result = await PembayaranPenjualan.update({
            where: {
                id
            },
            data: {
                totalPembayaran
            }
        });
        return result;
    }

    async findLastStep(penjualanId: string, stokBarangId: string) {
        const maxStep = await BarangPenjualan.aggregate({
            where: {
                penjualanId,
                stokBarangId
            },
            _max: {
                step: true
            }
        });
        debug("serviceeLastStepp=>", maxStep);
        const result = await BarangPenjualan.findFirst({
            where: {
                penjualanId,
                stokBarangId,
                step: maxStep._max.step as number
            }
        });
        return result;
    }

    async findPreviousDifferenceQty(firstStep: number, lastStep: number, stokBarangId: string) {
        const firstStepQty = await BarangPenjualan.findFirst({
            where: {
                step: firstStep,
                stokBarangId
            }
        });
        const lastStepQty = await BarangPenjualan.findFirst({
            where: {
                step: lastStep,
                stokBarangId
            }
        });
        if (firstStepQty && lastStepQty) {
            return firstStepQty?.qty - lastStepQty?.qty;
        }
        return null;
    }

    async updateOneBarangById(id: string, payload: BarangPenjualanDTO) {
        const {  
            kode,
            nama,
            qty,
            satuan,
            discount,
            harga,
            jumlahHarga,
            step,
            isMaster,
            penjualanId,
            stokBarangId,
        } =  payload
        const result = await BarangPenjualan.update({
            where: {
                id
            },
            data: {
                kode,
                nama,
                qty: Number(qty),
                satuan,
                discount: Number(discount),
                harga: Number(harga),
                jumlahHarga: Number(jumlahHarga),
                step,
                isMaster,
                penjualanId,
                stokBarangId,
                updatedAt: new Date()
            }
        });
        return result;
    }

    async findBarangByPenjualanId(penjualanId: string) {
        const result = BarangPenjualan.findMany({
            where: {
                penjualanId
            }
        });

        return result;
    }

    async createPembayaran(payload: PembayaranPenjualanDTO) {
        const result = PembayaranPenjualan.create({data: {
            ...payload
        }});
        return result;
    }

    async deleteOneById(id: string) {
        await BarangPenjualan.deleteMany({
            where: {
                penjualanId: id
            }
        });
        await PembayaranPenjualan.deleteMany({
            where: {
                penjualanId: id
            }
        });
        const result = await Penjualan.delete({
            where: {
                id
            }
        });
        return result;
    }
}

export default PenjualanService;