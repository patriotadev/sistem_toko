import { PrismaClient } from "@prisma/client";
import SuratJalanPoDTO from "./dto/surat-jalan-po.dto";
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

    async findAll() {
        const result = await SuratJalanPo.findMany({
            include: {
                Po: true
            }
        });
        return result;
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