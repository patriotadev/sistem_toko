import StokDTO from "./dto/stok.dto";
import {IParamsQuery} from './interfaces/stok.interface';
import prisma from "../../libs/prisma";
import TabStatus from "./enum/tab.enum";
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

    async createStokPo(payload: Omit<StokDTO, "id">[]) {
        await Promise.all(payload.map(async (item, index) => {
            const generateCode = await this.generateCode(item.tokoId);
            const counter = Number(generateCode?.split('-')[1]) + index;
            const newGenerateCode = `${generateCode?.split('-')[0]}-${counter}`
            debug(generateCode, ">>> generateCode");
            debug(newGenerateCode, ">>> newGenerateCode");
            if (generateCode) {
                if (item.kode === item.nama) {
                    await StokBarang.create({
                        data: {
                            id: item.tempStokId,
                            kode: newGenerateCode,
                            nama: item.nama,
                            jumlah: item.jumlah,
                            jumlahPo: item.jumlahPo,
                            isPo: item.isPo,
                            satuan: item.satuan,
                            hargaJual: item.hargaJual,
                            createdBy: item.createdBy,
                            tokoId: item.tokoId,
                        }
                    });
                } else {
                    debug(item.kode, ">>> item kode");
                    await StokBarang.update({
                        where: {
                            kode: item.kode,
                        },
                        data: {
                            jumlahPo: item.jumlahPo
                        }
                    })
                }
            }
        }));
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
                    ctId: 'desc'
                }
            });
            debug(result[0], ">>> result[0]");
            if (result[0]) {
                const lastNumber = result[0]?.kode.split("-")[1];
                if (lastNumber) {
                    debug(lastNumber, "last genCode");
                    return `${locationCode}-${Number(lastNumber) + 1}`;
                }
            } else {
                return `${locationCode}-1`;
            }
        }
    }

    async findAll(payload: IParamsQuery) {
        const {search, page, perPage, tokoId, tab} = payload;
        const sizePerPage = perPage ? Number(perPage) : 100;                                         
        const skipPage = sizePerPage * page - sizePerPage;
        const totalCount = tab === TabStatus.STOK_TERSEDIA ? await StokBarang.count({
            where: {
                isPo: false
            }
        }) : await StokBarang.count({
            where: {
                jumlahPo: {
                    gt: 0
                }
        }});
        const totalPages = Math.ceil(totalCount / sizePerPage);
        let result;

        if (tab === TabStatus.STOK_TERSEDIA) {
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
    
                            ],
                            isPo: false
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
                        where: {
                            isPo: false
                        },
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
    
                            ],
                            isPo: false
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
                            tokoId,
                            isPo: false
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
        } else if (tab === TabStatus.STOK_PO) {
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
                                },
                            ],
                            // isPo: true,
                            jumlahPo: {
                                gt: 0
                            }
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
                        where: {
                            OR: [
                                {
                                    isPo: true,
                                },
                                {
                                    jumlahPo: {
                                        gt: 0
                                    }
                                }
                            ],
                            // isPo: true,
                            jumlahPo: {
                                gt: 0
                            }
                        },
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
                                },
                            ],
                            tokoId,
                            // isPo: true,
                            jumlahPo: {
                                gt: 0
                            }
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
                            OR: [
                                {
                                    isPo: true,
                                },
                                {
                                    jumlahPo: {
                                        gt: 0
                                    }
                                }
                            ],
                            tokoId,
                            // isPo: true,
                            jumlahPo: {
                                gt: 0
                            }
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
        } else {
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
    
                            ],
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
    
                            ],
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
                            tokoId,
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
        }


        debug(result.length);

        return {
            data: result,
            document: {
                currentPage: Number(page),
                pageSize: sizePerPage,
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
        const { kode, nama, jumlah, satuan, hargaModal, hargaJual, updatedBy, tokoId, jumlahPo } = payload
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
                // tokoId,
                jumlahPo,
                updatedAt: new Date()
            }
        });
        return result
    }

    async updateManyById(payload: Pick<StokDTO, "id" | "jumlah">[]) {
        debug(payload, ">>> BARANG PAYLOAD");
        await Promise.all(payload.map( async(item) => {
            debug(item, ">>> BARANG");
            const stokData = await StokBarang.findUnique({
                where: {
                    id: item.id
                }
            });
            if (stokData) {
                await StokBarang.update({
                    where: {
                        id: item?.id
                    },
                    data: {
                        jumlah: stokData?.jumlah - item.jumlah
                    }
                });
            }
        }));
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