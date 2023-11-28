import {Response, Request, NextFunction} from 'express';
import StokService from './stok.service';
import { IParamsQuery } from './interfaces/stok.interface';

export async function createStok(req: Request, res: Response) {
    try {
        const stokService = new StokService();
        await stokService.create(req.body);
        return res.status(201).send({
            'status': 'success',
            'code': 201,
            'message': 'Data has been added successfully.',
        })
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            'status': 'error',
            'code': 500,
            'message': 'Internal server error.'
        })
    }
}

export async function getAllStok(req: Request, res: Response) {
    try {
        console.log(req.query);
        const stokService = new StokService();
        const result = await stokService.findAll(req.query as unknown as IParamsQuery);
        res.status(200).send({
            'status': 'success',
            'code': 200,
            'data': result.data,
            'document': {...result.document}
        });
        // console.log({'data': result.data,
        // 'document': {...result.document}});
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            'status': 'error',
            'code': 500,
            'message': 'Internal server error.'
        })
    }
}

export async function getStokById(req: Request, res: Response) {
    try {
        const stokService = new StokService();
        console.log(req.params.id, "==> id");
        const result = await stokService.findOneById(req.params.id);
        console.log(result, "==> resulttt");
        res.status(200).send({
            'status': 'success',
            'code': 200,
            'data': result
        })
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            'status': 'error',
            'code': 500,
            'message': 'Internal server error.'
        })
    }
}

export async function updateStokById(req: Request, res: Response) {
    try {
        const stokService = new StokService();
        await stokService.updateOneById(req.body.id, req.body);
        res.status(200).send({
            'status': 'success',
            'code': 200,
            'message': 'Data has been updated successfully',
        })
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            'status': 'error',
            'code': 500,
            'message': 'Internal server error.'
        })
    }
}

export async function deleteStokById(req: Request, res: Response) {
    try {
        const stokService = new StokService();
        await stokService.deleteOneById(req.body.id);
        res.status(200).send({
            'status': 'success',
            'code': 200,
            'message': 'Data has been deleted successfully',
        })
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            'status': 'error',
            'code': 500,
            'message': 'Internal server error.'
        })
    }
}