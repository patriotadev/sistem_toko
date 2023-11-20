import { Request, Response, NextFunction } from 'express';
import SuratJalanPoService from './surat-jalan-po.service';
import BarangSuratJalanPoService from '../barang-surat-jalan-po/barang-surat-jalan-po.service';
import SuratJalanPoDTO from './dto/surat-jalan-po.dto';
import BarangSuratJalanPoDTO from '../barang-surat-jalan-po/dto/barang-surat-jalan-po.dto';
import StokService from '../stok/stok.service';
import StokDTO from '../stok/dto/stok.dto';
import { IParamsQuery } from './interfaces/surat-jalan-po.interface';

export async function createSuratJalanPo(req: Request, res: Response) {
    try {
        const suratJalanPoService = new SuratJalanPoService();
        const barangSuratJalanPoService = new BarangSuratJalanPoService();
        const stokService = new StokService();
        const suratJalanPoResult = await suratJalanPoService.create(req.body.suratJalan);
        const barangSuratJalanPoPayload: Omit<BarangSuratJalanPoDTO, "id">[] = [];
        const stokBarangPayload: Pick<StokDTO, "id" | "jumlah">[] = [];
        req.body.barangPo.map((item: BarangSuratJalanPoDTO) => {
            barangSuratJalanPoPayload.push({
                nama: item.nama,
                qty: item.qty,
                satuan: item.satuan,
                suratJalanPoId: suratJalanPoResult.id,
                createdBy: item.createdBy
            });
            stokBarangPayload.push({
                id: item.id,
                jumlah: item.qty
            })
        });
        await barangSuratJalanPoService.create(barangSuratJalanPoPayload);
        await stokService.updateManyById(stokBarangPayload);
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

export async function getAllSuratJalanPo(req: Request, res: Response) {
    try {
        const suratJalanPoService = new SuratJalanPoService();
        console.log("queryy", req.query);
        const result = await suratJalanPoService.findAll(req.query as unknown as IParamsQuery);
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

export async function getSuratJalanPoById(req: Request, res: Response) {
    try {
        const suratJalanPoService = new SuratJalanPoService();
        const result = await suratJalanPoService.findOneById(req.params.id);
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

export async function updateSuratJalanPoById(req: Request, res: Response) {
    try {
        const suratJalanPoService = new SuratJalanPoService();
        await suratJalanPoService.updateOneById(req.body.id, req.body)
    } catch (error) {
        return res.status(500).send({
            'status': 'error',
            'code': 500,
            'message': 'Internal server error.'
        });
    }
}

export async function deleteSuratJalanPoById(req: Request, res: Response) {
    try {
        const suratJalanPoService = new SuratJalanPoService();
        const barangSuratJalanPoService = new BarangSuratJalanPoService();
        await barangSuratJalanPoService.deleteManyBySuratJalanPoId(req.body.id);
        await suratJalanPoService.deleteOneById(req.body.id);

        return res.status(200).send({
            'status': 'success',
            'code': 200,
            'message': 'Data has been deleted successfully.'
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