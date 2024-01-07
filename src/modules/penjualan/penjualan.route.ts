import express from 'express';
import { 
    createPenjualan,
    deletePenjualanById,
    getAllPenjualan,
    getBarangByPenjualanId,
    updatePembayaran,
    updatePenjualanById } from './penjualan.controller';
const router = express.Router();

router.get('/', getAllPenjualan);
router.get('/barang', getBarangByPenjualanId);
router.post('/', createPenjualan);
router.delete('/', deletePenjualanById);
router.put('/', updatePenjualanById);
router.put('/pembayaran', updatePembayaran);

export default router;