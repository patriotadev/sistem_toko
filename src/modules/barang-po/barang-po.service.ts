import { PrismaClient } from "@prisma/client";
import BarangPoDTO from "./dto/barang-po.dto";
const BarangPo = new PrismaClient().barangPo;

class BarangPoService {
    async create(payload: BarangPoDTO[]) {
        const result = await BarangPo.createMany({
            data: [...(payload as unknown as [])]
        });
        return result;
    }

    async findAll(poId: string) {
        const result = await BarangPo.findMany({
            where: {
                poId
            }
        });
        return result;
    }

    async findOneById(id: string) {
        const result = await BarangPo.findUnique({
            where: {
                id
            }
        });
        return result;
    }

    async updateOneById(id: string, payload: BarangPoDTO) {
        const {  
            nama,
            qty,
            satuan,
            discount,
            harga,
            jumlahHarga,
            updatedBy,
            poId
        } =  payload
        const result = await BarangPo.update({
            where: {
                id
            },
            data: {
                nama,
                qty: Number(qty),
                satuan,
                discount: Number(discount),
                harga: Number(harga),
                jumlahHarga: Number(jumlahHarga),
                updatedBy,
                poId
            }
        });
        return result;
    }

    async deleteOneById(id: string) {
        const result = await BarangPo.delete({
            where: {
                id
            }
        });
        return result;
    }

    async deleteManyByPoId(poId: string) {
        const result = await BarangPo.deleteMany({
            where: {
                poId
            }
        });
        return result;
    }
}

export default BarangPoService;