import { Request, Response, NextFunction } from 'express';
import InvoicePenjualanService from './invoice-penjualan.service';
import { IPenjualan } from '../penjualan/interfaces/penjualan.interface';
import { InvoicePenjualanListDTO } from './dto/invoice-penjualan-list.dto';
import { IParamsQuery } from './interfaces/invoice-penjualan.interface';
import { debug } from 'console';

export async function createInvoicePenjualan(req: Request, res: Response) {
    try {
        const invoicePenjualanService = new InvoicePenjualanService();
        const invoicePenjualanRes = await invoicePenjualanService.create(req.body);
        const penjualanListPayload: Omit<InvoicePenjualanListDTO, "id">[] = [];
        if (invoicePenjualanRes) {
            req.body.penjualanListPayload.forEach((item: IPenjualan) => {
                penjualanListPayload.push({
                    invoicePenjualanId: invoicePenjualanRes.id,
                    penjualanId: item.id
                });
            });
        }
        await invoicePenjualanService.createInvoicePenjualanList(penjualanListPayload);
        return res.status(201).send({
            'status': 'success',
            'code': 201,
            'message': 'Data has been added successfully.'
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

export async function getAllInvoicePenjualan(req: Request, res: Response) {
    try {
        const invoicePenjualanService = new InvoicePenjualanService();
        const result = await invoicePenjualanService.findAll(req.query as unknown as IParamsQuery);
        return res.status(200).send({
            'status': 'success',
            'code': 200,
            'data': result.data,
            'document': {...result.document}
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

export async function getInvoicePenjualanByManyId(req: Request, res: Response) {
    try {
        const invoicePenjualanService = new InvoicePenjualanService();
        debug(req.query.id, ">> id query");
        const result = await invoicePenjualanService.findManyById(req.query.id);
        debug(result, ">> RESULTT");
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

export async function getInvoicePenjualanById(req: Request, res: Response) {
    try {
        const invoicePenjualanService = new InvoicePenjualanService();
        const result = await invoicePenjualanService.findOneById(req.params.id);
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

export async function updateInvoicePenjualanById(req: Request, res: Response) {
    try {
        const invoicePenjualanService = new InvoicePenjualanService();
        const invoicePenjualanRes = await invoicePenjualanService.updateOneById(req.body.id, req.body);
        await invoicePenjualanService.deleteManyInvoicePenjualanList(req.body.id)
        await invoicePenjualanService.createInvoicePenjualanList(req.body.penjualanListPayload);
       
        return res.status(201).send({
            'status': 'success',
            'code': 200,
            'message': 'Data has been updated successfully.'
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

export async function updateStatusInvoiceById(req: Request, res: Response) {
    try {
        const invoicePenjualanService = new InvoicePenjualanService();
        const result = await invoicePenjualanService.updateStatusById(req.body.id, req.body);
        debug(result, ">>");
        return res.status(200).send({
            'status': 'success',
            'code': 200,
            'message': 'Data has been updated successfully.'
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

export async function deleteInvoicePenjualanById(req: Request, res: Response) {
    try {
        const invoicePenjualanService = new InvoicePenjualanService();
        await invoicePenjualanService.deleteManyInvoicePenjualanList(req.body.id)
        await invoicePenjualanService.deleteOneById(req.body.id);
        return res.status(200).send({
            'status': 'success',
            'code': 200,
            'message': 'Data has been deleted successfully.'
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