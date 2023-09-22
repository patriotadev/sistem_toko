import { PrismaClient } from "@prisma/client";
import TokoDTO from "./dto/toko.dto";
const Toko = new PrismaClient().toko;

class TokoService {

    async createToko(payload: TokoDTO) {
        const { description } = payload;
        const result = await Toko.create({
            data: {
                description
            }
        });
        return result;
    }

    async findAll() {
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