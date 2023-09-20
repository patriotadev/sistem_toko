import { PrismaClient } from "@prisma/client";
import StokDTO from "./dto/stok.dto";
const StokBarang = new PrismaClient().stokBarang;

class StokService {
    async create(payload: StokDTO) {
        const {nama, jumlah, hargaModal, hargaJual, createdBy, locationId} = payload
        const result = await StokBarang.create({
            data: {
                nama,
                jumlah,
                hargaModal,
                hargaJual,
                createdBy,
                locationId
            }
        })
        return result;
    }

    async findAll() {
        const result = await StokBarang.findMany({
            include: {
                location: true
            }
        })
        return result;
    }

    async findOneById(id: string) {
        const result = await StokBarang.findUnique({
            where : {
                id
            }
        })
        return result;
    }

    async updateOneById(id: string, payload: StokDTO) {
        const { nama, jumlah, hargaModal, hargaJual, updatedBy, locationId } = payload
        const result = await StokBarang.update({
            where: {
                id
            },
            data: {
                nama,
                jumlah,
                hargaModal,
                hargaJual,
                updatedBy,
                locationId
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