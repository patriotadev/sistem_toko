import { Request, Response, NextFunction } from 'express';
import { IParamsQuery } from './interfaces/surat-jalan-penjualan.interface';
import SuratJalanPenjualanService from './surat-jalan-penjualan.service';
import PenjualanService from './penjualan.service';
import StokService from '../stok/stok.service';
import { BarangSuratJalanPenjualanDTO } from './dto/surat-jalan-penjualan.dto';
import StokDTO from '../stok/dto/stok.dto';
const debug = require('debug')('hbpos-server:surat-jalan-penjualan-controller');

export async function getAllSuratJalanPenjualan(req: Request, res: Response) {
    try {
        const suratJalanPenjualanService = new SuratJalanPenjualanService();
        const result = await suratJalanPenjualanService.findAll(req.query as unknown as IParamsQuery);
        debug(result, ">>> resss")
        return res.status(200).send({
            'status': 'success',
            'code': 200,
            'data': result.data,
            'document': {...result.document}
        });
    } catch (error) {
        debug(error);
        return res.status(500).send({
            'status': 'error',
            'code': 500,
            'message': 'Internal server error.'
        });
    }
}

export async function createSuratJalanPenjualan(req: Request, res: Response) {
    try {
        const suratJalanPenjualanService = new SuratJalanPenjualanService();
        const penjualanService = new PenjualanService();
        const stokService =  new StokService();

        const suratJalanPenjualanResult = await suratJalanPenjualanService.create(req.body.detail);
        const barangSuratJalanPenjualanPayload: Omit<BarangSuratJalanPenjualanDTO, "id">[] = [];
        const stokBarangPayload: Pick<StokDTO, "id" | "jumlah">[] = [];
        debug(suratJalanPenjualanResult, ">> SJP");
        if (suratJalanPenjualanResult) {
            Promise.all(req.body.barang.map(async(item: BarangSuratJalanPenjualanDTO) => {
                barangSuratJalanPenjualanPayload.push({
                    kode: item.kode,
                    nama: item.nama,
                    qty: Number(item.qty),
                    satuan: item.satuan,
                    suratJalanPenjualanId: suratJalanPenjualanResult.id,
                    createdBy: item.createdBy,
                    createdAt: new Date(),
                    stokBarangId: item.stokBarangId
                });
                const barangPenjualanLastStep = await penjualanService.findLastStep(req.body.detail.penjualanId, item.stokBarangId)
                if (barangPenjualanLastStep) {
                    await penjualanService.updateOneBarangById(barangPenjualanLastStep.id, {
                        id: item.id,
                        kode: item.kode,
                        nama: item.nama,
                        qty: Number(barangPenjualanLastStep?.qty) - Number(item.qty),
                        satuan: item.satuan,
                        discount: Number(barangPenjualanLastStep?.discount),
                        harga: Number(barangPenjualanLastStep?.harga),
                        penjualanId: req.body.detail.penjualanId,
                        createdBy: item.createdBy,
                        isMaster: false,
                        jumlahHarga: (Number(barangPenjualanLastStep?.qty) - Number(item.qty)) * Number(barangPenjualanLastStep?.harga),
                        step: Number(barangPenjualanLastStep?.step),
                        stokBarangId: item.stokBarangId
                    });
                }
                stokBarangPayload.push({
                    id: item.stokBarangId,
                    jumlah: Number(item.qty)
                })
            }));
        }
        await suratJalanPenjualanService.createBarang(barangSuratJalanPenjualanPayload);
        await stokService.updateManyById(stokBarangPayload);
        return res.status(201).send({
            'status': 'success',
            'code': 201,
            'message': 'Data has been added successfully.'
        });
    } catch (error) {
        debug(error);
        return res.status(500).send({
            'status': 'error',
            'code': 500,
            'message': 'Internal server error.'
        });
    }
}

export async function deleteSuratJalanPenjualanById(req: Request, res: Response) {
    try {
        const suratJalanPenjualanService = new SuratJalanPenjualanService();
        const result = await suratJalanPenjualanService.deleteOneById(req.body.id);
        if (result) {
            return res.status(200).send({
                'status': 'success',
                'code': 200,
                'message': 'Data has been deleted successfully.'
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

export async function cancelSuratJalanPenjualanById(req: Request, res: Response) {
    try {
        const suratJalanPenjualanService = new SuratJalanPenjualanService();
        const result = await suratJalanPenjualanService.cancel(req.body);
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