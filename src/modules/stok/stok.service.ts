import { PrismaClient } from "@prisma/client";
import StokDTO from "./dto/stok.dto";
import {IParamsQuery} from './interfaces/stok.interface';
const StokBarang = new PrismaClient().stokBarang;

class StokService {
    async create(payload: StokDTO) {
        const {kode, nama, jumlah, satuan, hargaModal, hargaJual, createdBy, tokoId} = payload
        const result = await StokBarang.create({
            data: {
                kode,
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
                        OR: [
                            {
                                nama: {
                                    contains: search,
                                    mode: 'insensitive'
                                },
                            },
                            {
                                kode: {
                                    contains: search,
                                    mode: 'insensitive'
                                },
                            }

                        ]
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
                        OR: [
                            {
                                nama: {
                                    contains: search,
                                    mode: 'insensitive'
                                },
                            },
                            {
                                kode: {
                                    contains: search,
                                    mode: 'insensitive'
                                },
                            }

                        ]
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
        console.log(id, "==> id on service")
        const result = await StokBarang.findUnique({
            where : {
                id
            },
            include: {
                toko: true
            }
        });
        console.log(result, "==> result on service")
        return result;
    }

    async updateOneById(id: string, payload: StokDTO) {
        const { kode, nama, jumlah, satuan, hargaModal, hargaJual, updatedBy, tokoId } = payload
        const result = await StokBarang.update({
            where: {
                id
            },
            data: {
                kode,
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
            if (stokData) {
                await StokBarang.update({
                    where: {
                        id: stokData?.id
                    },
                    data: {
                        ...stokData,
                        jumlah: stokData?.jumlah - item.jumlah
                    }
                });
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