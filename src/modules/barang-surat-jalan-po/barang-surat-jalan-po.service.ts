import { PrismaClient } from "@prisma/client";
import BarangSuratJalanPoDTO from "./dto/barang-surat-jalan-po.dto";
const BarangSuratJalanPo = new PrismaClient().barangSuratJalanPo;

class BarangSuratJalanPoService {
    async create(payload: BarangSuratJalanPoDTO) {
        const { nama, qty, satuan, createdBy, suratJalanPoId } = payload;
        const result = await BarangSuratJalanPo.create({
            data: {
                nama,
                qty,
                satuan,
                createdBy,
                suratJalanPoId
            }
        });
        return result;
    }

    async findAll() {
        const result = await BarangSuratJalanPo.findMany({
            include: {
                suratJalanPo: true
            }
        });
        return result;
    }

    async findOneById(id: string) {
        const result = await BarangSuratJalanPo.findUnique({
            where: {
                id
            }
        });
        return result;
    }

    async updateOneById(id: string, payload: BarangSuratJalanPoDTO) {
        const { nama, qty, satuan, updatedBy, suratJalanPoId } = payload;
        const result = await BarangSuratJalanPo.update({
            where: {
                id
            },
            data: {
                nama,
                qty,
                satuan,
                updatedBy,
                suratJalanPoId
            }
        });
        return result;
    }

    async deleteOneById(id: string) {
        const result = await BarangSuratJalanPo.delete({
            where: {
                id
            }
        });
        return result;
    }
}

export default BarangSuratJalanPoService;