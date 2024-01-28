import { Request, Response, NextFunction } from 'express';
import NotaPenjualanService from './nota-penjualan.service';
import { NotaPenjualanListDTO } from './dto/nota-penjualan-list.dto';
import { IInvoicePenjualan } from '../invoice-penjualan/interfaces/invoice-penjualan.interface';
import { IParamsQuery } from './interfaces/nota-penjualan.interface';

export async function createNotaPenjualan(req: Request, res: Response) {
    try {
        const notaPenjualanService = new NotaPenjualanService();
        const notaRes = await notaPenjualanService.create(req.body);
        const invoicePenjualanListPayload: Omit<NotaPenjualanListDTO, "id">[] = [];
        if (notaRes) {
            req.body.invoicePenjualanListPayload.forEach((item: IInvoicePenjualan) => {
                invoicePenjualanListPayload.push({
                    notaPenjualanId: notaRes.id,
                    invoicePenjualanId: item.id,
                });
            });
        }
        await notaPenjualanService.createNotaList(invoicePenjualanListPayload);
        return res.status(201).send({
            'status': 'success',
            'code': 201,
            'message': 'Data has been added successfully.'
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

export async function getAllNotaPenjualan(req: Request, res: Response) {
    try {
        const notaPenjualanService = new NotaPenjualanService();
        const result = await notaPenjualanService.findAll(req.query as unknown as IParamsQuery);
        return res.status(200).send({
            'status': 'success',
            'code': 200,
            'data': result.data,
            'document': {...result.document}
        })
    } catch (error) {
        return res.status(500).send({
            'status': 'error',
            'code': 500,
            'message': 'Internal server error.'
        });
    }
}

export async function getNotaPenjualanById(req: Request, res: Response) {
    try {
        const notaPenjualanService = new NotaPenjualanService();
        const result = await notaPenjualanService.findOneById(req.params.id);
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

export async function updateNotaPenjualanById(req: Request, res: Response) {
    try {
        const notaPenjualanService = new NotaPenjualanService();
        await notaPenjualanService.updateOneById(req.body.id, req.body);
        await notaPenjualanService.deleteManyNotaList(req.body.id)
        await notaPenjualanService.createNotaList(req.body.invoicePenjualanListPayload);
        return res.status(200).send({
            'status': 'success',
            'code': 200,
            'message': 'Data has been updated successfully.'
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

export async function deleteNotaPenjualanById(req: Request, res: Response) {
    try {
        const notaPenjualanService = new NotaPenjualanService();
        await notaPenjualanService.deleteManyNotaList(req.body.id)
        await notaPenjualanService.deleteOneById(req.body.id);
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