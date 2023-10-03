import { PrismaClient } from "@prisma/client";
import BarangPoDTO from "./dto/barang-po.dto";
const BarangPo = new PrismaClient().barangPo;

class BarangPoService {
    async create(payload: BarangPoDTO) {
        const { 
            nama,
            qty,
            satuan,
            discount,
            harga,
            jumlahHarga,
            createdBy,
            poId
        } = payload;
        const result = await BarangPo.create({
            data: {
                nama,
                qty,
                satuan,
                discount: discount || 0,
                harga,
                jumlahHarga,
                createdBy,
                poId
            }
        });
        return result;
    }

    async findAll() {
        const result = await BarangPo.findMany({
            include: {
                po: true
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
                qty,
                satuan,
                discount,
                harga,
                jumlahHarga,
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
}

export default BarangPoService;