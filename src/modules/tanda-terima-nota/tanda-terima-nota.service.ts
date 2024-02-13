import {TandaTerimaNotaDTO} from "./dto/tanda-terima-nota.dto";
import { NotaListDTO } from "./dto/nota-list-dto";
import { IParamsQuery } from "./interfaces/tanda-terima-nota.interface";
import prisma from "../../libs/prisma";
import moment from "moment";
const TandaTerimaNota = prisma.tandaTerimaNota;
const TandaTerimaNotaList = prisma.tandaTerimaNotaList;
const Toko = prisma.toko;

class TandaTerimaNotaService {
    async create(payload: TandaTerimaNotaDTO) {
        const { tanggal, jatuhTempo, createdBy, tokoId } = payload;
        const generateCode = await this.generateCode(tokoId, new Date());
        if (generateCode) {
            const result = await TandaTerimaNota.create({
                data: {
                    nomor: generateCode,
                    jatuhTempo: Number(jatuhTempo),
                    status: 'Sedang Diproses',
                    tanggal,
                    createdBy
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
            const menuCode = 'TTN';
            const dateCode = moment(createdAt).format('DDMMYY');
            const filterCode = `${locationCode}/${menuCode}/${dateCode}`;

            const result = await TandaTerimaNota.findMany({
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
        const { tanggal, jatuhTempo, updatedBy } = payload;
        const result = await TandaTerimaNota.update({
            where: {
                id
            },
            data: {
                tanggal,
                jatuhTempo: Number(jatuhTempo),
                updatedBy,
                updatedAt: new Date()
            }
        });
        return result;
    }

    async updateStatusById(id: string, payload: TandaTerimaNotaDTO) {
        const { status } = payload;
        const result = await TandaTerimaNota.update({
            where: {
                id
            },
            data: {
                status
            }
        })
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