import { Request, Response, NextFunction } from 'express';
import InvoicePoService from './invoice-po.service';
import { IPo } from '../po/interfaces/po.interface';
import { InvoicePoListDTO } from './dto/invoice-po-list.dto';
import { IParamsQuery } from './interfaces/invoice-po.interface';
const debug = require('debug')('hbpos-server:invoice-po-controller');

export async function createInvoicePo(req: Request, res: Response) {
    try {
        const invoicePoService = new InvoicePoService();
        const invoicePoRes = await invoicePoService.create(req.body);
        // const poListPayload: Omit<InvoicePoListDTO, "id">[] = [];
        // if (invoicePoRes) {
        //     req.body.poListPayload.forEach((item: IPo) => {
        //         poListPayload.push({
        //             invoicePoId: invoicePoRes.id,
        //             poId: item.id
        //         });
        //     });
        // }
        // await invoicePoService.createInvoicePoList(poListPayload);
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

export async function getAllInvoicePo(req: Request, res: Response) {
    try {
        debug(req.query, ">>>> req.query inv po")
        const invoicePoService = new InvoicePoService();
        const result = await invoicePoService.findAll(req.query as unknown as IParamsQuery);
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

export async function getInvoicePoByManyId(req: Request, res: Response) {
    try {
        const invoicePoService = new InvoicePoService();
        console.log("queryyyyyy==>", req.query.id);
        const result = await invoicePoService.findManyById(req.query.id);
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

export async function getInvoiceList(req: Request, res: Response) {
    try {
        const invoicePoService = new InvoicePoService();
        const result = await invoicePoService.getList(req.query);
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
        const invoicePoRes = await invoicePoService.updateOneById(req.body.id, req.body);
        // const poListPayload: InvoicePoListDTO[] = [];
        console.log("po list payload ===>", req.body.poListPayload);
        await invoicePoService.deleteManyInvoicePoList(req.body.id)
        await invoicePoService.createInvoicePoList(req.body.poListPayload);
       
        return res.status(201).send({
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

// export async function updateStatusInvoiceById(req: Request, res: Response) {
//     try {
//         const invoicePoService = new InvoicePoService();
//         const result = await invoicePoService.updateStatusById(req.body.id, req.body);
//         debug(result, ">>");
//         return res.status(200).send({
//             'status': 'success',
//             'code': 200,
//             'message': 'Data has been updated successfully.'
//         });
//     } catch (error) {
//         console.log(error);
//         return res.status(500).send({
//             'status': 'error',
//             'code': 500,
//             'message': 'Internal server error.'
//         });
//     }
// }

export async function deleteInvoicePoById(req: Request, res: Response) {
    try {
        const invoicePoService = new InvoicePoService();
        await invoicePoService.deleteManyInvoicePoList(req.body.id)
        await invoicePoService.deleteOneById(req.body.id);
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