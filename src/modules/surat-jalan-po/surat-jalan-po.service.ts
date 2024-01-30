import SuratJalanPoDTO from "./dto/surat-jalan-po.dto";
import { IParamsQuery, ISuratJalanPo } from "./interfaces/surat-jalan-po.interface";
import prisma from "../../libs/prisma";
import moment from "moment";
const SuratJalanPo = prisma.suratJalanPo;
const Toko = prisma.toko;
const StokBarang = prisma.stokBarang;
const BarangSuratJalanPo = prisma.barangSuratJalanPo;

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
                    poId
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

    async findAll({search, page, perPage}: IParamsQuery) {
        const skipPage = Number(page) * 10 - 10;
        const totalCount = await SuratJalanPo.count();
        const totalPages = Math.ceil(totalCount / perPage);
        let result;
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
                        }
                    ]
                },
                skip: skipPage,
                take: Number(perPage),
                include: {
                    Po: true,
                    BarangSuratJalanPo: true
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
                    BarangSuratJalanPo: true
                },
                orderBy: {
                    createdAt: 'desc'
                }
            });
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