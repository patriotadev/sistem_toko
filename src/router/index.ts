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

const router = express.Router();

router.get('/health', (req: Request, res: Response) => {
    res.send('App is healthy');
});

router.use('/api/auth', AuthRouter);
router.use('/api/stok', StokRouter);
router.use('/api/toko', TokoRouter);
router.use('/api/pt', PtRouter);
router.use('/api/role', RoleRouter);
router.use('/api/project', ProjectRouter);
router.use('/api/po', PoRouter);
router.use('/api/surat-jalan-po', SuratJalanPoRouter);
router.use('/api/barang-po', BarangPoRouter);
router.use('/api/invoice-po', InvoicePoRouter);
router.use('/api/tanda-terima-nota', TandaTerimaNotaRouter);
router.use('/api/barang-surat-jalan-po', BarangSuratJalanPoRouter);
router.use('/api/user', UserRouter);
router.use('/api/penjualan', PenjualanRouter);
router.use('/api/invoice-penjualan', InvoicePenjualanRouter);
router.use('/api/nota-penjualan', NotaPenjualanRouter);

router.use((req: Request, res: Response) => {
    res.status(400).send('Invalid route.');
})

export default router;

