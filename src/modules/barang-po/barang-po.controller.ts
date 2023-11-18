import { Request, Response, NextFunction } from 'express';
import BarangPoService from './barang-po.service';

export async function createBarangPo(req: Request, res: Response) {
    try {
        const barangPoService = new BarangPoService();
        await barangPoService.create(req.body);
        return res.status(201).send({
            'status': 'success',
            'code': 201,
            'message': 'Data has been added successfully'
        });
    } catch (error) {
        return res.status(500).send({
            'status': 'error',
            'code': 500,
            'message': 'Internal server error.'
        });
    }
}

export async function getAllBarangPo(req: Request, res: Response) {
    try {
        const barangPoService = new BarangPoService();
        const result = await barangPoService.findAll(req.query.poId as string);
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

export async function getBarangPoById(req: Request, res: Response) {
    try {
        const barangPoService = new BarangPoService();
        const result = await barangPoService.findOneById(req.params.id);
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

export async function updateBarangPoById(req: Request, res: Response) {
    try {
        const barangPoService = new BarangPoService();
        await barangPoService.updateOneById(req.body.id, req.body);
        return res.status(200).send({
            'status': 'success',
            'code': 200,
            'message': 'Data has been updated successfully'
        });
    } catch (error) {
        return res.status(500).send({
            'status': 'error',
            'code': 500,
            'message': 'Internal server error.'
        });
    }
}

export async function deleteBarangPoById(req: Request, res: Response) {
    try {
        const barangPoService = new BarangPoService();
        await barangPoService.deleteOneById(req.body.id);
        return res.status(200).send({
            'status': 'success',
            'code': 200,
            'message': 'Data has been deleted successfully'
        });
    } catch (error) {
        return res.status(500).send({
            'status': 'error',
            'code': 500,
            'message': 'Internal server error.'
        });
    }
}