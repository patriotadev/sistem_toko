import { Request, Response, NextFunction } from 'express';
import SuratJalanPoService from './surat-jalan-po.service';
import BarangSuratJalanPoService from '../barang-surat-jalan-po/barang-surat-jalan-po.service';
import SuratJalanPoDTO from './dto/surat-jalan-po.dto';
import BarangSuratJalanPoDTO from '../barang-surat-jalan-po/dto/barang-surat-jalan-po.dto';
import StokService from '../stok/stok.service';
import StokDTO from '../stok/dto/stok.dto';
import { IParamsQuery } from './interfaces/surat-jalan-po.interface';
import BarangPoService from '../barang-po/barang-po.service';
import { BarangPo } from '@prisma/client';
import BarangPoDTO from '../barang-po/dto/barang-po.dto';
import PoService from '../po/po.service';
import PoDTO from '../po/dto/po.dto';
import { thousandLimiter } from '../../helpers/thousand-limiter';
const debug = require('debug')('hbpos-server:surat-jalan-po-controller');

export async function createSuratJalanPo(req: Request, res: Response) {
    try {
        debug(req.body);
        const suratJalanPoService = new SuratJalanPoService();
        const barangSuratJalanPoService = new BarangSuratJalanPoService();
        const poService = new PoService();
        const barangPoService = new BarangPoService();
        const stokService = new StokService();
        if (req.body.isDirect) {
            const poResult = await suratJalanPoService.createPoDirect(req.body).catch((e) => {
                return e;
            });
            debug(poResult, ">>>> poResult");
    
            if (poResult.prismaError) {
                return res.status(400).send({
                    'status': 'error',
                    'code': 400,
                    'message': 'Error while process data.',
                    'error': poResult
                });
            }

            if (req.body.stokPo.length > 0) {
                await stokService.createStokPo(req.body.stokPo);
            }

            const barangPoMasterPayload: Omit<BarangPoDTO, "id">[] = [];
            if (poResult) {
                req.body.barangPo.map(async (item: Omit<BarangPoDTO, "id">) => {
                    barangPoMasterPayload.push({
                        kode: item.kode,
                        nama: item.nama,
                        qty: item.qty,
                        satuan: item.satuan,
                        harga: Number(item.harga),
                        jumlahHarga: Number(item.jumlahHarga),
                        discount: item.discount ? Number(item.discount) : 0,
                        step: 1,
                        isMaster: true,
                        poId: poResult.id,
                        stokBarangId: item.stokBarangId,
                        createdBy: item.createdBy
                    })
                });
                await barangPoService.create(barangPoMasterPayload);
                const barangPoPayload: Omit<BarangPoDTO, "id">[] = [];
                req.body.barangPo.map(async (item: Omit<BarangPoDTO, "id">) => {
                    barangPoPayload.push({
                        kode: item.kode,
                        nama: item.nama,
                        qty: item.qty,
                        satuan: item.satuan,
                        harga: Number(item.harga),
                        jumlahHarga: Number(item.jumlahHarga),
                        discount: item.discount ? Number(item.discount) : 0,
                        step: 2,
                        isMaster: false,
                        poId: poResult.id,
                        stokBarangId: item.stokBarangId,
                        createdBy: item.createdBy
                    })
                });
                await barangPoService.create(barangPoPayload);
                const pembayaranPayload = {
                    metode: req.body.pembayaran.metodePembayaran,
                    jumlahBayar: req.body.pembayaran.jumlahBayar,
                    nominal: 0,
                    totalPembayaran: req.body.pembayaran.totalPembayaran,
                    poId: poResult.id,
                    isApprove: req.body.pembayaran.isApprove,
                    approvedAt: req.body.pembayaran.approvedAt,
                    approvedBy: req.body.pembayaran.approvedBy,
                    createdBy: req.body.pembayaran.createdBy,
                    createdAt: req.body.pembayaran.createdAt
                };
                const pembayaranResult = await poService.createPembayaran(pembayaranPayload);
                const riwayatPembayaranPayload = {
                    poId: poResult.id,
                    pembayaranPoId: pembayaranResult.id,
                    createdBy: req.body.pembayaran.createdBy,
                    createdAt: req.body.pembayaran.createdAt,
                    description: `PO baru ditambahkan dengan total pembayaran ${thousandLimiter(req.body.pembayaran.totalPembayaran, 'Rp')}`
                }
                await poService.createRiwayatPembayaran(riwayatPembayaranPayload);
                req.body.suratJalan.poId = poResult.id;
            }
            }
            const suratJalanPoResult = await suratJalanPoService.create(req.body.suratJalan);
                const barangSuratJalanPoPayload: Omit<BarangSuratJalanPoDTO, "id">[] = [];
                const stokBarangPayload: Pick<StokDTO, "id" | "jumlah">[] = [];
                if (suratJalanPoResult) {
                    await Promise.all(req.body.barangPo.map(async(item: BarangSuratJalanPoDTO) => {
                        barangSuratJalanPoPayload.push({
                            kode: item.kode,
                            nama: item.nama,
                            qty: item.qty,
                            satuan: item.satuan,
                            suratJalanPoId: suratJalanPoResult.id,
                            createdBy: item.createdBy,
                            stokBarangId: item.stokBarangId
                        });
                        if (req.body.suratJalan.poId) {
                            const barangPoLastStep = await barangPoService.findLastStep(req.body.suratJalan.poId, item.stokBarangId)
                            await poService.updateOneById(req.body.suratJalan.poId, { status: 'Sudah Diambil' } as unknown as PoDTO)
                            if (barangPoLastStep) {
                                await barangPoService.updateOneById(barangPoLastStep.id, {
                                    id: item.id,
                                    kode: item.kode,
                                    nama: item.nama,
                                    qty: Number(barangPoLastStep?.qty) - Number(item.qty),
                                    satuan: item.satuan,
                                    discount: Number(barangPoLastStep?.discount),
                                    harga: Number(barangPoLastStep?.harga),
                                    poId: req.body.suratJalan.poId,
                                    createdBy: item.createdBy,
                                    isMaster: false,
                                    jumlahHarga: (Number(barangPoLastStep?.qty) - Number(item.qty)) * Number(barangPoLastStep?.harga),
                                    step: Number(barangPoLastStep?.step),
                                    stokBarangId: item.stokBarangId
                                });
                            }
                        }
                        stokBarangPayload.push({
                            id: item.stokBarangId,
                            jumlah: item.qty
                        })
                    }));
                    await barangSuratJalanPoService.create(barangSuratJalanPoPayload);
                    await stokService.updateManyById(stokBarangPayload);
                }
            return res.status(201).send({
                'status': 'success',
                'code': 201,
                'message': 'Data has been added successfully.'
            });
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            'status': 'error',
            'code': 500,
            'message': 'Internal server error.'
        });
    }
}

export async function getAllSuratJalanPo(req: Request, res: Response) {
    try {
        const suratJalanPoService = new SuratJalanPoService();
        console.log("queryy", req.query);
        const result = await suratJalanPoService.findAll(req.query as unknown as IParamsQuery);
        return res.status(200).send({
            'status': 'success',
            'code': 200,
            'data': result.data,
            'document': {...result.document}
        });
    } catch (error) {
        return res.status(500).send({
            'status': 'error',
            'code': 500,
            'message': 'Internal server error.'
        });
    }
}

export async function getSuratJalanPoList(req: Request, res: Response) {
    try {
        const suratJalanPoService = new SuratJalanPoService();
        console.log("queryy", req.query.search);
        const result = await suratJalanPoService.getList(req.query as unknown as { search: string });
        return res.status(200).send({
            'status': 'success',
            'code': 200,
            'data': result,
        });
    } catch (error) {
        return res.status(500).send({
            'status': 'error',
            'code': 500,
            'message': 'Internal server error.'
        });
    }
}


export async function getSuratJalanPoById(req: Request, res: Response) {
    try {
        const suratJalanPoService = new SuratJalanPoService();
        const result = await suratJalanPoService.findOneById(req.params.id);
        return res.status(200).send({
            'status': 'success',
            'code': 200,
            'data': result
        });
    } catch (error) {
        return res.status(500).send({
            'status': 'error',
            'code': 500,
            'message': 'Internal server error.'
        });
    }
}

export async function updateSuratJalanPoById(req: Request, res: Response) {
    try {
        const suratJalanPoService = new SuratJalanPoService();
        await suratJalanPoService.updateOneById(req.body.id, req.body)
    } catch (error) {
        return res.status(500).send({
            'status': 'error',
            'code': 500,
            'message': 'Internal server error.'
        });
    }
}

export async function deleteSuratJalanPoById(req: Request, res: Response) {
    try {
        const suratJalanPoService = new SuratJalanPoService();
        const barangSuratJalanPoService = new BarangSuratJalanPoService();
        await barangSuratJalanPoService.deleteManyBySuratJalanPoId(req.body.id);
        await suratJalanPoService.deleteOneById(req.body.id);

        return res.status(200).send({
            'status': 'success',
            'code': 200,
            'message': 'Data has been deleted successfully.'
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            'status': 'error',
            'code': 500,
            'message': 'Internal server error.'
        });
    }
}

export async function cancelSuratJalanPoById(req: Request, res: Response) {
    try {
        const suratJalanPoService = new SuratJalanPoService();
        const result = await suratJalanPoService.cancel(req.body);
        debug(result)
        if (result) {
            return res.status(200).send({
                'status': 'success',
                'code': 200,
                'message': 'Data has been cancelled successfully.'
            });
        }
    } catch (error) {
        debug(error);
        return res.status(500).send({
            'status': 'error',
            'code': 500,
            'message': 'Internal server error.'
        });
    }
}