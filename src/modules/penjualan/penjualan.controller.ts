import { Request, Response, NextFunction } from 'express';
import PenjualanService from './penjualan.service';
import { IParamsQuery } from './interfaces/penjualan.interface';
import { BarangPenjualanDTO, PembayaranPenjualanDTO } from './dto/penjualan.dto';
import StokDTO from '../stok/dto/stok.dto';
import StokService from '../stok/stok.service';
const debug = require('debug')('hbpos-server:penjualan-controller');

export async function createPenjualan(req: Request, res: Response) {
    try {
        console.log('Penjualannn==>', req.body);
        const penjualanService = new PenjualanService();
        const stokService = new StokService();
        const penjualanResult = await penjualanService.create(req.body.detail);
        const barangMasterPayload: Omit<BarangPenjualanDTO, "id">[] = [];
        const stokBarangPayload: Pick<StokDTO, "id" | "jumlah">[] = [];
        if (penjualanResult) {
            req.body.barang.map(async (item: Omit<BarangPenjualanDTO, "id">) => {
                barangMasterPayload.push({
                    kode: item.kode,
                    nama: item.nama,
                    qty: item.qty,
                    satuan: item.satuan,
                    harga: item.harga,
                    jumlahHarga: item.jumlahHarga,
                    discount: item.discount,
                    step: 1,
                    isMaster: true,
                    penjualanId: penjualanResult.id,
                    stokBarangId: item.stokBarangId,
                    createdBy: item.createdBy
                });
                stokBarangPayload.push({
                    id: item.stokBarangId,
                    jumlah: item.qty
                });
            });
            await penjualanService.createBarang(barangMasterPayload);
            const barangPoPayload: Omit<BarangPenjualanDTO, "id">[] = [];
            req.body.barang.map(async (item: Omit<BarangPenjualanDTO, "id">) => {
                barangPoPayload.push({
                    kode: item.kode,
                    nama: item.nama,
                    qty: item.qty,
                    satuan: item.satuan,
                    harga: item.harga,
                    jumlahHarga: item.jumlahHarga,
                    discount: item.discount,
                    step: 2,
                    isMaster: false,
                    penjualanId: penjualanResult.id,
                    stokBarangId: item.stokBarangId,
                    createdBy: item.createdBy
                })
            });
            await penjualanService.createBarang(barangPoPayload);
            await stokService.updateManyById(stokBarangPayload);
            const pembayaranPayload = {
                metode: req.body.pembayaran.metodePembayaran,
                jumlahBayar: req.body.pembayaran.jumlahBayar,
                totalPembayaran: req.body.pembayaran.totalPembayaran,
                penjualanId: penjualanResult.id,
                isApprove: req.body.pembayaran.isApprove,
                approvedAt: req.body.pembayaran.approvedAt,
                approvedBy: req.body.pembayaran.approvedBy,
                createdBy: req.body.pembayaran.createdBy,
                createdAt: req.body.pembayaran.createdAt
            };
            await penjualanService.createPembayaran(pembayaranPayload)
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

export async function updatePembayaran(req: Request, res: Response) {
    try {
        const penjualanService = new PenjualanService();
        await penjualanService.updatePembayaran(req.body);
        return res.status(200).send({
            'status': 'success',
            'code': 200,
            'message': 'Data has been updated successfully.'
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

export async function getAllPenjualan(req: Request, res: Response) {
    try {
        const penjualanService = new PenjualanService();
        const result = await penjualanService.findAll(req.query as unknown as IParamsQuery);
        debug(result, ">>> RESULT PENJUALAN ON CONTROLLER")
        return res.status(200).send({
            'status': 'success',
            'code': 200,
            'data': result.data,
            'document': {...result.document}
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

export async function getPenjualanById(req: Request, res: Response) {
    try {
        const penjualanService = new PenjualanService();
        const result = await penjualanService.findOneById(req.params.id);
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

export async function getPenjualanByManyId(req: Request, res: Response) {
    try {
        const penjualanService = new PenjualanService();
        const result = await penjualanService.findManyById(req.query.id);
        debug(req.query.id, ">> PAYLOAD QUERY");
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

export async function updatePenjualanById(req: Request, res: Response) {
    try {
        const penjualanService = new PenjualanService();
        await penjualanService.updateOneById(req.body.detail.id, req.body.detail);
        const barangMasterPayload: Omit<BarangPenjualanDTO, "id">[] = [];
        let totalPembayaran:number = 0;
        req.body.barang.map((item: Omit<BarangPenjualanDTO, "id">) => {
            barangMasterPayload.push({
                kode: item.kode,
                nama: item.nama,
                qty: Number(item.qty),
                satuan: item.satuan,
                harga: Number(item.harga),
                jumlahHarga: Number(item.harga) * Number(item.qty),
                discount: Number(item.discount),
                step: Number(item.step) + 2,
                isMaster: true,
                penjualanId: req.body.detail.id,
                stokBarangId: item.stokBarangId,
                createdBy: item.createdBy
            })
        });
        await penjualanService.createBarang(barangMasterPayload);
        await Promise.all(barangMasterPayload.map(async (item) => {
            const previousBarangQty = await penjualanService.findPreviousDifferenceQty(Number(item.step) - 2, Number(item.step) - 1, item.stokBarangId);
            const newQty = item.qty - Number(previousBarangQty);
            totalPembayaran += Number(item.harga) * Number(newQty);
            await penjualanService.createBarang([{
                kode: item.kode,
                nama: item.nama,
                qty:  Number(newQty),
                satuan: item.satuan,
                harga: Number(item.harga),
                jumlahHarga: Number(item.harga) * Number(newQty),
                discount: Number(item.discount),
                step: Number(item.step) + 1,
                isMaster: false,
                penjualanId: req.body.detail.id,
                stokBarangId: item.stokBarangId,
                createdBy: item.createdBy
            }]);
        })).then(async () => {
            const findDetail = await penjualanService.findOneById(req.body.detail.id);
            if (findDetail) {
                await penjualanService.updateTotalPembayaran(findDetail?.PembayaranPenjualan[0].id, totalPembayaran);
            }
        })

        return res.status(200).send({
            'status': 'success',
            'code': 200,
            'message': 'Data has been updated successfully.'
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

export async function getBarangByPenjualanId(req: Request, res: Response) {
    try {
        const penjualanService = new PenjualanService();
        const result = await penjualanService.findBarangByPenjualanId(req.query.penjualanId as string);
        return res.status(200).send({
            'status': 'success',
            'code': 200,
            'data': result
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

export async function deletePenjualanById(req: Request, res: Response) {
    try {
        console.log(req.body);
        const penjualanService = new PenjualanService();
        await penjualanService.deleteOneById(req.body.id);
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