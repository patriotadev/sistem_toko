import prisma from "../../libs/prisma";
const Pt = prisma.pt;
const PembayaranPo = prisma.pembayaranPo;
const SuratJalanPo = prisma.suratJalanPo;
const BarangSuratJalanPo = prisma.barangSuratJalanPo;
const BarangPo = prisma.barangPo;
const debug = require('debug')('hbpos-server:laporan-po-service');

class LaporanPoService {

    async getDaftarTagihan(payload: any) {
        const { page, perPage, ptId, projectId } = payload;
        const sizePerPage = perPage ? Number(perPage) : 100;                                         
        const skipPage = sizePerPage * page - sizePerPage;
        const totalCount = await Pt.count();
        const totalPages = Math.ceil(totalCount / perPage);
        
        let result;
        if (ptId === 'all') {
            result = await Pt.findMany({
                skip: skipPage,
                take: Number(perPage),
                include: {
                    Po: true
                },
            })
        } else {
            result = await Pt.findMany({
                where: {
                    id: ptId
                },
                skip: skipPage,
                take: Number(perPage),
                include: {
                    Po: true
                },
            })
        }


        const newResult: any[] = [];
        await Promise.all(result.map(async(item) => {
            const newPo: any[] = [];
            if (item.Po.length > 0) {
                await Promise.all(item.Po.map(async (p) => {
                    const pembayaranData = await PembayaranPo.findFirst({
                        where: {
                            poId: p.id
                        },
                    });
    
                    const masterTotalPembayaran = await PembayaranPo.aggregate({
                        where: {
                            poId: p.id
                        },
                        _avg: {
                            totalPembayaran: true
                        }
                    });
    
                    const masterjumlahBayar = await PembayaranPo.aggregate({
                        where: {
                            poId: p.id
                        },
                        _avg: {
                            jumlahBayar: true
                        }
                    });
    
                    const sjData = await SuratJalanPo.findMany({
                        where: {
                            poId: p.id
                        }
                    });

                    const newSjData: any[] = [];
                    await Promise.all(sjData.map(async(sj) => {
                        const newBarangSj: any[] = [];
                        const barangSjData = await BarangSuratJalanPo.findMany({
                            where: {
                                suratJalanPoId: sj.id
                            }
                        });

                        await Promise.all(barangSjData.map(async (bsjd) => {
                            const barangPoData = await BarangPo.findFirst({
                                where: {
                                    poId: p.id,
                                    stokBarangId: bsjd.stokBarangId
                                }
                            });
                            
                            newBarangSj.push({
                                ...bsjd,
                                harga: barangPoData?.harga,
                                qtyInit: barangPoData?.qty,
                                totalHargaInit: Number(barangPoData?.qty) * Number(barangPoData?.harga) - Number(barangPoData?.discount),
                                totalHarga: bsjd.qty * Number(barangPoData?.harga)  - Number(barangPoData?.discount)
                            });
                        }));

                        newSjData.push({
                            detail: sj,
                            barang: newBarangSj,
                            nominal: newBarangSj.reduce((n, {totalHarga}) => n + totalHarga, 0),
                            nominalInit: newBarangSj.reduce((n, {totalHargaInit}) => n + totalHargaInit, 0),
                        });


                    }));
    
                    newPo.push({
                        ...p,
                        pembayaran: pembayaranData,
                        sj: newSjData,
                        totalNominalInitSj: newSjData.reduce((n, {nominalInit}) => n + nominalInit, 0),
                        totalNominalSj: newSjData.reduce((n, {nominal}) => n + nominal, 0),
                        masterTotalPembayaran: Number(masterTotalPembayaran._avg.totalPembayaran),
                        masterSisaPembayaran: Number(masterTotalPembayaran._avg.totalPembayaran) - Number(masterjumlahBayar._avg.jumlahBayar)
                    });
                }))
            }
            newResult.push({
                ...item,
                totalPoAmbil: item.Po.filter((po) => po.status !== 'Belum Diambil').length,
                totalPoBelumAmbil: item.Po.filter((po) => po.status === 'Belum Diambil').length,
                Po: newPo
            })
        }));

        debug(newResult, ">>> newResult");
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

}

export default LaporanPoService;