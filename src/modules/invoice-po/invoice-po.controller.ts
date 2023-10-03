import { Request, Response, NextFunction } from 'express';
import InvoicePoService from './invoice-po.service';

export async function createInvoicePo(req: Request, res: Response) {
    try {
        const invoicePoService = new InvoicePoService();
        await invoicePoService.create(req.body);
        return res.status(201).send({
            'status': 'success',
            'code': 201,
            'message': 'Data has been added successfully.'
        })
    } catch (error) {
        return res.status(500).send({
            'status': 'error',
            'code': 500,
            'message': 'Internal server error.'
        });
    }
}

export async function getAllInvoicePo(req: Request, res: Response) {
    try {
        const invoicePoService = new InvoicePoService();
        const result = await invoicePoService.findAll();
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

export async function getInvoicePoById(req: Request, res: Response) {
    try {
        const invoicePoService = new InvoicePoService();
        const result = await invoicePoService.findOneById(req.params.id);
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

export async function updateInvoicePoById(req: Request, res: Response) {
    try {
        const invoicePoService = new InvoicePoService();
        await invoicePoService.updateOneById(req.body.id, req.body);
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

export async function deleteInvoicePoById(req: Request, res: Response) {
    try {
        const invoicePoService = new InvoicePoService();
        await invoicePoService.deleteOneById(req.body.id);
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