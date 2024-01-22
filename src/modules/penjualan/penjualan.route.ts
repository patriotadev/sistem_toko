import express from 'express';
import { 
    createPenjualan,
    deletePenjualanById,
    getAllPenjualan,
    getBarangByPenjualanId,
    updatePembayaran,
    updatePenjualanById } from './penjualan.controller';
import { cancelSuratJalanPenjualanById, createSuratJalanPenjualan, deleteSuratJalanPenjualanById, getAllSuratJalanPenjualan } from './surat-jalan-penjualan.controller';
const router = express.Router();

router.get('/', getAllPenjualan);
router.get('/barang', getBarangByPenjualanId);
router.post('/', createPenjualan);
router.delete('/', deletePenjualanById);
router.put('/', updatePenjualanById);
router.put('/pembayaran', updatePembayaran);

router.get('/surat-jalan', getAllSuratJalanPenjualan);
router.post('/surat-jalan', createSuratJalanPenjualan);
router.delete('/surat-jalan', deleteSuratJalanPenjualanById);
router.put('/surat-jalan/cancel', cancelSuratJalanPenjualanById);

export default router;