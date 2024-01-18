import StokDTO from "./dto/stok.dto";
import {IParamsQuery} from './interfaces/stok.interface';
import prisma from "../../libs/prisma";
const StokBarang = prisma.stokBarang;
const Toko = prisma.toko;
const debug = require('debug')('hbpos-server:stok-service');

class StokService {
    async create(payload: StokDTO) {
        const {nama, jumlah, satuan, hargaModal, hargaJual, createdBy, tokoId} = payload
        const generateCode = await this.generateCode(tokoId);
        debug(generateCode, "CREATE STOK GENERATE CODE");
        if (generateCode) {
            const result = await StokBarang.create({
                data: {
                    kode: generateCode,
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
        return false;
    }

    async generateCode(tokoId: string) {
        const toko = await Toko.findUnique({
            where: {
                id: tokoId
            }
        });
        if (toko) {
            const tokoDescription = toko.description.split(" ");
            let locationCode: string = '';
            tokoDescription.map((item) => locationCode += item[0]);
            const result = await StokBarang.findMany({
                where: {
                    kode: {
                        contains: locationCode,
                        mode: 'insensitive'
                    }
                },
                orderBy: {
                    id: 'desc'
                }
            });
            if (result[0]) {
                const lastNumber = result[0]?.kode.split("-")[1];
                if (lastNumber) {
                    return `${locationCode}-${Number(lastNumber) + 1}`;
                }
            } else {
                return `${locationCode}-1`;
            }
        }
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

    async findLastKode(locationCode: string) {
        const result = await StokBarang.findMany({
            where: {
                kode: {
                    contains: locationCode,
                    mode: 'insensitive'
                }
            },
            orderBy: {
                id: 'desc'
            }
        });
        return result[0].kode;
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
                tokoId,
                updatedAt: new Date()
            }
        });
        return result
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