import prisma from "../../libs/prisma";
import { IBarangPenjualan, IPenjualan } from "../penjualan/interfaces/penjualan.interface";
import { IStok } from "../stok/interfaces/stok.interface";
const Pt = prisma.pt;
const PembayaranPo = prisma.pembayaranPo;
const SuratJalanPo = prisma.suratJalanPo;
const BarangSuratJalanPo = prisma.barangSuratJalanPo;
const BarangPo = prisma.barangPo;
const BarangPenjualan = prisma.barangPenjualan;
const Penjualan = prisma.penjualan;
const StokBarang = prisma.stokBarang;
const PembayaranPenjualan = prisma.pembayaranPenjualan;
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

    async getLaporanPenjualan (payload: any) {
        debug(payload, ">>> payload");
        const {dateStart, dateEnd, tokoId} = payload;
        let result;
        if (tokoId === 'all') {
            result = await Penjualan.findMany({
                where: {
                    createdAt: {
                        gte: new Date(dateStart),
                        lte: new Date(dateEnd)
                    }
                },
                include: {
                    BarangPenjualan: true,
                    PembayaranPenjualan: true
                }
            });
        } else {
            result = await Penjualan.findMany({
                where: {
                    createdAt: {
                        gte: new Date(dateStart),
                        lte: new Date(dateEnd)
                    },
                    tokoId: tokoId
                },
                include: {
                    BarangPenjualan: true,
                    PembayaranPenjualan: true
                }
            });
        }

        let newResult: any[] = [];
        const sumStok: any[] = [];
        await Promise.all(result.map(async(item: any) => {
            const newBp: any[] = [];
            const lastStepMaster = item.BarangPenjualan.filter((e: any) => e.isMaster === true).reverse()[0];
            const bp = item.BarangPenjualan.filter((d: any) => d.step === lastStepMaster.step);
            await Promise.all(bp.map(async(s: IBarangPenjualan) => {
                const stok = await StokBarang.findUnique({
                    where: {
                        id: s.stokBarangId
                    }
                });
                if (stok) {
                    newBp.push({
                        ...s,
                        hargaModal: stok?.hargaModal,
                        jumlahModal: s.qty * stok?.hargaModal
                    });
                }
            }))

            const stoks = await StokBarang.findMany();
            await Promise.all(stoks.map(async(st: any) => {
                const count = await BarangPenjualan.aggregate({
                    where: {
                        penjualanId: item.id,
                        stokBarangId: st.id,
                        isMaster: true,
                        step: lastStepMaster.step
                    },
                    _sum: {
                        qty: true
                    }
                });
                
                const isStokAlready = sumStok.find((sst) => sst.stokId === st.id);
                if (isStokAlready) {
                    const stIndex = sumStok.findIndex((find) => find.stokId === st.id);
                    if (stIndex >= 0) {
                        sumStok[stIndex] = {
                            stokId: sumStok[stIndex].stokId,
                            stokName: sumStok[stIndex].stokName,
                            sum: sumStok[stIndex].sum + count._sum.qty,
                        }
                    }
                } else {
                    sumStok.push({
                        stokId: st.id,
                        stokName: st.nama,
                        sum: count._sum.qty,
                    })
                }
            }));

          
            newResult.push({
                ...item,
                Barang: newBp,
                TotalPenjualan: result.length,
                TotalPendapatan: newBp.reduce((n, {jumlahHarga}) => n + jumlahHarga, 0),
                TotalPendapatanBersih: newBp.reduce((n, {jumlahHarga}) => n + jumlahHarga, 0) - newBp.reduce((n, {jumlahModal}) => n + jumlahModal, 0),
                
            })
        }));
        debug(sumStok, ">>> sumStok");
        console.log(sumStok.sort((a, b) => b.sum - a.sum ));
        const resultData = {
            data: newResult,
            stokTerlaris: sumStok.length > 5 ? sumStok.slice(0, 5) : sumStok,
            TotalPenjualan: result.length,
            TotalPendapatan: newResult.reduce((n, {TotalPendapatan}) => n + Number(TotalPendapatan), 0),
            TotalPendapatanBersih: newResult.reduce((n, {TotalPendapatanBersih}) => n + Number(TotalPendapatanBersih), 0)
        }

        return {
            data: resultData,
        }
    }
}

export default LaporanPoService;