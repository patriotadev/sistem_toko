import { Request, Response, NextFunction } from 'express';
import PaymentAccountService from './payment-account.service';
import { IParamsQuery } from './interfaces/payment-account.interface';
const debug = require('debug')('hbpos-server:payment-account-module');

export async function create(req: Request, res: Response) {
    try {
        const paymentAccountService = new PaymentAccountService();
        await paymentAccountService.create(req.body);
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

export async function getAll(req: Request, res: Response) {
    try {
        const paymentAccountService = new PaymentAccountService();
        const result = await paymentAccountService.findAll(req.query as unknown as IParamsQuery);
        debug(result);
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

export async function updateById(req: Request, res: Response) {
    try {
        const paymentAccountService = new PaymentAccountService();
        await paymentAccountService.update(req.body);
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

export async function deleteById(req: Request, res: Response) {
    try {
        const paymentAccountService = new PaymentAccountService();
        await paymentAccountService.destroy(req.body);
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
