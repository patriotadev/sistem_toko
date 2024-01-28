import {NotaPenjualanDTO} from "./dto/nota-penjualan.dto";
import { NotaPenjualanListDTO } from "./dto/nota-penjualan-list.dto";
import { IParamsQuery } from "./interfaces/nota-penjualan.interface";
import prisma from "../../libs/prisma";
import moment from "moment";
const NotaPenjualan = prisma.notaPenjualan;
const NotaPenjualanList = prisma.notaPenjualanList;
const Toko = prisma.toko;

class NotaPenjualanService {
    async create(payload: NotaPenjualanDTO) {
        const { tanggal, createdBy, tokoId } = payload;
        const generateCode = await this.generateCode(tokoId, new Date());
        if (generateCode) {
            const result = await NotaPenjualan.create({
                data: {
                    nomor: generateCode,
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
            const menuCode = 'TTN-PN';
            const dateCode = moment(createdAt).format('DDMMYY');
            const filterCode = `${locationCode}/${menuCode}/${dateCode}`;

            const result = await NotaPenjualan.findMany({
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

    async createNotaList(payload: Omit<NotaPenjualanListDTO, "id">[]) {
        const result = await NotaPenjualanList.createMany({
            data: [...(payload as [])]
        });
        return result
    }

    async deleteManyNotaList(notaPenjualanId: string) {
        const result = await NotaPenjualanList.deleteMany({
            where: {
                notaPenjualanId
            }
        });
        return result;
   }

   async findAll({search, page, perPage}: IParamsQuery) {
        const skipPage = Number(page) * 10 - 10;
        const totalCount = await NotaPenjualan.count();
        const totalPages = Math.ceil(totalCount / perPage);
        let result;
        if (search !== 'undefined') {
            result = await NotaPenjualan.findMany({
                where: {
                    nomor: {
                        contains: search,
                        mode: 'insensitive'
                    },
                },
                skip: skipPage,
                take: Number(perPage),
                include: {
                    NotaPenjualanList:  true
                },
                orderBy: {
                    createdAt: 'desc'
                }
            });
        } else {
            result = await NotaPenjualan.findMany({
                skip: skipPage,
                take: Number(perPage),
                include: {
                    NotaPenjualanList: true
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
        const result = await NotaPenjualan.findUnique({
            where: {
                id
            }
        });
        return result;
    }

    async updateOneById(id: string, payload: NotaPenjualanDTO) {
        const { tanggal, updatedBy } = payload;
        const result = await NotaPenjualan.update({
            where: {
                id
            },
            data: {
                tanggal,
                updatedBy,
                updatedAt: new Date()
            }
        });
        return result;
    }

    async deleteOneById(id: string) {
        const result = await NotaPenjualan.delete({
            where: {
                id
            }
        });
        return result;
    }
}

export default NotaPenjualanService;