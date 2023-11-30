import { Request, Response, NextFunction } from 'express';
import PoService from './po.service';
import { IParamsQuery } from './interfaces/po.interface';
import BarangPoService from '../barang-po/barang-po.service';
import BarangPoDTO from '../barang-po/dto/barang-po.dto';

export async function createPo(req: Request, res: Response) {
    try {
        const poService = new PoService();
        const barangPoService = new BarangPoService();
        const poResult = await poService.create(req.body.po);
        const barangPoMasterPayload: Omit<BarangPoDTO, "id">[] = [];
        req.body.barangPo.map(async (item: Omit<BarangPoDTO, "id">) => {
            barangPoMasterPayload.push({
                kode: item.kode,
                nama: item.nama,
                qty: item.qty,
                satuan: item.satuan,
                harga: item.harga,
                jumlahHarga: item.jumlahHarga,
                discount: item.discount,
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
                harga: item.harga,
                jumlahHarga: item.jumlahHarga,
                discount: item.discount,
                step: 2,
                isMaster: false,
                poId: poResult.id,
                stokBarangId: item.stokBarangId,
                createdBy: item.createdBy
            })
        });
        await barangPoService.create(barangPoPayload)
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

export async function updateMaster(req: Request, res: Response) {
    try {
        const poService = new PoService();
        const barangPoService = new BarangPoService();
        const poResult = await poService.create(req.body.po);
        const barangPoPayload: Omit<BarangPoDTO, "id">[] = [];
        req.body.barangPo.map(async (item: Omit<BarangPoDTO, "id">) => {
            const barangPoLastStep = await barangPoService.findLastStep(poResult.id, item.stokBarangId)
            console.log(barangPoLastStep, "<====BarangPoLastStep");
            barangPoPayload.push({
                kode: item.kode,
                nama: item.nama,
                qty: item.qty,
                satuan: item.satuan,
                harga: item.harga,
                jumlahHarga: item.jumlahHarga,
                discount: item.discount,
                step: Number(barangPoLastStep?.step) + 1,
                isMaster: true,
                poId: poResult.id,
                stokBarangId: item.stokBarangId,
                createdBy: item.createdBy
            })
        });
        await barangPoService.create(barangPoPayload)
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

export async function getAllPo(req: Request, res: Response) {
    try {
        const poService = new PoService();
        const result = await poService.findAll(req.query as unknown as IParamsQuery);
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

export async function getPoById(req: Request, res: Response) {
    try {
        const poService = new PoService();
        const result = await poService.findOneById(req.params.id);
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

export async function updatePoById(req: Request, res: Response) {
    try {
        const poService = new PoService();
        const barangPoService = new BarangPoService();
        await poService.updateOneById(req.body.po.id, req.body.po);
        // for (let index = 0; index < req.body.barangPo.length; index++) {
        //     await barangPoService.updateOneById(req.body.barangPo[index].id, req.body.barangPo[index]);
        // }
        const barangPoPayload: Omit<BarangPoDTO, "id">[] = [];
        console.log(req.body.barangPo, "<===BarangPo");
        req.body.barangPo.map((item: Omit<BarangPoDTO, "id">) => {
            barangPoPayload.push({
                kode: item.kode,
                nama: item.nama,
                qty: Number(item.qty),
                satuan: item.satuan,
                harga: Number(item.harga),
                jumlahHarga: Number(item.jumlahHarga),
                discount: Number(item.discount),
                step: item.step + 1,
                isMaster: true,
                poId: req.body.po.id,
                stokBarangId: item.stokBarangId,
                createdBy: item.createdBy
            })
        });
        const updatee = await barangPoService.create(barangPoPayload)
        console.log(updatee, "<==Update Barang Po");
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

export async function deletePoById(req: Request, res: Response) {
    try {
        console.log(req.body);
        const poService = new PoService();
        const barangPoService = new BarangPoService();
        await barangPoService.deleteManyByPoId(req.body.id);
        await poService.deleteOneById(req.body.id);

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