import prisma from "../../libs/prisma";
import BarangSuratJalanPoDTO from "./dto/barang-surat-jalan-po.dto";
const BarangSuratJalanPo = prisma.barangSuratJalanPo;

class BarangSuratJalanPoService {
    async create(payload: Omit<BarangSuratJalanPoDTO, "id">[]) {
        const result = await BarangSuratJalanPo.createMany({
            data: [...(payload as unknown as BarangSuratJalanPoDTO[])]
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
                suratJalanPoId,
                updatedAt: new Date()
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

    async deleteManyBySuratJalanPoId(suratJalanPoId: string) {
        const result = await BarangSuratJalanPo.deleteMany({
            where: {
                suratJalanPoId
            }
        });
        return result;
    }
}

export default BarangSuratJalanPoService;