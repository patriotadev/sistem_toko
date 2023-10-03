import { Request, Response, NextFunction } from 'express';
import SuratJalanPoService from './surat-jalan-po.service';

export async function createSuratJalanPo(req: Request, res: Response) {
    try {
        const suratJalanPoService = new SuratJalanPoService();
        await suratJalanPoService.create(req.body);
        return res.status(201).send({
            'status': 'success',
            'code': 201,
            'message': 'Data has been added successfully.'
        });
    } catch (error) {
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
        const result = await suratJalanPoService.findAll();
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
        await suratJalanPoService.deleteOneById(req.body.id);
    } catch (error) {
        return res.status(500).send({
            'status': 'error',
            'code': 500,
            'message': 'Internal server error.'
        });
    }
}