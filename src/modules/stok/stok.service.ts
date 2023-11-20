import { PrismaClient } from "@prisma/client";
import StokDTO from "./dto/stok.dto";
import {IParamsQuery} from './interfaces/stok.interface';
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

    async findAll({search, page, perPage, tokoId}: IParamsQuery) {
        const skipPage = Number(page) * 10 - 10;
        const totalCount = await StokBarang.count();
        const totalPages = Math.ceil(totalCount / perPage);
        let result;
        if (tokoId === 'all') {
            if (search !== 'undefined') {
                result = await StokBarang.findMany({
                    where: {
                        nama: {
                            contains: search,
                            mode: 'insensitive'
                        },
                    },
                    skip: skipPage,
                    take: Number(perPage),
                    include: {
                        toko: true
                    },
                    orderBy: {
                        createdAt: 'desc'
                    }
                });
            } else {
                result = await StokBarang.findMany({
                    skip: skipPage,
                    take: Number(perPage),
                    include: {
                        toko: true
                    },
                    orderBy: {
                        createdAt: 'desc'
                    }
                });
            }
        } else {
            if (search !== 'undefined') {
                result = await StokBarang.findMany({
                    where: {
                        nama: {
                            contains: search,
                            mode: 'insensitive'
                        },
                        tokoId
                    },
                    skip: skipPage,
                    take: Number(perPage),
                    include: {
                        toko: true
                    },
                    orderBy: {
                        createdAt: 'desc'
                    }
                });
            } else {
                result = await StokBarang.findMany({
                    where: {
                        tokoId
                    },
                    skip: skipPage,
                    take: Number(perPage),
                    include: {
                        toko: true
                    },
                    orderBy: {
                        createdAt: 'desc'
                    }
                });
            }
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

    async updateManyById(payload: Pick<StokDTO, "id" | "jumlah">[]) {
        payload.forEach(async (item, index) => {
            const stokData = await StokBarang.findUnique({
                where: {
                    id: item.id
                }
            });
            await StokBarang.update({
                where: {
                    id: stokData?.id
                },
                data: {
                    ...stokData,
                    jumlah: item.jumlah
                }
            })
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