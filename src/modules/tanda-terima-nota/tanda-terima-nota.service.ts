import {TandaTerimaNotaDTO} from "./dto/tanda-terima-nota.dto";
import { NotaListDTO } from "./dto/nota-list-dto";
import { IParamsQuery } from "./interfaces/tanda-terima-nota.interface";
import prisma from "../../libs/prisma";
import moment from "moment";
import { IInvoicePo } from "../invoice-po/interfaces/invoice-po.interface";
import { InvoicePoDTO } from "../invoice-po/dto/invoice-po.dto";
const TandaTerimaNota = prisma.tandaTerimaNota;
const TandaTerimaNotaList = prisma.tandaTerimaNotaList;
const Toko = prisma.toko;
const InvoicePoList = prisma.invoicePoList;
const InvoicePo = prisma.invoicePo;
const Po = prisma.po;
const Pt = prisma.pt
const BarangSuratJalanPo = prisma.barangSuratJalanPo;
const BarangPo = prisma.barangPo;
const SuratJalanPo = prisma.suratJalanPo

class TandaTerimaNotaService {
    async create(payload: TandaTerimaNotaDTO) {
        const { tanggal, ptId, projectId, jatuhTempo, createdBy, tokoId } = payload;
        const generateCode = await this.generateCode(tokoId, new Date());
        if (generateCode) {
            const result = await TandaTerimaNota.create({
                data: {
                    nomor: generateCode,
                    jatuhTempo: Number(jatuhTempo),
                    status: 'Belum Tanda Terima',
                    tanggal,
                    ptId,
                    projectId,
                    createdBy
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
            const menuCode = 'TTN';
            const dateCode = moment(createdAt).format('DDMMYY');
            const filterCode = `${locationCode}/${menuCode}/${dateCode}`;

            const result = await TandaTerimaNota.findMany({
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

    async updatePoStatus(payload: Omit<InvoicePoDTO, "id">[]) {
        await Promise.all(payload.map(async (item) => {
            await Po.update({
                where: {
                    id: item?.poId
                },
                data:{
                    status: 'Belum Lunas'
                }
            });
        }));
    }

    async createNotaList(payload: Omit<NotaListDTO, "id">[]) {
        await Promise.all(payload.map(async(item) => {
            await InvoicePo.update({
                where: {
                    id: item.invoicePoId
                },
                data: {
                    status: 'Sudah Tanda Terima'
                }
            })
        }));
        const result = await TandaTerimaNotaList.createMany({
            data: [...(payload as [])]
        });
        return result;
    }

    async deleteManyTandaTerimaNotaList(tandaTerimaNotaId: string) {
        const result = await TandaTerimaNotaList.deleteMany({
            where: {
                tandaTerimaNotaId
            }
        });
        return result;
   }

    async findAll({search, page, perPage, ptId, projectId}: IParamsQuery) {
        const skipPage = Number(page) * 10 - 10;
        const totalCount = await TandaTerimaNota.count();
        const totalPages = Math.ceil(totalCount / perPage);
        let result;
        if (ptId === 'all') {
            if (search !== 'undefined') {
                result = await TandaTerimaNota.findMany({
                    where: {
                        nomor: {
                            contains: search,
                            mode: 'insensitive'
                        },
                    },
                    skip: skipPage,
                    take: Number(perPage),
                    include: {
                        TandaTerimaNotaList:  true,
                        Pt: true,
                        Project: true
                    },
                    orderBy: {
                        createdAt: 'desc'
                    }
                });
            } else {
                result = await TandaTerimaNota.findMany({
                    skip: skipPage,
                    take: Number(perPage),
                    include: {
                        TandaTerimaNotaList: true,
                        Pt: true,
                        Project: true
                    },
                    orderBy: {
                        createdAt: 'desc'
                    }
                });
            }
        } else {
            if (projectId === 'all') {
                if (search !== 'undefined') {
                    result = await TandaTerimaNota.findMany({
                        where: {
                            nomor: {
                                contains: search,
                                mode: 'insensitive'
                            },
                            ptId
                        },
                        skip: skipPage,
                        take: Number(perPage),
                        include: {
                            TandaTerimaNotaList:  true,
                            Pt: true,
                            Project: true
                        },
                        orderBy: {
                            createdAt: 'desc'
                        }
                    });
                } else {
                    result = await TandaTerimaNota.findMany({
                        where: {
                            ptId
                        },
                        skip: skipPage,
                        take: Number(perPage),
                        include: {
                            TandaTerimaNotaList: true,
                            Pt: true,
                            Project: true
                        },
                        orderBy: {
                            createdAt: 'desc'
                        }
                    });
                }
            } else {
                if (search !== 'undefined') {
                    result = await TandaTerimaNota.findMany({
                        where: {
                            nomor: {
                                contains: search,
                                mode: 'insensitive'
                            },
                            ptId,
                            projectId
                        },
                        skip: skipPage,
                        take: Number(perPage),
                        include: {
                            TandaTerimaNotaList:  true,
                            Pt: true,
                            Project: true
                        },
                        orderBy: {
                            createdAt: 'desc'
                        }
                    });
                } else {
                    result = await TandaTerimaNota.findMany({
                        where: {
                            ptId,
                            projectId
                        },
                        skip: skipPage,
                        take: Number(perPage),
                        include: {
                            TandaTerimaNotaList: true,
                            Pt: true,
                            Project: true
                        },
                        orderBy: {
                            createdAt: 'desc'
                        }
                    });
                }
            }
        }

        const newResult: any[] = [];
        await Promise.all(result.map(async (item) => {
            const notaList = await TandaTerimaNotaList.findMany({
                where: {
                    tandaTerimaNotaId: {
                        in: item.TandaTerimaNotaList.map((item) => item.tandaTerimaNotaId)
                    }
                },
                include: {
                    InvoicePo: true,
                }
            });

            const newNotaList: any[] = [];
            await Promise.all(notaList.map(async (nl) => {
                const invoiceData = await InvoicePo.findUnique({
                    where: {
                        id: nl.invoicePoId
                    },
                    include: {
                        SuratJalanPo: true
                    }
                });

                const barangSjData = await BarangSuratJalanPo.findMany({
                    where: {
                        suratJalanPoId: invoiceData?.SuratJalanPo.id
                    },
                });
                let totalJumlah = 0;
                await Promise.all(barangSjData.map(async(bsj) => {
                    const barangPoData = await BarangPo.findFirst({
                        where: {
                            poId: nl.InvoicePo.poId,
                            kode: bsj.kode
                        }
                    });
                    if (barangPoData) {
                        totalJumlah += bsj.qty * barangPoData?.harga
                    }
                }))
                newNotaList.push({
                    ...nl,
                    totalJumlah
                })
            }))
        
            newResult.push({
                ...item,
                Invoice: newNotaList,
                totalJumlahInvoice: newNotaList.reduce((n, {totalJumlah}) => n + totalJumlah, 0)
            });

        }));

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
        const result = await TandaTerimaNota.findUnique({
            where: {
                id
            }
        });
        return result;
    }

    async updateOneById(id: string, payload: TandaTerimaNotaDTO) {
        const { tanggal, jatuhTempo, updatedBy } = payload;
        const result = await TandaTerimaNota.update({
            where: {
                id
            },
            data: {
                tanggal,
                jatuhTempo: Number(jatuhTempo),
                updatedBy,
                updatedAt: new Date()
            }
        });
        return result;
    }

    async updateStatusById(id: string, payload: TandaTerimaNotaDTO) {
        const { status } = payload;
        const result = await TandaTerimaNota.update({
            where: {
                id
            },
            data: {
                status
            }
        })
    }

    async deleteOneById(id: string) {
        const result = await TandaTerimaNota.delete({
            where: {
                id
            }
        });
        return result;
    }
   
}

export default TandaTerimaNotaService;