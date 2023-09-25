import { PrismaClient } from '@prisma/client'
import PtDTO from './dto/pt.dto';
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

    async findAll() {
        const result = await Pt.findMany();
        return result;
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