import { PrismaClient } from "@prisma/client";
import TandaTerimaNotaDTO from "./dto/tanda-terima-nota.dto";
const TandaTerimaNota = new PrismaClient().tandaTerimaNota;

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

    async findAll() {
        const result = await TandaTerimaNota.findMany({
            include: {
                InvoicePo: true
            }
        });
        return result;
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
                updatedBy
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