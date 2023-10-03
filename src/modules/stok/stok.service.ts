import { PrismaClient } from "@prisma/client";
import StokDTO from "./dto/stok.dto";
import {IPaginationQuery} from './interfaces/stok.interface';
const StokBarang = new PrismaClient().stokBarang;

class StokService {
    async create(payload: StokDTO) {
        const {nama, jumlah, satuan, hargaModal, hargaJual, createdBy, tokoId} = payload
        const result = await StokBarang.create({
            data: {
                nama,
                jumlah,
                satuan,
                hargaModal,
                hargaJual,
                createdBy,
                tokoId
            }
        })
        return result;
    }

    async findAll({page, perPage}: IPaginationQuery) {
        const skipPage = Number(page) * 10 - 10;
        const result = await StokBarang.findMany({
            skip: skipPage,
            take: Number(perPage),

            include: {
                toko: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        })
        return result;
    }

    async findOneById(id: string) {
        const result = await StokBarang.findUnique({
            where : {
                id
            },
            include: {
                toko: true
            }
        })
        return result;
    }

    async updateOneById(id: string, payload: StokDTO) {
        const { nama, jumlah, satuan, hargaModal, hargaJual, updatedBy, tokoId } = payload
        const result = await StokBarang.update({
            where: {
                id
            },
            data: {
                nama,
                jumlah,
                satuan,
                hargaModal,
                hargaJual,
                updatedBy,
                tokoId
            }
        })
    }

    async deleteOneById(id: string) {
        const result = await StokBarang.delete({
            where: {
                id
            }
        })
        return result;
    }
}

export default StokService;