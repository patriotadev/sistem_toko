import PoDTO, { PembayaranPoDTO } from "./dto/po.dto";
import { IParamsQuery } from "./interfaces/po.interface";
import prisma from "../../libs/prisma";
const Po = prisma.po;
const PembayaranPo = prisma.pembayaranPo;
const BarangSuratJalanPo = prisma.barangSuratJalanPo;
const SuratJalanPo = prisma.suratJalanPo;
const debug = require('debug')('hbpos-server:po-service');

class PoService {
    async create(payload: PoDTO) {
        debug(payload, "create po payload")
        const { 
            noPo,
            tanggal,
            createdBy,
            ptId,
            projectId,
        } = payload;
        const result = await Po.create({
            data : {
                noPo,
                tanggal: new Date(tanggal),
                createdBy,
                ptId,
                projectId,
                status: 'Belum Diambil',
                statusSJ: 'Parsial'
            }
        });
        return result;
    }

    async createPembayaran(payload: PembayaranPoDTO) {
        const result = PembayaranPo.create({data: {
            ...payload
        }});
        return result;
    }

    async updatePembayaran(payload: PembayaranPoDTO) {
        const { id, totalPembayaran, jumlahBayar, metode, updatedAt, updatedBy, isApprove, approvedAt, approvedBy } = payload;
        const result = await PembayaranPo.update({
            where: {
                id
            },
            data: {
                totalPembayaran: Number(totalPembayaran),
                jumlahBayar: Number(jumlahBayar),
                metode,
                updatedAt,
                updatedBy,
                isApprove,
                approvedAt,
                approvedBy,
            }
        });
        if (result.totalPembayaran === result.jumlahBayar) {
            await Po.update({
                where: {
                    id: result.poId
                },
                data: {
                    status: 'Sudah Lunas'
                }
            });
        }
        return result;
    }

    async getList({search}: {search: string}) {
        let result;
        if (search !== 'undefined') {
            result = await Po.findMany({
                where: {
                    noPo: {
                        contains: search,
                        mode: 'insensitive'
                    }
                }
            });
        } else {
            result = await Po.findMany();
        }

        return result;
    }

    async findAll({search, page, perPage, ptId, projectId, status}: IParamsQuery) {
        const skipPage = Number(page) * 10 - 10;
        const totalCount = await Po.count();
        const totalPages = Math.ceil(totalCount / perPage);
        let result;
        if (status === 'all') {
            if (ptId === 'all') {
                if (search !== 'undefined') {
                    result = await Po.findMany({
                        where: {
                            noPo: {
                                contains: search,
                                mode: 'insensitive'
                            },
                        },
                        skip: skipPage,
                        take: Number(perPage),
                        include: {
                            Pt: true,
                            Project: true,
                            BarangPo: true,
                            PembayaranPo: true,
                            SuratJalanPo: true,
                        },
                        orderBy: {
                            createdAt: 'desc'
                        }
                    });
                } else {
                    result = await Po.findMany({
                        skip: skipPage,
                        take: Number(perPage),
                        include: {
                            Pt: true,
                            Project: true,
                            BarangPo: true,
                            PembayaranPo: true,
                            SuratJalanPo: true,
                        },
                        orderBy: {
                            createdAt: 'desc'
                        }
                    });
                }
            } else {
    
                if (projectId === 'all') {
                    if (search !== 'undefined') {
                        result = await Po.findMany({
                            where: {
                                noPo: {
                                    contains: search,
                                    mode: 'insensitive'
                                },
                                ptId
                            },
                            skip: skipPage,
                            take: Number(perPage),
                            include: {
                                Pt: true,
                                Project: true,
                                BarangPo: true,
                                PembayaranPo: true,
                                SuratJalanPo: true,
                            },
                            orderBy: {
                                createdAt: 'desc'
                            }
                        });
                    } else {
                        result = await Po.findMany({
                            where: {
                                ptId
                            },
                            skip: skipPage,
                            take: Number(perPage),
                            include: {
                                Pt: true,
                                Project: true,
                                BarangPo: true,
                                PembayaranPo: true,
                                SuratJalanPo: true,
                            },
                            orderBy: {
                                createdAt: 'desc'
                            }
                        });
                    }
                } else {
                    if (search !== 'undefined') {
                        result = await Po.findMany({
                            where: {
                                noPo: {
                                    contains: search,
                                    mode: 'insensitive'
                                },
                                ptId,
                                projectId
                            },
                            skip: skipPage,
                            take: Number(perPage),
                            include: {
                                Pt: true,
                                Project: true,
                                BarangPo: true,
                                PembayaranPo: true,
                                SuratJalanPo: true,
                            },
                            orderBy: {
                                createdAt: 'desc'
                            }
                        });
                    } else {
                        result = await Po.findMany({
                            where: {
                                ptId,
                                projectId
                            },
                            skip: skipPage,
                            take: Number(perPage),
                            include: {
                                Pt: true,
                                Project: true,
                                BarangPo: true,
                                PembayaranPo: true,
                                SuratJalanPo: true,
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
                if (search !== 'undefined') {
                    result = await Po.findMany({
                        where: {
                            noPo: {
                                contains: search,
                                mode: 'insensitive'
                            },
                            status
                        },
                        skip: skipPage,
                        take: Number(perPage),
                        include: {
                            Pt: true,
                            Project: true,
                            BarangPo: true,
                            PembayaranPo: true,
                            SuratJalanPo: true,
                        },
                        orderBy: {
                            createdAt: 'desc'
                        }
                    });
                } else {
                    result = await Po.findMany({
                        skip: skipPage,
                        take: Number(perPage),
                        where: {
                            status
                        },
                        include: {
                            Pt: true,
                            Project: true,
                            BarangPo: true,
                            PembayaranPo: true,
                            SuratJalanPo: true,
                        },
                        orderBy: {
                            createdAt: 'desc'
                        }
                    });
                }
            } else {
    
                if (projectId === 'all') {
                    if (search !== 'undefined') {
                        result = await Po.findMany({
                            where: {
                                noPo: {
                                    contains: search,
                                    mode: 'insensitive'
                                },
                                ptId,
                                status
                            },
                            skip: skipPage,
                            take: Number(perPage),
                            include: {
                                Pt: true,
                                Project: true,
                                BarangPo: true,
                                PembayaranPo: true,
                                SuratJalanPo: true,
                            },
                            orderBy: {
                                createdAt: 'desc'
                            }
                        });
                    } else {
                        result = await Po.findMany({
                            where: {
                                ptId,
                                status
                            },
                            skip: skipPage,
                            take: Number(perPage),
                            include: {
                                Pt: true,
                                Project: true,
                                BarangPo: true,
                                PembayaranPo: true,
                                SuratJalanPo: true,
                            },
                            orderBy: {
                                createdAt: 'desc'
                            }
                        });
                    }
                } else {
                    if (search !== 'undefined') {
                        result = await Po.findMany({
                            where: {
                                noPo: {
                                    contains: search,
                                    mode: 'insensitive'
                                },
                                ptId,
                                projectId,
                                status
                            },
                            skip: skipPage,
                            take: Number(perPage),
                            include: {
                                Pt: true,
                                Project: true,
                                BarangPo: true,
                                PembayaranPo: true,
                                SuratJalanPo: true,
                            },
                            orderBy: {
                                createdAt: 'desc'
                            }
                        });
                    } else {
                        result = await Po.findMany({
                            where: {
                                ptId,
                                projectId,
                                status
                            },
                            skip: skipPage,
                            take: Number(perPage),
                            include: {
                                Pt: true,
                                Project: true,
                                BarangPo: true,
                                PembayaranPo: true,
                                SuratJalanPo: true,
                            },
                            orderBy: {
                                createdAt: 'desc'
                            }
                        });
                    }
                }
            }
        }

        let sj;
        let newResult: any[] = [];
        let statusSJ;

        await Promise.all(result.map(async(item) => {
            const lastStep = item.BarangPo.filter((e) => e.isMaster === true).reverse()[0];
            const barangPo = item.BarangPo.filter(bp => bp.step === lastStep.step)
            const totalBarangPo = barangPo.reduce((n, {qty}) => n + qty, 0);

            sj = await SuratJalanPo.findMany({
                where: {
                    id: {
                        in: item.SuratJalanPo.map((sjId) => sjId.id)
                    }
                },
                include: {
                    BarangSuratJalanPo: true
                }
            });

            let totalBarangSJ = 0;
            await Promise.all(sj.map(async(e) => {
                const totalPerSJ = e.BarangSuratJalanPo.reduce((n, {qty}) => n + qty, 0);
                totalBarangSJ += totalPerSJ;
            }))

            newResult.push({
                ...item,
                sj,
                totalBarangPo,
                totalBarangSJ,
                statusSJ: totalBarangPo > totalBarangSJ ? 'Parsial' : 'Selesai' 
            })
        }));

        debug(newResult, "NEW RESULTTT");

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
        const result = await Po.findUnique({
            where: {
                id
            }
        });
        return result;
    }

    async findManyById(id: any) {
        const poId = id?.split(", ");
        console.log("po id listt==>", poId);
        const result = await Po.findMany({
            where: {
                id: {
                    in: poId
                }
            },
            include: {
                BarangPo: true
            }
        });
        console.log("po list from invoice ==>", result);
        return result;
    }

    async updateOneById(id: string, payload: PoDTO) {
        const { 
            noPo,
            tanggal,
            updatedBy,
            ptId,
            status,
            projectId
        } = payload;
        const result = await Po.update({
            where: {
                id
            },
            data : {
                noPo,
                tanggal,
                updatedBy,
                ptId,
                status,
                projectId,
                updatedAt: new Date()
            }
        });
        return result;
    }

    async updateStatusById(id: string, payload: PoDTO) {
        const { status } = payload;
        const result = await Po.update({
            where: {
                id
            },
            data: {
                status,
                updatedAt: new Date()
            }
        });
        return result;
    }

    async deleteOneById(id: string) {
        const pembayaranPo = await PembayaranPo.deleteMany({
            where: {
                poId: id
            }
        });
        const result = await Po.delete({
            where: {
                id
            }
        });
        return result;
    }
}

export default PoService;