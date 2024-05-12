import { Request, Response, NextFunction } from 'express';
import LaporanPoService from './laporan-po.service';
const debug = require('debug')('hbpos-server:laporan-controller');


export async function getDaftarTagihan(req: Request, res: Response) {
    try {
        const laporanPoService = new LaporanPoService();
        const result = await laporanPoService.getDaftarTagihan(req.query);
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

export async function getLaporanPenjualan(req: Request, res: Response) {
    try {
        const laporanPoService = new LaporanPoService();
        const result = await laporanPoService.getLaporanPenjualan(req.query);
        return res.status(200).send({
            'status': 'success',
            'code': 200,
            'data': result,
        })
    } catch (error) {
        debug(error, ">> error");
        return res.status(500).send({
            'status': 'error',
            'code': 500,
            'message': 'Internal server error.'
        });
    }
}

export async function getMasterReport(req: Request, res: Response) {
    try {
        const laporanPoService = new LaporanPoService();
        const result = await laporanPoService.getMasterReport();
        return res.status(200).send({
            'status': 'success',
            'code': 200,
            'data': result,
        })
    } catch (error) {
        debug(error, ">> error");
        return res.status(500).send({
            'status': 'error',
            'code': 500,
            'message': 'Internal server error.'
        });
    }
}