import {Request, Response, NextFunction} from 'express';
import TokoService from './toko.service';

export async function createToko(req: Request, res: Response) {
    try {
        const tokoService = new TokoService();
        await tokoService.createToko(req.body);
        return res.status(201).send({
            'status': 'success',
            'code': 201,
            'message': 'Data has been added successfully.',
        });
    } catch (error) {
        return res.status(500).send({
            'status': 'error',
            'code': 500,
            'message': 'Internal server error.'
        });
    }
}

export async function getAllToko(req: Request, res: Response) {
    try {
        const tokoService = new TokoService();
        const result = await tokoService.findAll();
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

export async function getTokoById(req: Request, res: Response) {
    try {
        const tokoService =  new TokoService();
        const result = await tokoService.findOneById(req.params.id);
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