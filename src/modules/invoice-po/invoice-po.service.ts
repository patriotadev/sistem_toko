import { PrismaClient } from "@prisma/client";
import InvoicePoDTO from "./dto/invoice-po.dto";
const InvoicePo = new PrismaClient().invoicePo;

class InvoicePoService {
    async create(payload: InvoicePoDTO) {
        const { nomor, createdBy, poId, tandaTerimaNotaId } = payload;
        const result = await InvoicePo.create({
            data: {
                nomor,
                createdBy,
                poId,
                tandaTerimaNotaId
            }
        });
        return result;
    }

    async findAll() {
        const result = await InvoicePo.findMany({
            include: {
                po: true
            }
        });
        return result;
    }

    async findOneById(id: string) {
        const result = await InvoicePo.findUnique({
            where: {
                id
            }
        });
        return result;
    }

    async updateOneById(id: string, payload: InvoicePoDTO) {
        const { nomor, updatedBy, poId, tandaTerimaNotaId } = payload;
        const result = await InvoicePo.update({
            where: {
                id
            },
            data: {
                nomor,
                updatedBy,
                poId,
                tandaTerimaNotaId
            }
        });
        return result;
    }

    async deleteOneById(id: string) {
        const result = await InvoicePo.delete({
            where: {
                id
            }
        });
        return result;
    }
}

export default InvoicePoService;