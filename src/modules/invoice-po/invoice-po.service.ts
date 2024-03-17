import {InvoicePoDTO} from "./dto/invoice-po.dto";
import { InvoicePoListDTO } from "./dto/invoice-po-list.dto";
import { IParamsQuery } from "./interfaces/invoice-po.interface";
import prisma from "../../libs/prisma";
const InvoicePo = prisma.invoicePo;
const InvoicePoList = prisma.invoicePoList;
import moment from 'moment';
const Toko = prisma.toko;
const debug = require('debug')('hbpos-server:invoice-po-controller');

class InvoicePoService {
    async create(payload: InvoicePoDTO) {
        const { createdBy, tokoId, poId, suratJalanPoId } = payload;
        const generateCode = await this.generateCode(tokoId, new Date());
        debug(generateCode, ">>> GENERATE CODE INVOICE PO")
        if (generateCode) {
            const result = await InvoicePo.create({
                data: {
                    nomor: generateCode,
                    poId: poId,
                    suratJalanPoId: suratJalanPoId,
                    createdBy,
                    status: 'Belum Tanda Terima'
                },
            });
            return result;
        }
    }

    async createInvoicePoList(payload: Omit<InvoicePoListDTO, "id">[]) {
        const result = await InvoicePoList.createMany({
            data: [...(payload as [])]
        });
        return result
    }

    async generateCode(tokoId: string, createdAt: Date) {
        const toko = await Toko.findUnique({
            where: {
                id: tokoId
            }
        });

        if (toko) {
            const tokoDescription = toko.description.split(" ");
            let locationCode: string = '';
            tokoDescription.map((item) => locationCode += item[0]);
            const menuCode = 'INV';
            const dateCode = moment(createdAt).format('DDMMYY');
            const filterCode = `${locationCode}/${menuCode}/${dateCode}`;

            const result = await InvoicePo.findMany({
                where: {
                    nomor: {
                        contains: filterCode,
                        mode: 'insensitive'
                    }
                },
                orderBy: {
                    id: 'desc'
                }
            });
            if (result[0]) {
                const lastNumber = result[0]?.nomor.split("/")[3];
                if (lastNumber) {
                    return `${locationCode}/${menuCode}/${dateCode}/${Number(lastNumber) + 1}`;
                }
            } else {
                return `${locationCode}/${menuCode}/${dateCode}/1`;
            }
        }
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
                    InvoicePoList:  true,
                    SuratJalanPo: true,
                    TandaTerimaNotaList: true,
                    Po: true
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
                    InvoicePoList: true,
                    SuratJalanPo: true,
                    TandaTerimaNotaList: true,
                    Po: true
                },
                orderBy: {
                    createdAt: 'desc'
                }
            });
        }

        // NEW RESULT
        // PT NAME
        // BARANG SURAT JALAN PO
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

    async findManyById(id: any) {
        const invoicePoId = id?.split(", ");
        console.log("po id listt==>", invoicePoId);
        const result = await InvoicePo.findMany({
            where: {
                id: {
                    in: invoicePoId
                }
            },
            include: {
                InvoicePoList: true
            }
        });
        console.log("po list from invoice ==>", result);
        return result;
    }

    async updateOneById(id: string, payload: InvoicePoDTO) {
        const { updatedBy } = payload;
        const result = await InvoicePo.update({
            where: {
                id
            },
            data: {
                updatedBy,
                updatedAt: new Date()
            }
        });
        return result;
    }

    // async updateStatusById(id: string, payload: InvoicePoDTO) {
    //     const { status } = payload;
    //     const result = await InvoicePo.update({
    //         where: {
    //             id
    //         },
    //         data: {
    //             status,
    //             updatedAt: new Date()
    //         }
    //     });
    //     debug(result);
    //     return result;
    // }

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