import {InvoicePenjualanDTO} from "./dto/invoice-penjualan.dto";
import { InvoicePenjualanListDTO } from "./dto/invoice-penjualan-list.dto";
import { IParamsQuery } from "./interfaces/invoice-penjualan.interface";
import prisma from "../../libs/prisma";
const InvoicePenjualan = prisma.invoicePenjualan;
const InvoicePenjualanList = prisma.invoicePenjualanList;
import moment from 'moment';
const Toko = prisma.toko;
const debug = require('debug')('hbpos-server:invoice-penjualan-controller');

class InvoicePenjualanService {
    async create(payload: InvoicePenjualanDTO) {
        const { createdBy, tokoId } = payload;
        const generateCode = await this.generateCode(tokoId, new Date());
        debug(generateCode, ">>> GENERATE CODE INVOICE PO")
        if (generateCode) {
            const result = await InvoicePenjualan.create({
                data: {
                    nomor: generateCode,
                    status: 'Sedang Diproses',
                    createdBy
                },
            });
            return result;
        }
    }

    async createInvoicePenjualanList(payload: Omit<InvoicePenjualanListDTO, "id">[]) {
        const result = await InvoicePenjualanList.createMany({
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
            const menuCode = 'INV-PN';
            const dateCode = moment(createdAt).format('DDMMYY');
            const filterCode = `${locationCode}/${menuCode}/${dateCode}`;

            const result = await InvoicePenjualan.findMany({
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

    async deleteManyInvoicePenjualanList(invoicePenjualanId: string) {
        const result = await InvoicePenjualanList.deleteMany({
            where: {
                invoicePenjualanId
            }
        });
        return result
   }

   async findAll({search, page, perPage}: IParamsQuery) {
    const skipPage = Number(page) * 10 - 10;
    const totalCount = await InvoicePenjualan.count();
    const totalPages = Math.ceil(totalCount / perPage);
    let result;
    if (search !== 'undefined') {
        result = await InvoicePenjualan.findMany({
            where: {
                nomor: {
                    contains: search,
                    mode: 'insensitive'
                },
            },
            skip: skipPage,
            take: Number(perPage),
            include: {
                InvoicePenjualanList:  true
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
    } else {
        result = await InvoicePenjualan.findMany({
            skip: skipPage,
            take: Number(perPage),
            include: {
                InvoicePenjualanList: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
    }

    debug(result, ">> GET ALL INVOICE PENJUALAN");
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
    const result = await InvoicePenjualan.findUnique({
        where: {
            id
        }
    });
    return result;
}

async findManyById(id: any) {
    const invoicePenjualanId = id?.split(", ");
    const result = await InvoicePenjualan.findMany({
        where: {
            id: {
                in: invoicePenjualanId
            }
        },
        include: {
            InvoicePenjualanList: true
        }
    });
    return result;
}

async updateOneById(id: string, payload: InvoicePenjualanDTO) {
    const { updatedBy } = payload;
    const result = await InvoicePenjualan.update({
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

async updateStatusById(id: string, payload: InvoicePenjualanDTO) {
    const { status } = payload;
    const result = await InvoicePenjualan.update({
        where: {
            id
        },
        data: {
            status,
            updatedAt: new Date()
        }
    });
    debug(result);
    return result;
}

async deleteOneById(id: string) {
    const result = await InvoicePenjualan.delete({
        where: {
            id
        }
    });
    return result;
}

}

export default InvoicePenjualanService;