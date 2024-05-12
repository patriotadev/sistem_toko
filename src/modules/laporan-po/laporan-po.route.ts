import express from 'express';
import { getDaftarTagihan, getLaporanPenjualan, getMasterReport } from './laporan-po.controller';
const router = express.Router();

router.get('/', getDaftarTagihan);
router.get('/penjualan', getLaporanPenjualan);
router.get('/master', getMasterReport);

export default router;