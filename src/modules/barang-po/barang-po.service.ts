import { PrismaClient } from "@prisma/client";
import BarangPoDTO from "./dto/barang-po.dto";
const BarangPo = new PrismaClient().barangPo;
const Prisma = new PrismaClient();

class BarangPoService {
    async create(payload: Omit<BarangPoDTO, "id">[]) {
        const result = await BarangPo.createMany({
            data: [...(payload as unknown as [])]
        });
        return result;
    }

    async createOne(payload: Omit<BarangPoDTO, "id">) {
        const result = await BarangPo.create({
            data: {
                ...payload as any
            }
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

    async findLastStep(poId: string, stokBarangId: string) {
        const maxStep = await BarangPo.aggregate({
            where: {
                poId,
                stokBarangId
            },
            _max: {
                step: true
            }
        });
        console.log("serviceeLastStepp=>", maxStep);
        const result = await BarangPo.findFirst({
            where: {
                poId,
                stokBarangId,
                step: maxStep._max.step as number
            }
        });
        return result;
    }

    async findPreviousDifferenceQty(firstStep: number, lastStep: number, stokBarangId: string) {
        const firstStepQty = await BarangPo.findFirst({
            where: {
                step: firstStep,
                stokBarangId
            }
        });
        const lastStepQty = await BarangPo.findFirst({
            where: {
                step: lastStep,
                stokBarangId
            }
        });
        if (firstStepQty && lastStepQty) {
            return firstStepQty?.qty - lastStepQty?.qty;
        }
        return null;
        // const result = await BarangPo.aggregate({
        //     where: {
        //         stokBarangId,
        //         step: {
        //             lt: currentStep
        //         }
        //     },
        //     _sum: {
        //         qty: true
        //     }

        // })
        // return result._sum.qty;
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
            kode,
            nama,
            qty,
            satuan,
            discount,
            harga,
            jumlahHarga,
            updatedBy,
            step,
            isMaster,
            poId,
            stokBarangId,
        } =  payload
        const result = await BarangPo.update({
            where: {
                id
            },
            data: {
                kode,
                nama,
                qty: Number(qty),
                satuan,
                discount: Number(discount),
                harga: Number(harga),
                jumlahHarga: Number(jumlahHarga),
                step,
                updatedBy,
                isMaster,
                poId,
                stokBarangId,
                updatedAt: new Date()
            }
        });
        return result;
    }

    async updateManyById(payload: BarangPoDTO[]) {
        const result = await BarangPo.updateMany({
            data: [...(payload as unknown as [])]
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