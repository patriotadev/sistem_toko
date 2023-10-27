import { PrismaClient } from '@prisma/client'
import PtDTO from './dto/pt.dto';
import { IParamsQuery } from './interfaces/pt.interface';
const Pt = new PrismaClient().pt;

class PtService {
    async create(payload: PtDTO) {
        const { nama, alamat, telepon, createdBy } = payload;
        const result = await Pt.create({
            data : {
                nama,
                alamat,
                telepon,
                createdBy
            }
        });
        return result;
    }

    async findAll({search, page, perPage}: IParamsQuery) {
        const skipPage = Number(page) * 10 - 10;
        const totalCount = await Pt.count();
        const totalPages = Math.ceil(totalCount / perPage);
        let result;
        if (search !== 'undefined') {
            result = await Pt.findMany({
                where: {
                    nama: {
                        contains: search,
                        mode: 'insensitive'
                    },
                },
                skip: skipPage,
                take: Number(perPage),
                orderBy: {
                    createdAt: 'desc'
                }
            });
        } else {
            result = await Pt.findMany({
                skip: skipPage,
                take: Number(perPage),
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
        const result = await Pt.findUnique({
            where: {
                id
            }
        });
        return result;
    }

    async updateOneById(id: string, payload: PtDTO) {
        const { nama, alamat, telepon, updatedBy } = payload;
        const result = await Pt.update({
            where: {
                id
            },
            data : {
                nama,
                alamat,
                telepon,
                updatedBy,
            }
        });

        return result;
    }

    async deleteOneById(id: string) {
        const result = await Pt.delete({
            where: {
                id
            }
        });
    }
}

export default PtService;