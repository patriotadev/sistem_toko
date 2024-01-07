import { PrismaClient } from "@prisma/client";
import {BarangPenjualanDTO, PembayaranPenjualanDTO, PenjualanDTO} from "./dto/penjualan.dto";
import { IParamsQuery } from "./interfaces/penjualan.interface";
const Penjualan = new PrismaClient().penjualan;
const BarangPenjualan = new PrismaClient().barangPenjualan;
const PembayaranPenjualan = new PrismaClient().pembayaranPenjualan

class PenjualanService {
    async create(payload: PenjualanDTO) {
        const { 
            namaPelanggan,
            kontakPelanggan,
            alamatPelanggan,
            createdBy,
            tokoId,
        } = payload;
        const result = await Penjualan.create({
            data : {
                namaPelanggan,
                kontakPelanggan,
                alamatPelanggan,
                createdBy,
                tokoId,
            }
        });
        return result;
    }

    async createBarang(payload: Omit<BarangPenjualanDTO, "id">[]) {
        const result = await BarangPenjualan.createMany({
            data: [...(payload as unknown as [])]
        });
        return result;
    }

    async findAll({search, page, perPage, tokoId, dateStart, dateEnd}: IParamsQuery) {
        const skipPage = Number(page) * 10 - 10;
        const totalCount = await Penjualan.count();
        const totalPages = Math.ceil(totalCount / perPage);
        const startDate = String(dateStart);
        const endDate = String(dateEnd);
        let result;
        console.log(dateStart);
        console.log("tokoID", tokoId);
        console.log("search", search);

        if (tokoId === 'all' && search === 'undefined' && startDate === 'null' && endDate === 'null') {
            result = await Penjualan.findMany({
                skip: skipPage,
                take: Number(perPage),
                include: {
                    BarangPenjualan: true,
                    SuratJalanPenjualan: true,
                    PembayaranPenjualan: true,
                    InvoicePenjualan: true
                },
                orderBy: {
                    createdAt: 'desc'
                }
            });
        } else if (tokoId === 'all' && search !== 'undefined' && startDate === 'null' && endDate === 'null') {
            result = await Penjualan.findMany({
                where: {
                    namaPelanggan: {
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
                    InvoicePenjualan: true
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
                    InvoicePenjualan: true
                },
                orderBy: {
                    createdAt: 'desc'
                }
            });
        } else if (tokoId === 'all' && search !== 'undefined' && startDate !== 'null' && endDate !== 'null') {
            result = await Penjualan.findMany({
                where: {
                    namaPelanggan: {
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
                    InvoicePenjualan: true
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
                    InvoicePenjualan: true
                },
                orderBy: {
                    createdAt: 'desc'
                }
            });
        } else if (tokoId !== 'all' && search !== 'undefined' && startDate === 'null' && endDate === 'null') {
            result = await Penjualan.findMany({
                where: {
                    namaPelanggan: {
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
                    InvoicePenjualan: true
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
                    InvoicePenjualan: true
                },
                orderBy: {
                    createdAt: 'desc'
                }
            });
        } else if (tokoId !== 'all' && search !== 'undefined' && startDate !== 'null' && endDate !== 'null') {
            result = await Penjualan.findMany({
                where: {
                    namaPelanggan: {
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
                    InvoicePenjualan: true
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
        console.log("po list from invoice ==>", result);
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
        const { id, jumlahBayar, metode, updatedAt, updatedBy, isApprove, approvedAt, approvedBy } = payload
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

    // async updateStatusById(id: string, payload: PoDTO) {
    //     const { status } = payload;
    //     const result = await Po.update({
    //         where: {
    //             id
    //         },
    //         data: {
    //             status,
    //             updatedAt: new Date()
    //         }
    //     });
    //     return result;
    // }

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