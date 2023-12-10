import { PrismaClient } from "@prisma/client";
import {InvoicePoDTO} from "./dto/invoice-po.dto";
import { InvoicePoListDTO } from "./dto/invoice-po-list.dto";
import { IParamsQuery } from "./interfaces/invoice-po.interface";
const InvoicePo = new PrismaClient().invoicePo;
const InvoicePoList = new PrismaClient().invoicePoList;

class InvoicePoService {
    async create(payload: InvoicePoDTO) {
        const { nomor, createdBy } = payload;
        const result = await InvoicePo.create({
            data: {
                nomor,
                createdBy
            },
        });
        return result;
    }

    async createInvoicePoList(payload: Omit<InvoicePoListDTO, "id">[]) {
        const result = await InvoicePoList.createMany({
            data: [...(payload as [])]
        });
        return result
    }

   async deleteManyInvoicePoList(invoicePoId: string) {
        const result = await InvoicePoList.deleteMany({
            where: {
                invoicePoId
            }
        });
        return result
   }

    async findAll({search, page, perPage}: IParamsQuery) {
        const skipPage = Number(page) * 10 - 10;
        const totalCount = await InvoicePo.count();
        const totalPages = Math.ceil(totalCount / perPage);
        let result;
        if (search !== 'undefined') {
            result = await InvoicePo.findMany({
                where: {
                    nomor: {
                        contains: search,
                        mode: 'insensitive'
                    },
                },
                skip: skipPage,
                take: Number(perPage),
                include: {
                    InvoicePoList:  true
                },
                orderBy: {
                    createdAt: 'desc'
                }
            });
        } else {
            result = await InvoicePo.findMany({
                skip: skipPage,
                take: Number(perPage),
                include: {
                    InvoicePoList: true
                },
                orderBy: {
                    createdAt: 'desc'
                }
            });
        }
        return {
            data: result,
            document: {
                currentPage: Number(page),
                pageSize: Number(perPage),
                totalCount,
                totalPages,
            }
        };
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
        const { nomor, updatedBy } = payload;
        const result = await InvoicePo.update({
            where: {
                id
            },
            data: {
                nomor,
                updatedBy
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