import SuratJalanPoDTO from "./dto/surat-jalan-po.dto";
import { IParamsQuery, ISuratJalanPo } from "./interfaces/surat-jalan-po.interface";
import prisma from "../../libs/prisma";
import moment from "moment";
const SuratJalanPo = prisma.suratJalanPo;
const Toko = prisma.toko;
const StokBarang = prisma.stokBarang;
const BarangSuratJalanPo = prisma.barangSuratJalanPo;
const Pt = prisma.pt;
const debug = require('debug')('hbpos-server:surat-jalan-po-controller');

class SuratJalanPoService {
    async create (payload: SuratJalanPoDTO) {
        const { namaSupir, createdBy, tanggal, poId, tokoId } = payload;
        const generateCode = await this.generateCode(tokoId, new Date());
        if (generateCode) {
            const result = await SuratJalanPo.create({
                data : {
                    nomor: generateCode,
                    namaSupir,
                    createdBy,
                    tanggal,
                    poId,
                }
            });
            return result;
        }
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
            const menuCode = 'SJ';
            const dateCode = moment(createdAt).format('DDMMYY');
            const filterCode = `${locationCode}/${menuCode}/${dateCode}`;

            const result = await SuratJalanPo.findMany({
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

    async getList({search}: {search: string}) {
        let result;
        if (search !== 'undefined') {
            result = await SuratJalanPo.findMany({
                where: {
                    nomor: {
                        contains: search,
                        mode: 'insensitive'
                    }
                }
            });
        } else {
            result = await SuratJalanPo.findMany();
        }

        return result;
    }

    async findAll({search, page, perPage, status, poId, ptId, projectId}: IParamsQuery) {
        const skipPage = Number(page) * 10 - 10;
        const totalCount = await SuratJalanPo.count();
        const totalPages = Math.ceil(totalCount / perPage);
        let result;

        if (status === 'Sudah Invoice') {
            if (poId !== 'undefined') {
                if (ptId === 'all') {
                    if (projectId === 'all') {
                        if (search !== 'undefined') {
                            result = await SuratJalanPo.findMany({
                                where: {
                                    OR: [
                                        {
                                            nomor:{
                                                contains: search,
                                                mode: 'insensitive'
                                            },
                                        },
                                    ],
                                    InvoicePo: {
                                        some: {}
                                    },
                                    poId
                                },
                                skip: skipPage,
                                take: Number(perPage),
                                include: {
                                    Po: true,
                                    BarangSuratJalanPo: true,
                                    InvoicePo: true,
                                },
                                orderBy: {
                                    createdAt: 'desc'
                                }
                            });
                        } else {
                            result = await SuratJalanPo.findMany({
                                where: {
                                    InvoicePo: {
                                        some: {}
                                    },
                                    poId
                                },
                                skip: skipPage,
                                take: Number(perPage),
                                include: {
                                    Po: true,
                                    BarangSuratJalanPo: true,
                                    InvoicePo: true
                                },
                                orderBy: {
                                    createdAt: 'desc'
                                }
                            });
                        }
                    } else {
                        if (search !== 'undefined') {
                            result = await SuratJalanPo.findMany({
                                where: {
                                    OR: [
                                        {
                                            nomor:{
                                                contains: search,
                                                mode: 'insensitive'
                                            },
                                        },
                                    ],
                                    InvoicePo: {
                                        some: {}
                                    },
                                    poId,
                                    Po: {
                                        projectId
                                    }
                                },
                                skip: skipPage,
                                take: Number(perPage),
                                include: {
                                    Po: true,
                                    BarangSuratJalanPo: true,
                                    InvoicePo: true,
                                },
                                orderBy: {
                                    createdAt: 'desc'
                                }
                            });
                        } else {
                            result = await SuratJalanPo.findMany({
                                where: {
                                    InvoicePo: {
                                        some: {}
                                    },
                                    poId,
                                    Po: {
                                        projectId
                                    }
                                },
                                skip: skipPage,
                                take: Number(perPage),
                                include: {
                                    Po: true,
                                    BarangSuratJalanPo: true,
                                    InvoicePo: true
                                },
                                orderBy: {
                                    createdAt: 'desc'
                                }
                            });
                        }
                    }
                    // end pt
                } else {
                    if (projectId === 'all') {
                        if (search !== 'undefined') {
                            result = await SuratJalanPo.findMany({
                                where: {
                                    OR: [
                                        {
                                            nomor:{
                                                contains: search,
                                                mode: 'insensitive'
                                            },
                                        },
                                    ],
                                    InvoicePo: {
                                        some: {}
                                    },
                                    poId,
                                    Po: {
                                        ptId
                                    }
                                },
                                skip: skipPage,
                                take: Number(perPage),
                                include: {
                                    Po: true,
                                    BarangSuratJalanPo: true,
                                    InvoicePo: true,
                                },
                                orderBy: {
                                    createdAt: 'desc'
                                }
                            });
                        } else {
                            result = await SuratJalanPo.findMany({
                                where: {
                                    InvoicePo: {
                                        some: {}
                                    },
                                    poId,
                                    Po: {
                                        ptId
                                    }
                                },
                                skip: skipPage,
                                take: Number(perPage),
                                include: {
                                    Po: true,
                                    BarangSuratJalanPo: true,
                                    InvoicePo: true
                                },
                                orderBy: {
                                    createdAt: 'desc'
                                }
                            });
                        }
                    } else {
                        if (search !== 'undefined') {
                            result = await SuratJalanPo.findMany({
                                where: {
                                    OR: [
                                        {
                                            nomor:{
                                                contains: search,
                                                mode: 'insensitive'
                                            },
                                        },
                                    ],
                                    InvoicePo: {
                                        some: {}
                                    },
                                    poId,
                                    Po: {
                                        ptId,
                                        projectId
                                    }
                                },
                                skip: skipPage,
                                take: Number(perPage),
                                include: {
                                    Po: true,
                                    BarangSuratJalanPo: true,
                                    InvoicePo: true,
                                },
                                orderBy: {
                                    createdAt: 'desc'
                                }
                            });
                        } else {
                            result = await SuratJalanPo.findMany({
                                where: {
                                    InvoicePo: {
                                        some: {}
                                    },
                                    poId,
                                    Po: {
                                        ptId,
                                        projectId
                                    },
                                },
                                skip: skipPage,
                                take: Number(perPage),
                                include: {
                                    Po: true,
                                    BarangSuratJalanPo: true,
                                    InvoicePo: true
                                },
                                orderBy: {
                                    createdAt: 'desc'
                                }
                            });
                        }
                    }
                }
            } else {
                if (ptId === 'all') {
                    if (projectId === 'all') {
                        if (search !== 'undefined') {
                            result = await SuratJalanPo.findMany({
                                where: {
                                    OR: [
                                        {
                                            nomor:{
                                                contains: search,
                                                mode: 'insensitive'
                                            },
                                        },
                                    ],
                                    InvoicePo: {
                                        some: {}
                                    },
                                },
                                skip: skipPage,
                                take: Number(perPage),
                                include: {
                                    Po: true,
                                    BarangSuratJalanPo: true,
                                    InvoicePo: true,
                                },
                                orderBy: {
                                    createdAt: 'desc'
                                }
                            });
                        } else {
                            result = await SuratJalanPo.findMany({
                                where: {
                                    InvoicePo: {
                                        some: {}
                                    },
                                },
                                skip: skipPage,
                                take: Number(perPage),
                                include: {
                                    Po: true,
                                    BarangSuratJalanPo: true,
                                    InvoicePo: true
                                },
                                orderBy: {
                                    createdAt: 'desc'
                                }
                            });
                        }
                    } else {
                        if (search !== 'undefined') {
                            result = await SuratJalanPo.findMany({
                                where: {
                                    OR: [
                                        {
                                            nomor:{
                                                contains: search,
                                                mode: 'insensitive'
                                            },
                                        },
                                    ],
                                    InvoicePo: {
                                        some: {}
                                    },
                                    Po: {
                                        projectId
                                    }
                                },
                                skip: skipPage,
                                take: Number(perPage),
                                include: {
                                    Po: true,
                                    BarangSuratJalanPo: true,
                                    InvoicePo: true,
                                },
                                orderBy: {
                                    createdAt: 'desc'
                                }
                            });
                        } else {
                            result = await SuratJalanPo.findMany({
                                where: {
                                    InvoicePo: {
                                        some: {}
                                    },
                                    Po: {
                                        projectId
                                    }
                                },
                                skip: skipPage,
                                take: Number(perPage),
                                include: {
                                    Po: true,
                                    BarangSuratJalanPo: true,
                                    InvoicePo: true
                                },
                                orderBy: {
                                    createdAt: 'desc'
                                }
                            });
                        }
                    }
                    
                } else {
                    if (projectId === 'all') {
                        if (search !== 'undefined') {
                            result = await SuratJalanPo.findMany({
                                where: {
                                    OR: [
                                        {
                                            nomor:{
                                                contains: search,
                                                mode: 'insensitive'
                                            },
                                        },
                                    ],
                                    InvoicePo: {
                                        some: {}
                                    },
                                    Po: {
                                        ptId
                                    }
                                },
                                skip: skipPage,
                                take: Number(perPage),
                                include: {
                                    Po: true,
                                    BarangSuratJalanPo: true,
                                    InvoicePo: true,
                                },
                                orderBy: {
                                    createdAt: 'desc'
                                }
                            });
                        } else {
                            result = await SuratJalanPo.findMany({
                                where: {
                                    InvoicePo: {
                                        some: {}
                                    },
                                    Po: {
                                        ptId
                                    }
                                },
                                skip: skipPage,
                                take: Number(perPage),
                                include: {
                                    Po: true,
                                    BarangSuratJalanPo: true,
                                    InvoicePo: true
                                },
                                orderBy: {
                                    createdAt: 'desc'
                                }
                            });
                        }
                    } else {
                        if (search !== 'undefined') {
                            result = await SuratJalanPo.findMany({
                                where: {
                                    OR: [
                                        {
                                            nomor:{
                                                contains: search,
                                                mode: 'insensitive'
                                            },
                                        },
                                    ],
                                    InvoicePo: {
                                        some: {}
                                    },
                                    Po: {
                                        ptId,
                                        projectId
                                    }
                                },
                                skip: skipPage,
                                take: Number(perPage),
                                include: {
                                    Po: true,
                                    BarangSuratJalanPo: true,
                                    InvoicePo: true,
                                },
                                orderBy: {
                                    createdAt: 'desc'
                                }
                            });
                        } else {
                            result = await SuratJalanPo.findMany({
                                where: {
                                    InvoicePo: {
                                        some: {}
                                    },
                                    Po: {
                                        ptId,
                                        projectId
                                    }
                                },
                                skip: skipPage,
                                take: Number(perPage),
                                include: {
                                    Po: true,
                                    BarangSuratJalanPo: true,
                                    InvoicePo: true
                                },
                                orderBy: {
                                    createdAt: 'desc'
                                }
                            });
                        }
                    }
                }
            }
            // END SUDAH INVOICE
        } else if (status === 'Belum Invoice') {
            if (poId !== 'undefined') {
                if (ptId === 'all') {
                    if (projectId === 'all') {
                        if (search !== 'undefined') {
                            result = await SuratJalanPo.findMany({
                                where: {
                                    OR: [
                                        {
                                            nomor:{
                                                contains: search,
                                                mode: 'insensitive'
                                            },
                                        },
                                        {
                                            Po: {
                                                noPo: {
                                                    contains: search,
                                                    mode: 'insensitive'
                                                },
                                            }
                                        },
                                    ],
                                    InvoicePo: {
                                        none: {}
                                    },
                                    poId
                                },
                                skip: skipPage,
                                take: Number(perPage),
                                include: {
                                    Po: true,
                                    BarangSuratJalanPo: true,
                                    InvoicePo: true,
                                },
                                orderBy: {
                                    createdAt: 'desc'
                                }
                            });
                        } else {
                            result = await SuratJalanPo.findMany({
                                where: {
                                    InvoicePo: {
                                        none: {}
                                    },
                                    poId
                                },
                                skip: skipPage,
                                take: Number(perPage),
                                include: {
                                    Po: true,
                                    BarangSuratJalanPo: true,
                                    InvoicePo: true
                                },
                                orderBy: {
                                    createdAt: 'desc'
                                }
                            });
                        }
                    } else {
                        if (search !== 'undefined') {
                            result = await SuratJalanPo.findMany({
                                where: {
                                    OR: [
                                        {
                                            nomor:{
                                                contains: search,
                                                mode: 'insensitive'
                                            },
                                        },
                                        {
                                            Po: {
                                                noPo: {
                                                    contains: search,
                                                    mode: 'insensitive'
                                                },
                                            }
                                        },
                                    ],
                                    InvoicePo: {
                                        none: {}
                                    },
                                    poId,
                                    Po: {
                                        projectId
                                    }
                                },
                                skip: skipPage,
                                take: Number(perPage),
                                include: {
                                    Po: true,
                                    BarangSuratJalanPo: true,
                                    InvoicePo: true,
                                },
                                orderBy: {
                                    createdAt: 'desc'
                                }
                            });
                        } else {
                            result = await SuratJalanPo.findMany({
                                where: {
                                    InvoicePo: {
                                        none: {}
                                    },
                                    poId,
                                    Po: {
                                        projectId
                                    }
                                },
                                skip: skipPage,
                                take: Number(perPage),
                                include: {
                                    Po: true,
                                    BarangSuratJalanPo: true,
                                    InvoicePo: true
                                },
                                orderBy: {
                                    createdAt: 'desc'
                                }
                            });
                        }
                    }
                    
                } else {
                    if (projectId === 'all') {
                        if (search !== 'undefined') {
                            result = await SuratJalanPo.findMany({
                                where: {
                                    OR: [
                                        {
                                            nomor:{
                                                contains: search,
                                                mode: 'insensitive'
                                            },
                                        },
                                        {
                                            Po: {
                                                noPo: {
                                                    contains: search,
                                                    mode: 'insensitive'
                                                },
                                            }
                                        },
                                    ],
                                    InvoicePo: {
                                        none: {}
                                    },
                                    poId,
                                    Po: {
                                        ptId
                                    }
                                },
                                skip: skipPage,
                                take: Number(perPage),
                                include: {
                                    Po: true,
                                    BarangSuratJalanPo: true,
                                    InvoicePo: true,
                                },
                                orderBy: {
                                    createdAt: 'desc'
                                }
                            });
                        } else {
                            result = await SuratJalanPo.findMany({
                                where: {
                                    InvoicePo: {
                                        none: {}
                                    },
                                    poId,
                                    Po: {
                                        ptId
                                    }
                                },
                                skip: skipPage,
                                take: Number(perPage),
                                include: {
                                    Po: true,
                                    BarangSuratJalanPo: true,
                                    InvoicePo: true
                                },
                                orderBy: {
                                    createdAt: 'desc'
                                }
                            });
                        }
                    } else {
                        if (search !== 'undefined') {
                            result = await SuratJalanPo.findMany({
                                where: {
                                    OR: [
                                        {
                                            nomor:{
                                                contains: search,
                                                mode: 'insensitive'
                                            },
                                        },
                                        {
                                            Po: {
                                                noPo: {
                                                    contains: search,
                                                    mode: 'insensitive'
                                                },
                                            }
                                        },
                                    ],
                                    InvoicePo: {
                                        none: {}
                                    },
                                    poId,
                                    Po: {
                                        ptId,
                                        projectId
                                    }
                                },
                                skip: skipPage,
                                take: Number(perPage),
                                include: {
                                    Po: true,
                                    BarangSuratJalanPo: true,
                                    InvoicePo: true,
                                },
                                orderBy: {
                                    createdAt: 'desc'
                                }
                            });
                        } else {
                            result = await SuratJalanPo.findMany({
                                where: {
                                    InvoicePo: {
                                        none: {}
                                    },
                                    poId,
                                    Po: {
                                        ptId,
                                        projectId
                                    }
                                },
                                skip: skipPage,
                                take: Number(perPage),
                                include: {
                                    Po: true,
                                    BarangSuratJalanPo: true,
                                    InvoicePo: true
                                },
                                orderBy: {
                                    createdAt: 'desc'
                                }
                            });
                        }
                    }
                    
                }
            } else {
                if (ptId === 'all') {
                    if (projectId === 'all') {
                        if (search !== 'undefined') {
                            result = await SuratJalanPo.findMany({
                                where: {
                                    OR: [
                                        {
                                            nomor:{
                                                contains: search,
                                                mode: 'insensitive'
                                            },
                                        },
                                        {
                                            Po: {
                                                noPo: {
                                                    contains: search,
                                                    mode: 'insensitive'
                                                },
                                            }
                                        },
                                    ],
                                    InvoicePo: {
                                        none: {}
                                    },
                                },
                                skip: skipPage,
                                take: Number(perPage),
                                include: {
                                    Po: true,
                                    BarangSuratJalanPo: true,
                                    InvoicePo: true,
                                },
                                orderBy: {
                                    createdAt: 'desc'
                                }
                            });
                        } else {
                            result = await SuratJalanPo.findMany({
                                where: {
                                    InvoicePo: {
                                        none: {}
                                    },
                                },
                                skip: skipPage,
                                take: Number(perPage),
                                include: {
                                    Po: true,
                                    BarangSuratJalanPo: true,
                                    InvoicePo: true
                                },
                                orderBy: {
                                    createdAt: 'desc'
                                }
                            });
                        }
                    } else {
                        if (search !== 'undefined') {
                            result = await SuratJalanPo.findMany({
                                where: {
                                    OR: [
                                        {
                                            nomor:{
                                                contains: search,
                                                mode: 'insensitive'
                                            },
                                        },
                                        {
                                            Po: {
                                                noPo: {
                                                    contains: search,
                                                    mode: 'insensitive'
                                                },
                                            }
                                        },
                                    ],
                                    InvoicePo: {
                                        none: {}
                                    },
                                    Po: {
                                        projectId
                                    }
                                },
                                skip: skipPage,
                                take: Number(perPage),
                                include: {
                                    Po: true,
                                    BarangSuratJalanPo: true,
                                    InvoicePo: true,
                                },
                                orderBy: {
                                    createdAt: 'desc'
                                }
                            });
                        } else {
                            result = await SuratJalanPo.findMany({
                                where: {
                                    InvoicePo: {
                                        none: {}
                                    },
                                    Po: {
                                        projectId
                                    }
                                },
                                skip: skipPage,
                                take: Number(perPage),
                                include: {
                                    Po: true,
                                    BarangSuratJalanPo: true,
                                    InvoicePo: true
                                },
                                orderBy: {
                                    createdAt: 'desc'
                                }
                            });
                        }
                    }
                } else {
                    if (projectId === 'all') {
                        if (search !== 'undefined') {
                            result = await SuratJalanPo.findMany({
                                where: {
                                    OR: [
                                        {
                                            nomor:{
                                                contains: search,
                                                mode: 'insensitive'
                                            },
                                        },
                                        {
                                            Po: {
                                                noPo: {
                                                    contains: search,
                                                    mode: 'insensitive'
                                                },
                                            }
                                        },
                                    ],
                                    InvoicePo: {
                                        none: {}
                                    },
                                    Po: {
                                        ptId
                                    }
                                },
                                skip: skipPage,
                                take: Number(perPage),
                                include: {
                                    Po: true,
                                    BarangSuratJalanPo: true,
                                    InvoicePo: true,
                                },
                                orderBy: {
                                    createdAt: 'desc'
                                }
                            });
                        } else {
                            result = await SuratJalanPo.findMany({
                                where: {
                                    InvoicePo: {
                                        none: {}
                                    },
                                    Po: {
                                        ptId
                                    }
                                },
                                skip: skipPage,
                                take: Number(perPage),
                                include: {
                                    Po: true,
                                    BarangSuratJalanPo: true,
                                    InvoicePo: true
                                },
                                orderBy: {
                                    createdAt: 'desc'
                                }
                            });
                        }
                    } else {
                        if (search !== 'undefined') {
                            result = await SuratJalanPo.findMany({
                                where: {
                                    OR: [
                                        {
                                            nomor:{
                                                contains: search,
                                                mode: 'insensitive'
                                            },
                                        },
                                        {
                                            Po: {
                                                noPo: {
                                                    contains: search,
                                                    mode: 'insensitive'
                                                },
                                            }
                                        },
                                    ],
                                    InvoicePo: {
                                        none: {}
                                    },
                                    Po: {
                                        ptId,
                                        projectId
                                    }
                                },
                                skip: skipPage,
                                take: Number(perPage),
                                include: {
                                    Po: true,
                                    BarangSuratJalanPo: true,
                                    InvoicePo: true,
                                },
                                orderBy: {
                                    createdAt: 'desc'
                                }
                            });
                        } else {
                            result = await SuratJalanPo.findMany({
                                where: {
                                    InvoicePo: {
                                        none: {}
                                    },
                                    Po: {
                                        ptId,
                                        projectId
                                    }
                                },
                                skip: skipPage,
                                take: Number(perPage),
                                include: {
                                    Po: true,
                                    BarangSuratJalanPo: true,
                                    InvoicePo: true
                                },
                                orderBy: {
                                    createdAt: 'desc'
                                }
                            });
                        }
                    }
                    
                }
                
            }
            // END BELUM INVOICE
        } else {
            if (poId !== 'undefined') {
                if (ptId === 'all') {
                    if (projectId === 'all') {
                        if (search !== 'undefined') {
                            result = await SuratJalanPo.findMany({
                                where: {
                                    OR: [
                                        {
                                            nomor:{
                                                contains: search,
                                                mode: 'insensitive'
                                            },
                                        },
                                    ],
                                    poId
                                },
                                skip: skipPage,
                                take: Number(perPage),
                                include: {
                                    Po: true,
                                    BarangSuratJalanPo: true,
                                    InvoicePo: true,
                                },
                                orderBy: {
                                    createdAt: 'desc'
                                }
                            });
                        } else {
                            result = await SuratJalanPo.findMany({
                                where: {
                                    poId
                                },
                                skip: skipPage,
                                take: Number(perPage),
                                include: {
                                    Po: true,
                                    BarangSuratJalanPo: true,
                                    InvoicePo: true
                                },
                                orderBy: {
                                    createdAt: 'desc'
                                }
                            });
                        }
                    } else {
                        if (search !== 'undefined') {
                            result = await SuratJalanPo.findMany({
                                where: {
                                    OR: [
                                        {
                                            nomor:{
                                                contains: search,
                                                mode: 'insensitive'
                                            },
                                        },
                                    ],
                                    Po: {
                                        projectId
                                    },
                                    poId
                                },
                                skip: skipPage,
                                take: Number(perPage),
                                include: {
                                    Po: true,
                                    BarangSuratJalanPo: true,
                                    InvoicePo: true,
                                },
                                orderBy: {
                                    createdAt: 'desc'
                                }
                            });
                        } else {
                            result = await SuratJalanPo.findMany({
                                where: {
                                    Po: {
                                        projectId
                                    },
                                    poId
                                },
                                skip: skipPage,
                                take: Number(perPage),
                                include: {
                                    Po: true,
                                    BarangSuratJalanPo: true,
                                    InvoicePo: true
                                },
                                orderBy: {
                                    createdAt: 'desc'
                                }
                            });
                        }
                    }
                    
                } else {
                    if (projectId === 'all') {
                        if (search !== 'undefined') {
                            result = await SuratJalanPo.findMany({
                                where: {
                                    OR: [
                                        {
                                            nomor:{
                                                contains: search,
                                                mode: 'insensitive'
                                            },
                                        },
                                        {
                                            Po: {
                                                noPo: {
                                                    contains: search,
                                                    mode: 'insensitive'
                                                },
                                            }
                                        },
                                    ],
                                    Po: {
                                        ptId
                                    },
                                    poId

                                },
                                skip: skipPage,
                                take: Number(perPage),
                                include: {
                                    Po: true,
                                    BarangSuratJalanPo: true,
                                    InvoicePo: true,
                                },
                                orderBy: {
                                    createdAt: 'desc'
                                }
                            });
                        } else {
                            result = await SuratJalanPo.findMany({
                                where: {
                                    Po: {
                                        ptId
                                    },
                                    poId
                                },
                                skip: skipPage,
                                take: Number(perPage),
                                include: {
                                    Po: true,
                                    BarangSuratJalanPo: true,
                                    InvoicePo: true
                                },
                                orderBy: {
                                    createdAt: 'desc'
                                }
                            });
                        }
                    } else {
                        if (search !== 'undefined') {
                            result = await SuratJalanPo.findMany({
                                where: {
                                    OR: [
                                        {
                                            nomor:{
                                                contains: search,
                                                mode: 'insensitive'
                                            },
                                        },
                                        {
                                            Po: {
                                                noPo: {
                                                    contains: search,
                                                    mode: 'insensitive'
                                                },
                                            }
                                        },
                                    ],
                                    Po: {
                                        ptId,
                                        projectId
                                    },
                                    poId
                                },
                                skip: skipPage,
                                take: Number(perPage),
                                include: {
                                    Po: true,
                                    BarangSuratJalanPo: true,
                                    InvoicePo: true,
                                },
                                orderBy: {
                                    createdAt: 'desc'
                                }
                            });
                        } else {
                            result = await SuratJalanPo.findMany({
                                where: {
                                    Po: {
                                        ptId,
                                        projectId
                                    },
                                    poId
                                },
                                skip: skipPage,
                                take: Number(perPage),
                                include: {
                                    Po: true,
                                    BarangSuratJalanPo: true,
                                    InvoicePo: true
                                },
                                orderBy: {
                                    createdAt: 'desc'
                                }
                            });
                        }
                    }
                }
                //--
            } else {
                if (ptId === 'all') {
                    if (projectId === 'all') {
                        if (search !== 'undefined') {
                            result = await SuratJalanPo.findMany({
                                where: {
                                    OR: [
                                        {
                                            nomor:{
                                                contains: search,
                                                mode: 'insensitive'
                                            },
                                        },
                                        {
                                            Po: {
                                                noPo: {
                                                    contains: search,
                                                    mode: 'insensitive'
                                                },
                                            }
                                        },
                                    ],
                                },
                                skip: skipPage,
                                take: Number(perPage),
                                include: {
                                    Po: true,
                                    BarangSuratJalanPo: true,
                                    InvoicePo: true,
                                },
                                orderBy: {
                                    createdAt: 'desc'
                                }
                            });
                        } else {
                            result = await SuratJalanPo.findMany({
                                skip: skipPage,
                                take: Number(perPage),
                                include: {
                                    Po: true,
                                    BarangSuratJalanPo: true,
                                    InvoicePo: true
                                },
                                orderBy: {
                                    createdAt: 'desc'
                                }
                            });
                        }
                    } else {
                        if (search !== 'undefined') {
                            result = await SuratJalanPo.findMany({
                                where: {
                                    OR: [
                                        {
                                            nomor:{
                                                contains: search,
                                                mode: 'insensitive'
                                            },
                                        },
                                        {
                                            Po: {
                                                noPo: {
                                                    contains: search,
                                                    mode: 'insensitive'
                                                },
                                            }
                                        },
                                    ],
                                    Po: {
                                        projectId
                                    }
                                },
                                skip: skipPage,
                                take: Number(perPage),
                                include: {
                                    Po: true,
                                    BarangSuratJalanPo: true,
                                    InvoicePo: true,
                                },
                                orderBy: {
                                    createdAt: 'desc'
                                }
                            });
                        } else {
                            result = await SuratJalanPo.findMany({
                                where: {
                                    Po: {
                                        projectId
                                    }
                                },
                                skip: skipPage,
                                take: Number(perPage),
                                include: {
                                    Po: true,
                                    BarangSuratJalanPo: true,
                                    InvoicePo: true
                                },
                                orderBy: {
                                    createdAt: 'desc'
                                }
                            });
                        }
                    }
                    
                } else {
                    if (projectId === 'all') {
                        if (search !== 'undefined') {
                            result = await SuratJalanPo.findMany({
                                where: {
                                    OR: [
                                        {
                                            nomor:{
                                                contains: search,
                                                mode: 'insensitive'
                                            },
                                        },
                                        {
                                            Po: {
                                                noPo: {
                                                    contains: search,
                                                    mode: 'insensitive'
                                                },
                                            }
                                        },
                                    ],
                                    Po: {
                                        ptId
                                    }
                                },
                                skip: skipPage,
                                take: Number(perPage),
                                include: {
                                    Po: true,
                                    BarangSuratJalanPo: true,
                                    InvoicePo: true,
                                },
                                orderBy: {
                                    createdAt: 'desc'
                                }
                            });
                        } else {
                            result = await SuratJalanPo.findMany({
                                where: {
                                    Po: {
                                        ptId
                                    }
                                },
                                skip: skipPage,
                                take: Number(perPage),
                                include: {
                                    Po: true,
                                    BarangSuratJalanPo: true,
                                    InvoicePo: true
                                },
                                orderBy: {
                                    createdAt: 'desc'
                                }
                            });
                        }
                    } else {
                        if (search !== 'undefined') {
                            result = await SuratJalanPo.findMany({
                                where: {
                                    OR: [
                                        {
                                            nomor:{
                                                contains: search,
                                                mode: 'insensitive'
                                            },
                                        },
                                        {
                                            Po: {
                                                noPo: {
                                                    contains: search,
                                                    mode: 'insensitive'
                                                },
                                            }
                                        },
                                    ],
                                    Po: {
                                        ptId,
                                        projectId
                                    }
                                },
                                skip: skipPage,
                                take: Number(perPage),
                                include: {
                                    Po: true,
                                    BarangSuratJalanPo: true,
                                    InvoicePo: true,
                                },
                                orderBy: {
                                    createdAt: 'desc'
                                }
                            });
                        } else {
                            result = await SuratJalanPo.findMany({
                                where: {
                                    Po: {
                                        ptId,
                                        projectId
                                    }
                                },
                                skip: skipPage,
                                take: Number(perPage),
                                include: {
                                    Po: true,
                                    BarangSuratJalanPo: true,
                                    InvoicePo: true
                                },
                                orderBy: {
                                    createdAt: 'desc'
                                }
                            });
                        }
                    }
                }
            }
            
        }

        let newResult: any[] = [];
        await Promise.all(result.map(async(item) => {
            const ptData = await Pt.findUnique({
                where: {
                    id: item.Po?.ptId
                }
            });
            newResult.push({
                ...item,
                Pt: ptData
            })
        }));
        
        debug(result, ">>> res surat jalan po");
        return {
            data: newResult,
            document: {
                currentPage: Number(page),
                pageSize: Number(perPage),
                totalCount,
                totalPages,
            }
        };
    }

    async findOneById(id: string) {
        const result = await SuratJalanPo.findUnique({
            where: {
                id
            }
        });
        return result;
    }

    async updateOneById(id: string, payload: SuratJalanPoDTO) {
        const { namaSupir, updatedBy, tanggal, poId } = payload;
        const result = await SuratJalanPo.update({
            where: {
                id
            },
            data: {
                namaSupir,
                updatedBy,
                tanggal,
                poId,
                updatedAt: new Date()
            }
        });
        return result;
    }

    async deleteOneById(id: string) {
        await BarangSuratJalanPo.deleteMany({
            where: {
                suratJalanPoId: id
            }
        });
        const result = await SuratJalanPo.delete({
            where: {
                id
            }
        });
        return result;
    }

    async cancel(payload: ISuratJalanPo) {
        await this.deleteOneById(<string>payload.id);
        const result = await Promise.all(payload.BarangSuratJalanPo.map(async (item) => {
            const stok = await StokBarang.findUnique({
                where: {
                    id: item.stokBarangId
                }
            });
            if (stok) {
                await StokBarang.update({
                    where: {
                        id: item.stokBarangId
                    },
                    data: {
                        jumlah: stok?.jumlah + item.qty
                    }
                });
            }
        }));
        return result;
    } 
}

export default SuratJalanPoService;