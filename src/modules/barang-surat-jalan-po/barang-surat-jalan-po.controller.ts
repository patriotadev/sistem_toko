import { Request, Response, NextFunction } from 'express';
import BarangSuratJalanPoService from './barang-surat-jalan-po.service';

export async function createBarangSuratJalanPo(req: Request, res: Response) {
    try {
        const barangSuratJalanPoService = new BarangSuratJalanPoService();
        await barangSuratJalanPoService.create(req.body);
        res.status(201).send({
            'status': 'success',
            'code': 201,
            'message': 'Data has been added successfully.'
        });
    } catch (error) {
        res.status(500).send({
            'status': 'error',
            'code': 500,
            'message': 'Internal server error.'
        });
    }
}

export async function getAllBarangSuratJalanPo(req: Request, res: Response) {
    try {
        const barangSuratJalanPoService = new BarangSuratJalanPoService();
        const result = await barangSuratJalanPoService.findAll();
        res.status(200).send({
            'status': 'success',
            'code': 200,
            'data': result
        });
    } catch (error) {
        res.status(500).send({
            'status': 'error',
            'code': 500,
            'message': 'Internal server error.'
        });
    }
}

export async function getBarangSuratJalanPoById(req: Request, res: Response) {
    try {
        const barangSuratJalanPoService = new BarangSuratJalanPoService();
        const result = await barangSuratJalanPoService.findOneById(req.params.id);
        res.status(200).send({
            'status': 'success',
            'code': 200,
            'data': result
        });
    } catch (error) {
        res.status(500).send({
            'status': 'error',
            'code': 500,
            'message': 'Internal server error.'
        });
    }
}

export async function updateBarangSuratJalanPoById(req: Request, res: Response) {
    try {
        const barangSuratJalanPoService = new BarangSuratJalanPoService();
        await barangSuratJalanPoService.updateOneById(req.body.id, req.body);
        res.status(200).send({
            'status': 'success',
            'code': 200,
            'message': 'Data has been updated successfully.'
        })
    } catch (error) {
        res.status(500).send({
            'status': 'error',
            'code': 500,
            'message': 'Internal server error.'
        });
    }
}

export async function deleteBarangSuratJalanPoById(req: Request, res: Response) {
    try {
        const barangSuratJalanPoService = new BarangSuratJalanPoService();
        await barangSuratJalanPoService.deleteOneById(req.body.id);
        res.status(200).send({
            'status': 'success',
            'code': 200,
            'message': 'Data has been deleted successfully.'
        })
    } catch (error) {
        res.status(500).send({
            'status': 'error',
            'code': 500,
            'message': 'Internal server error.'
        });
    }
}