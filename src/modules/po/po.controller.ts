import { Request, Response, NextFunction } from 'express';
import PoService from './po.service';
import { IParamsQuery } from './interfaces/po.interface';
import BarangPoService from '../barang-po/barang-po.service';

export async function createPo(req: Request, res: Response) {
    try {
        const poService = new PoService();
        const barangPoService = new BarangPoService();
        const poResult = await poService.create(req.body.po);
        const barangPoPayload: any = [];
        req.body.barangPo.map((item: any) => {
            barangPoPayload.push({
                nama: item.nama,
                qty: item.qty,
                satuan: item.satuan,
                harga: item.harga,
                jumlahHarga: item.jumlahHarga,
                discount: item.discount,
                poId: poResult.id,
                createdBy: item.createdBy
            })
        })
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
        await poService.updateOneById(req.body.id, req.body);
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
        const poService = new PoService();
        const barangPoService = new BarangPoService();
        await poService.deleteOneById(req.body.id);
        await barangPoService.deleteManyByPoId(req.body.poId);

        return res.status(200).send({
            'status': 'success',
            'code': 200,
            'message': 'Data has been deleted successfully.'
        });
    } catch (error) {
        return res.status(500).send({
            'status': 'error',
            'code': 500,
            'message': 'Internal server error.'
        });
    }
}