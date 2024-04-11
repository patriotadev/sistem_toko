import { Request, Response, NextFunction } from 'express';
import PoService from './po.service';
import { IParamsQuery } from './interfaces/po.interface';
import BarangPoService from '../barang-po/barang-po.service';
import BarangPoDTO from '../barang-po/dto/barang-po.dto';
import StokService from '../stok/stok.service';
import { thousandLimiter } from '../../helpers/thousand-limiter';
const debug = require('debug')('hbpos-server:po-controller');

export async function createPo(req: Request, res: Response) {
    try {
        const poService = new PoService();
        const barangPoService = new BarangPoService();
        const stokService = new StokService();
        const poResult = await poService.create(req.body.po).catch((e) => {
            return e;
        });
        if (poResult.prismaError) {
            return res.status(400).send({
                'status': 'error',
                'code': 400,
                'message': 'Error while process data.',
                'error': poResult
            });
        }

        if (req.body.stokPo.length > 0) {
            await stokService.createStokPo(req.body.stokPo);
        }
        const barangPoMasterPayload: Omit<BarangPoDTO, "id">[] = [];
        if (poResult) {
            req.body.barangPo.map(async (item: Omit<BarangPoDTO, "id">) => {
                barangPoMasterPayload.push({
                    kode: item.kode,
                    nama: item.nama,
                    qty: item.qty,
                    satuan: item.satuan,
                    harga: item.harga,
                    jumlahHarga: item.jumlahHarga,
                    discount: item.discount,
                    step: 1,
                    isMaster: true,
                    poId: poResult.id,
                    stokBarangId: item.stokBarangId,
                    createdBy: item.createdBy
                })
            });
            await barangPoService.create(barangPoMasterPayload);
            const barangPoPayload: Omit<BarangPoDTO, "id">[] = [];
            req.body.barangPo.map(async (item: Omit<BarangPoDTO, "id">) => {
                barangPoPayload.push({
                    kode: item.kode,
                    nama: item.nama,
                    qty: item.qty,
                    satuan: item.satuan,
                    harga: item.harga,
                    jumlahHarga: item.jumlahHarga,
                    discount: item.discount,
                    step: 2,
                    isMaster: false,
                    poId: poResult.id,
                    stokBarangId: item.stokBarangId,
                    createdBy: item.createdBy
                })
            });
            await barangPoService.create(barangPoPayload);
            const pembayaranPayload = {
                metode: req.body.pembayaran.metodePembayaran,
                jumlahBayar: req.body.pembayaran.jumlahBayar,
                nominal: 0,
                totalPembayaran: req.body.pembayaran.totalPembayaran,
                poId: poResult.id,
                isApprove: req.body.pembayaran.isApprove,
                approvedAt: req.body.pembayaran.approvedAt,
                approvedBy: req.body.pembayaran.approvedBy,
                createdBy: req.body.pembayaran.createdBy,
                createdAt: req.body.pembayaran.createdAt
            };
            const pembayaranResult = await poService.createPembayaran(pembayaranPayload);
            const riwayatPembayaranPayload = {
                poId: poResult.id,
                pembayaranPoId: pembayaranResult.id,
                createdBy: req.body.pembayaran.createdBy,
                createdAt: req.body.pembayaran.createdAt,
                description: `PO baru ditambahkan dengan total pembayaran ${thousandLimiter(req.body.pembayaran.totalPembayaran, 'Rp')}`
            }
            await poService.createRiwayatPembayaran(riwayatPembayaranPayload);
        }
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

export async function updateMaster(req: Request, res: Response) {
    try {
        const poService = new PoService();
        const barangPoService = new BarangPoService();
        const poResult = await poService.create(req.body.po).catch((e) => {
            return e;
        });
        const barangPoPayload: Omit<BarangPoDTO, "id">[] = [];
        if (poResult) {
            req.body.barangPo.map(async (item: Omit<BarangPoDTO, "id">) => {
                const barangPoLastStep = await barangPoService.findLastStep(poResult.id, item.stokBarangId)
                console.log(barangPoLastStep, "<====BarangPoLastStep");
                barangPoPayload.push({
                    kode: item.kode,
                    nama: item.nama,
                    qty: item.qty,
                    satuan: item.satuan,
                    harga: item.harga,
                    jumlahHarga: item.jumlahHarga,
                    discount: item.discount,
                    step: Number(barangPoLastStep?.step) + 1,
                    isMaster: true,
                    poId: poResult.id,
                    stokBarangId: item.stokBarangId,
                    createdBy: item.createdBy
                })
            });
            await barangPoService.create(barangPoPayload)
        }
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

export async function updatePembayaran(req: Request, res: Response) {
    try {
        const poService = new PoService();
        const pembayaranResult = await poService.updatePembayaran(req.body);
        let description: string = '';
        debug(req.body, ">>> req.body updatePembayaran")
        if (req.body.nominalBayar && req.body.editJumlahBayar) {
            description = `Data sisa pembayaran diubah dengan nominal ${thousandLimiter(req.body.totalPembayaran - req.body.jumlahBayar + Number(req.body.nominalBayar), 'Rp')}, dan pembayaran ditambahkan dengan nominal ${thousandLimiter(req.body.nominalBayar, 'Rp')}`
        }
        else if (req.body.nominalBayar && !req.body.editJumlahBayar) {
            description = `Pembayaran ditambahkan dengan nominal ${thousandLimiter(req.body.nominalBayar, 'Rp')}`
        } else {
            description = `Data sisa pembayaran diubah dengan nominal ${thousandLimiter(req.body.totalPembayaran - req.body.jumlahBayar, 'Rp')}`
        }

        if (Number(pembayaranResult.totalPembayaran) === Number(pembayaranResult.jumlahBayar)) {
            description.concat(', status pembayaran SUDAH LUNAS')
        }

        const riwayatPembayaranPayload = {
            poId: req.body.poId,
            pembayaranPoId: req.body.id,
            createdBy: req.body.updatedBy,
            createdAt: req.body.updatedAt,
            description,
        };

        await poService.createRiwayatPembayaran(riwayatPembayaranPayload)
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

export async function getPoList(req: Request, res: Response) {
    try {
        const poService = new PoService();
        const result = await poService.getList(req.query as unknown as { search: string });
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

export async function getRiwayatPembayaran(req: Request, res: Response) {
    try {
        const poService = new PoService();
        const result = await poService.findRiwayatPembayaran(req.query as unknown as { poId: string });
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

export async function getAllPo(req: Request, res: Response) {
    try {
        debug(req.query, ">>> getAllPo");
        const poService = new PoService();
        const result = await poService.findAll(req.query as unknown as IParamsQuery);
        debug("=== getAllPo result ===")
        debug(result)
        return res.status(200).send({
            'status': 'success',
            'code': 200,
            'data': result.data,
            'document': {...result.document}
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

export async function getPoById(req: Request, res: Response) {
    try {
        const poService = new PoService();
        const result = await poService.findOneById(req.params.id);
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

export async function getPoByManyId(req: Request, res: Response) {
    try {
        const poService = new PoService();
        console.log("queryyyyyy==>", req.query.id);
        const result = await poService.findManyById(req.query.id);
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



export async function updateStatusPoById(req: Request, res: Response) {
    try {
        const poService = new PoService();
        await poService.updateStatusById(req.body.po.id, req.body.po);
        return res.status(200).send({
            'status': 'success',
            'code': 201,
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

export async function updatePoById(req: Request, res: Response) {
    try {
        debug(req.body, ">> req.bodyy updateMaster");
        const poService = new PoService();
        const barangPoService = new BarangPoService();
        await poService.updateOneById(req.body.po.id, req.body.po);
        const barangPoMasterPayload: Omit<BarangPoDTO, "id">[] = [];
        const barangPoNextPayload: Omit<BarangPoDTO, "id">[] = [];
        console.log(req.body.barangPo, "<===BarangPo");
        req.body.barangPo.map((item: Omit<BarangPoDTO, "id">) => {
            barangPoMasterPayload.push({
                kode: item.kode,
                nama: item.nama,
                qty: Number(item.qty),
                satuan: item.satuan,
                harga: Number(item.harga),
                jumlahHarga: Number(item.harga) * Number(item.qty),
                discount: Number(item.discount),
                step: Number(item.step) + 2,
                isMaster: true,
                poId: req.body.po.id,
                stokBarangId: item.stokBarangId,
                createdBy: item.createdBy
            })
        });
        const createNewMaster = await barangPoService.create(barangPoMasterPayload);
        barangPoMasterPayload.forEach(async (item) => {
            const previousBarangPoQty = await barangPoService.findPreviousDifferenceQty(Number(item.step) - 2, Number(item.step) - 1, item.stokBarangId);
            console.log(previousBarangPoQty, "<==previous Barang Po");
            const newQty = item.qty - Number(previousBarangPoQty);
            await barangPoService.createOne({
                kode: item.kode,
                nama: item.nama,
                qty:  Number(newQty),
                satuan: item.satuan,
                harga: Number(item.harga),
                jumlahHarga: Number(item.harga) * Number(newQty),
                discount: Number(item.discount),
                step: Number(item.step) + 1,
                isMaster: false,
                poId: req.body.po.id,
                stokBarangId: item.stokBarangId,
                createdBy: item.createdBy
            })
        });
        await poService.updatePembayaran(req.body.pembayaran);
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

export async function deletePoById(req: Request, res: Response) {
    try {
        console.log(req.body);
        const poService = new PoService();
        const barangPoService = new BarangPoService();
        await barangPoService.deleteManyByPoId(req.body.id);
        await poService.deleteOneById(req.body.id);

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