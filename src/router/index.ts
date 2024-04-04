import express, {Request, Response} from 'express';
import AuthRouter from '../modules/auth/auth.route';
import StokRouter from '../modules/stok/stok.route';
import TokoRouter from '../modules/toko/toko.route';
import PtRouter from '../modules/pt/pt.route';
import RoleRouter from '../modules/role/role.route';
import ProjectRouter from '../modules/project/project.route';
import PoRouter from '../modules/po/po.route';
import SuratJalanPoRouter from '../modules/surat-jalan-po/surat-jalan-po.route';
import BarangPoRouter from '../modules/barang-po/barang-po.route';
import InvoicePoRouter from '../modules/invoice-po/invoice-po.route';
import TandaTerimaNotaRouter from '../modules/tanda-terima-nota/tanda-terima-nota.route';
import BarangSuratJalanPoRouter from '../modules/barang-surat-jalan-po/barang-surat-jalan-po.route';
import UserRouter from '../modules/user/user.route';
import PenjualanRouter from '../modules/penjualan/penjualan.route';
import InvoicePenjualanRouter from '../modules/invoice-penjualan/invoice-penjualan.route';
import NotaPenjualanRouter from '../modules/nota-penjualan/nota-penjualan.route';
import LaporanPoRouter from '../modules/laporan-po/laporan-po.route';
import { AppValidationRequest } from '../middlewares/app-middleware';
const debug = require('debug')('hbpos-server:index-route');

const router = express.Router();

router.get('/health', (req: Request, res: Response) => {
    res.send('App is healthy');
});

router.use('/api/auth', AppValidationRequest, AuthRouter);
router.use('/api/stok', AppValidationRequest, StokRouter);
router.use('/api/toko', AppValidationRequest, TokoRouter);
router.use('/api/pt', AppValidationRequest, PtRouter);
router.use('/api/role', AppValidationRequest, RoleRouter);
router.use('/api/project', AppValidationRequest, ProjectRouter);
router.use('/api/po', AppValidationRequest, PoRouter);
router.use('/api/surat-jalan-po', AppValidationRequest, SuratJalanPoRouter);
router.use('/api/barang-po', AppValidationRequest, BarangPoRouter);
router.use('/api/invoice-po', AppValidationRequest, InvoicePoRouter);
router.use('/api/tanda-terima-nota', AppValidationRequest, TandaTerimaNotaRouter);
router.use('/api/barang-surat-jalan-po', AppValidationRequest, BarangSuratJalanPoRouter);
router.use('/api/user', AppValidationRequest, UserRouter);
router.use('/api/penjualan', AppValidationRequest, PenjualanRouter);
router.use('/api/invoice-penjualan', AppValidationRequest, InvoicePenjualanRouter);
router.use('/api/nota-penjualan', AppValidationRequest, NotaPenjualanRouter);
router.use('/api/laporan-po', AppValidationRequest, LaporanPoRouter);

router.use((req: Request, res: Response) => {
    res.status(400).send('Invalid route.');
})

export default router;

