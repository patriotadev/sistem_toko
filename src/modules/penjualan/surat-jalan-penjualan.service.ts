import { BarangSuratJalanPenjualanDTO, SuratJalanPenjualanDTO } from "./dto/surat-jalan-penjualan.dto";
import { IParamsQuery, ISuratJalanPenjualan } from "./interfaces/surat-jalan-penjualan.interface";
import prisma from "../../libs/prisma";
import moment from "moment";
const SuratJalanPenjualan = prisma.suratJalanPenjualan;
const BarangSuratJalanPenjualan = prisma.barangSuratJalanPenjualan;
const StokBarang = prisma.stokBarang;
const Toko = prisma.toko;
const debug = require('debug')('hbpos-server:surat-jalan-penjualan-service');

class SuratJalanPenjualanService {
    async findAll({search, page, perPage}: IParamsQuery) {
        const skipPage = Number(page) * 10 - 10;
        const totalCount = await SuratJalanPenjualan.count();
        const totalPages = Math.ceil(totalCount / perPage);
        let result;
        if (search !== 'undefined') {
            result = await SuratJalanPenjualan.findMany({
                where: {
                    OR: [
                        {
                            nomor:{
                                contains: search,
                                mode: 'insensitive'
                            },
                        },
                        {
                            penjualan: {
                                namaPelanggan: {
                                    contains: search,
                                    mode: 'insensitive'
                                },
                            }
                        }
                    ]
                },
                skip: skipPage,
                take: Number(perPage),
                include: {
                    penjualan: true,
                    BarangSuratJalanPenjualan: true
                },
                orderBy: {
                    createdAt: 'desc'
                }
            });
        } else {
            result = await SuratJalanPenjualan.findMany({
                skip: skipPage,
                take: Number(perPage),
                include: {
                    penjualan: true,
                    BarangSuratJalanPenjualan: true
                },
                orderBy: {
                    createdAt: 'desc'
                }
            });
        }

        debug(result, ">>> FIND RESULT ON SERVICE");
      
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

    async create(payload: SuratJalanPenjualanDTO) {
        const { namaSupir, createdBy, penjualanId, tokoId } = payload;
        const generateCode = await this.generateCode(tokoId, new Date());
        if (generateCode) {
            const result = await SuratJalanPenjualan.create({
                data : {
                    nomor: generateCode,
                    namaSupir,
                    createdBy,
                    createdAt: new Date(),
                    penjualanId
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
            const menuCode = 'SJ-PN';
            const dateCode = moment(createdAt).format('DDMMYY');
            const filterCode = `${locationCode}/${menuCode}/${dateCode}`;

            const result = await SuratJalanPenjualan.findMany({
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

    async createBarang(payload: Omit<BarangSuratJalanPenjualanDTO, "id">[]) {
        const result = await BarangSuratJalanPenjualan.createMany({
            data: [...(payload as unknown as BarangSuratJalanPenjualanDTO[])]
        });
        return result;
    }

    async deleteOneById(id: string) {
        await BarangSuratJalanPenjualan.deleteMany({
            where: {
                suratJalanPenjualanId: id
            }
        });
        const result = await SuratJalanPenjualan.delete({
            where: {
                id
            }
        });
        return result;
    }

    async cancel(payload: ISuratJalanPenjualan) {
        await this.deleteOneById(<string>payload.id);
        const result = await Promise.all(payload.BarangSuratJalanPenjualan.map(async (item) => {
            const stok = await StokBarang.findUnique({
                where: {
                    id: item.stokBarangId
                }
            });
            if (stok) {
                await StokBarang.update({
                    where: {
                        id: item.stokBarangId
                    },
                    data: {
                        jumlah: stok?.jumlah + item.qty
                    }
                });
            }
        }));
        return result;
    } 
}

export default SuratJalanPenjualanService;