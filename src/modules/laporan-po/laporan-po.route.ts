import express from 'express';
import { getDaftarTagihan, getLaporanPenjualan } from './laporan-po.controller';
const router = express.Router();

router.get('/', getDaftarTagihan);
router.get('/penjualan', getLaporanPenjualan);

export default router;