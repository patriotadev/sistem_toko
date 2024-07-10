
import {PaymentAccountDTO} from "./dto/payment-account.dto";
import prisma from "../../libs/prisma";
import moment from "moment";
import { IParamsQuery, IPaymentAccount } from "./interfaces/payment-account.interface";
const PaymentAccount = prisma.paymentAccount;
const debug = require('debug')('hbpos-server:payment-account-service');

class PaymentAccountService {
    async create(payload: PaymentAccountDTO) {
        const result = await PaymentAccount.create({
            data: payload
        });
        return result;
    }

    async findAll(query: IParamsQuery) {
        const sizePerPage = query.perPage ? Number(query.perPage) : 100;                                         
        const skipPage = sizePerPage * query.page - sizePerPage;
        const totalCount = await PaymentAccount.count();
        const totalPages = Math.ceil(totalCount / query.perPage);
        const where = {} as any;

        if (query.search !== 'undefined') {
            where['OR'] = [
                {
                    bankName:{
                        contains: query.search,
                        mode: 'insensitive'
                    },
                },
                {
                    accountNumber:{
                        contains: query.search,
                        mode: 'insensitive'
                    },
                },
                {
                    accountName:{
                        contains: query.search,
                        mode: 'insensitive'
                    },
                },
            ]
        }

        debug(where);

        const result = await PaymentAccount.findMany({
            where,
            skip: skipPage,
            take: Number(sizePerPage),
            orderBy: {
                id: 'desc'
            }
        });

        return {
            data: result,
            document: {
                currentPage: Number(query.page),
                pageSize: Number(sizePerPage),
                totalCount,
                totalPages,
            }
        };
    }

    async update(payload: PaymentAccountDTO) {
        const result = await PaymentAccount.update({
            where: {
                id: payload?.id
            },
            data: payload
        });

        return result;
    }

    async destroy(payload: PaymentAccountDTO) {
        const result = await PaymentAccount.delete({
            where: {
                id: payload?.id
            }
        });

        return result;
    }
}

export default PaymentAccountService;