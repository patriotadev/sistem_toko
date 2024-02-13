import { Request, Response, NextFunction } from 'express';
import TandaTerimaNotaService from './tanda-terima-nota.service';
import { NotaListDTO } from './dto/nota-list-dto';
import { IInvoicePo } from '../invoice-po/interfaces/invoice-po.interface';
import { IParamsQuery } from './interfaces/tanda-terima-nota.interface';

export async function createTandaTerimaNota(req: Request, res: Response) {
    try {
        const tandaTerimaNotaService = new TandaTerimaNotaService();
        const notaRes = await tandaTerimaNotaService.create(req.body);
        const invoicePoListPayload: Omit<NotaListDTO, "id">[] = [];
        if (notaRes) {
            req.body.invoicePoListPayload.forEach((item: IInvoicePo) => {
                invoicePoListPayload.push({
                    tandaTerimaNotaId: notaRes.id,
                    invoicePoId: item.id,
                });
            });
        }
        await tandaTerimaNotaService.createNotaList(invoicePoListPayload);
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

export async function getAllTandaTerimaNota(req: Request, res: Response) {
    try {
        const tandaTerimaNotaService = new TandaTerimaNotaService();
        const result = await tandaTerimaNotaService.findAll(req.query as unknown as IParamsQuery);
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
         // const poListPayload: InvoicePoListDTO[] = [];
        await tandaTerimaNotaService.deleteManyTandaTerimaNotaList(req.body.id)
        await tandaTerimaNotaService.createNotaList(req.body.invoicePoListPayload);
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

export async function updateStatusNotaById(req: Request, res: Response) {
    try {
        const tandaTerimaNotaService = new TandaTerimaNotaService();
        await tandaTerimaNotaService.updateStatusById(req.body.id, req.body);
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
        await tandaTerimaNotaService.deleteManyTandaTerimaNotaList(req.body.id)
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