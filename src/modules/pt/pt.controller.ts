import { Request, Response, NextFunction } from 'express';
import PtService from './pt.service';
import { IParamsQuery } from './interfaces/pt.interface';

export async function createPt(req: Request, res: Response) {
    try {
        const ptService = new PtService();
        await ptService.create(req.body);
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

export async function getList(req: Request, res: Response) {
    try {
        const ptService = new PtService();
        const result = await ptService.getList();
        console.log(result);
        return res.status(200).send({
            'status': 'success',
            'code': 200,
            'data': result,
        });
    } catch (error) {
        return res.status(500).send({
            'status': 'error',
            'code': 500,
            'message': 'Internal server error.'
        });
    }
}

export async function getAllPt(req: Request, res: Response) {
    try {
        const ptService = new PtService();
        const result = await ptService.findAll(req.query as unknown as IParamsQuery);
        console.log(result);
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

export async function getPtById(req: Request, res: Response) {
    try {
        const ptService = new PtService();
        const result = await ptService.findOneById(req.params.id);
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

export async function updatePtById(req: Request, res: Response) {
    try {
        const ptService = new PtService();
        await ptService.updateOneById(req.body.id, req.body);
        return res.status(200).send({
            'status': 'success',
            'code': 200,
            'message': 'Data has been updated successfully.'
        });
    } catch (error) {
        return res.status(500).send({
            'status': 'error',
            'code': 500,
            'message': 'Internal server error.'
        });
    }
}

export async function deletePtById(req: Request, res: Response) {
    try {
        const ptService = new PtService();
        await ptService.deleteOneById(req.body.id);
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