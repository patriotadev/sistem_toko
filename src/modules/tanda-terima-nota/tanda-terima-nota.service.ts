import { PrismaClient } from "@prisma/client";
import {TandaTerimaNotaDTO} from "./dto/tanda-terima-nota.dto";
import { NotaListDTO } from "./dto/nota-list-dto";
import { IParamsQuery } from "./interfaces/tanda-terima-nota.interface";
const TandaTerimaNota = new PrismaClient().tandaTerimaNota;
const TandaTerimaNotaList = new PrismaClient().tandaTerimaNotaList;

class TandaTerimaNotaService {
    async create(payload: TandaTerimaNotaDTO) {
        const { nomor, tanggal, createdBy } = payload;
        const result = await TandaTerimaNota.create({
            data: {
                nomor,
                tanggal,
                createdBy
            }
        });
        return result;
    }

    async createNotaList(payload: Omit<NotaListDTO, "id">[]) {
        const result = await TandaTerimaNotaList.createMany({
            data: [...(payload as [])]
        });
        return result
    }

    async deleteManyTandaTerimaNotaList(tandaTerimaNotaId: string) {
        const result = await TandaTerimaNotaList.deleteMany({
            where: {
                tandaTerimaNotaId
            }
        });
        return result;
   }

    async findAll({search, page, perPage}: IParamsQuery) {
        const skipPage = Number(page) * 10 - 10;
        const totalCount = await TandaTerimaNota.count();
        const totalPages = Math.ceil(totalCount / perPage);
        let result;
        if (search !== 'undefined') {
            result = await TandaTerimaNota.findMany({
                where: {
                    nomor: {
                        contains: search,
                        mode: 'insensitive'
                    },
                },
                skip: skipPage,
                take: Number(perPage),
                include: {
                    TandaTerimaNotaList:  true
                },
                orderBy: {
                    createdAt: 'desc'
                }
            });
        } else {
            result = await TandaTerimaNota.findMany({
                skip: skipPage,
                take: Number(perPage),
                include: {
                    TandaTerimaNotaList: true
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
        const result = await TandaTerimaNota.findUnique({
            where: {
                id
            }
        });
        return result;
    }

    async updateOneById(id: string, payload: TandaTerimaNotaDTO) {
        const { nomor, tanggal, updatedBy } = payload;
        const result = await TandaTerimaNota.update({
            where: {
                id
            },
            data: {
                nomor,
                tanggal,
                updatedBy,
                updatedAt: new Date()
            }
        });
        return result;
    }

    async deleteOneById(id: string) {
        const result = await TandaTerimaNota.delete({
            where: {
                id
            }
        });
        return result;
    }
   
}

export default TandaTerimaNotaService;