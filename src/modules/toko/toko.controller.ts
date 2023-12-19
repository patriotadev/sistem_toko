import {Request, Response, NextFunction} from 'express';
import TokoService from './toko.service';
import { IParamsQuery } from './interfaces/toko.interface';

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

export async function updateToko(req: Request, res: Response) {
    try {
        const tokoService = new TokoService();
        await tokoService.updateToko(req.body.id, req.body);
        return res.status(200).send({
            'status': 'success',
            'code': 200,
            'message': 'Data has been updated successfully.',
        })
    } catch (error) {
        return res.status(500).send({
            'status': 'error',
            'code': 500,
            'message': 'Internal server error.'
        });
    }
}

export async function deleteToko(req: Request, res: Response) {
    try {
        const tokoService = new TokoService();
        await tokoService.deleteToko(req.body.id);
        return res.status(200).send({
            'status': 'success',
            'code': 200,
            'message': 'Data has been deleted successfully.',
        })
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            'status': 'error',
            'code': 500,
            'message': 'Internal server error.'
        });
    }
}

export async function getAllTokoList(req: Request, res: Response) {
    try {
        const tokoService = new TokoService();
        const result = await tokoService.findList();
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

export async function getAllToko(req: Request, res: Response) {
    try {
        const tokoService = new TokoService();
        const result = await tokoService.findAll(req.query as unknown as IParamsQuery);
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