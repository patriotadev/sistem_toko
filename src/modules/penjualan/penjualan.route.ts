import express from 'express';
import { 
    createPenjualan,
    deletePenjualanById,
    getAllPenjualan,
    getBarangByPenjualanId,
    getPenjualanById,
    getPenjualanByManyId,
    updatePembayaran,
    updatePenjualanById } from './penjualan.controller';
import { cancelSuratJalanPenjualanById, createSuratJalanPenjualan, deleteSuratJalanPenjualanById, getAllSuratJalanPenjualan } from './surat-jalan-penjualan.controller';
const router = express.Router();

router.get('/surat-jalan', getAllSuratJalanPenjualan);
router.post('/surat-jalan', createSuratJalanPenjualan);
router.delete('/surat-jalan', deleteSuratJalanPenjualanById);
router.put('/surat-jalan/cancel', cancelSuratJalanPenjualanById);

router.get('/invoice', getPenjualanByManyId);
router.get('/barang', getBarangByPenjualanId);
router.get('/:id', getPenjualanById);
router.put('/pembayaran', updatePembayaran);
router.get('/', getAllPenjualan);
router.post('/', createPenjualan);
router.delete('/', deletePenjualanById);
router.put('/', updatePenjualanById);


export default router;