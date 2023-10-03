import { Request, Response, NextFunction } from 'express';
import TandaTerimaNotaService from './tanda-terima-nota.service';

export async function createTandaTerimaNota(req: Request, res: Response) {
    try {
        const tandaTerimaNotaService = new TandaTerimaNotaService();
        await tandaTerimaNotaService.create(req.body);
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

export async function getAllTandaTerimaNota(req: Request, res: Response) {
    try {
        const tandaTerimaNotaService = new TandaTerimaNotaService();
        const result = await tandaTerimaNotaService.findAll();
        return res.status(200).send({
            'status': 'success',
            'code': 200,
            'data': result
        })
    } catch (error) {
        return res.status(500).send({
            'status': 'error',
            'code': 500,
            'message': 'Internal server error.'
        });
    }
}

export async function getTandaTerimaNotaById(req: Request, res: Response) {
    try {
        const tandaTerimaNotaService = new TandaTerimaNotaService();
        const result = await tandaTerimaNotaService.findOneById(req.params.id);
        return res.status(200).send({
            'status': 'success',
            'code': 200,
            'data': result
        })
    } catch (error) {
        return res.status(500).send({
            'status': 'error',
            'code': 500,
            'message': 'Internal server error.'
        });
    }
}

export async function updateTandaTerimaNotaById(req: Request, res: Response) {
    try {
        const tandaTerimaNotaService = new TandaTerimaNotaService();
        await tandaTerimaNotaService.updateOneById(req.body.id, req.body);
        return res.status(200).send({
            'status': 'success',
            'code': 200,
            'message': 'Data has been updated successfully.'
        })
    } catch (error) {
        return res.status(500).send({
            'status': 'error',
            'code': 500,
            'message': 'Internal server error.'
        });
    }
}

export async function deleteTandaTerimaNotaById(req: Request, res: Response) {
    try {
        const tandaTerimaNotaService = new TandaTerimaNotaService();
        await tandaTerimaNotaService.deleteOneById(req.body.id);
        return res.status(200).send({
            'status': 'success',
            'code': 200,
            'message': 'Data has been deleted successfully.'
        })
    } catch (error) {
        return res.status(500).send({
            'status': 'error',
            'code': 500,
            'message': 'Internal server error.'
        });
    }
}