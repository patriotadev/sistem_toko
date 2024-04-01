import { PrismaClient, Toko } from "@prisma/client";
import TokoDTO from "./dto/toko.dto";
import { IParamsQuery } from "./interfaces/toko.interface";
const Toko = new PrismaClient().toko;

class TokoService {

    async createToko(payload: TokoDTO) {
        const { description, contact, address, city } = payload;
        const result = await Toko.create({
            data: {
                description,
                contact,
                address,
                city
            }
        });
        return result;
    }

    async updateToko(id: string, payload: TokoDTO) {
        const { description, contact, address, city } = payload;
        const result = Toko.update({
            where: {
                id
            },
            data: {
                description,
                contact,
                address,
                city
            }
        });
        return result;
    }

    async deleteToko(id: string) {
        const result = Toko.delete({
            where: {
                id
            }
        });
        return result;
    }

    async findAll({search, page, perPage}: IParamsQuery) {
        const skipPage = Number(page) * 10 - 10;
        const totalCount = await Toko.count();
        const totalPages = Math.ceil(totalCount / perPage);
        let result = {};
        if (search !== 'undefined') {
            result = await Toko.findMany({
                where: {
                    description: {
                        contains: search,
                        mode: 'insensitive'
                    }
                },
                skip: skipPage,
                take: Number(perPage),
                include: {
                    User: true
                }
            });
        } else {
            result = await Toko.findMany({
                skip: skipPage,
                take: Number(perPage),
                include: {
                    User: true
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

    async findList() {
        const result = await Toko.findMany({
            include: {
                User: true,
            }
        });
        return result;
    }

    async findOneById(id: string) {
        const result = await Toko.findUnique({
            where: {
                id
            },
            include: {
                User: true
            }
        });

        return result;
    }
}

export default TokoService;