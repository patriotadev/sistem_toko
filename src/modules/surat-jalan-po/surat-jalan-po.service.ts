import { PrismaClient } from "@prisma/client";
import SuratJalanPoDTO from "./dto/surat-jalan-po.dto";
import { IParamsQuery } from "./interfaces/surat-jalan-po.interface";
const SuratJalanPo = new PrismaClient().suratJalanPo;

class SuratJalanPoService {
    async create (payload: SuratJalanPoDTO) {
        const { nomor, namaSupir, createdBy, tanggal, poId } = payload;
        const result = await SuratJalanPo.create({
            data : {
                nomor,
                namaSupir,
                createdBy,
                tanggal,
                poId
            }
        });
        return result;
    }

    async findAll({search, page, perPage}: IParamsQuery) {
        const skipPage = Number(page) * 10 - 10;
        const totalCount = await SuratJalanPo.count();
        const totalPages = Math.ceil(totalCount / perPage);
        let result;
        if (search !== 'undefined') {
            result = await SuratJalanPo.findMany({
                where: {
                    OR: [
                        {
                            nomor:{
                                contains: search,
                                mode: 'insensitive'
                            },
                        },
                        {
                            Po: {
                                noPo: {
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
                    Po: true,
                    BarangSuratJalanPo: true
                },
                orderBy: {
                    createdAt: 'desc'
                }
            });
        } else {
            result = await SuratJalanPo.findMany({
                skip: skipPage,
                take: Number(perPage),
                include: {
                    Po: true,
                    BarangSuratJalanPo: true
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
        const result = await SuratJalanPo.findUnique({
            where: {
                id
            }
        });
        return result;
    }

    async updateOneById(id: string, payload: SuratJalanPoDTO) {
        const { nomor, namaSupir, updatedBy, tanggal, poId } = payload;
        const result = await SuratJalanPo.update({
            where: {
                id
            },
            data: {
                nomor,
                namaSupir,
                updatedBy,
                tanggal,
                poId
            }
        });
        return result;
    }

    async deleteOneById(id: string) {
        const result = await SuratJalanPo.delete({
            where: {
                id
            }
        });
        return result;
    }
}

export default SuratJalanPoService;