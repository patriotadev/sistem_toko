import express from 'express';
import { cancelSuratJalanPoById, createSuratJalanPo, deleteSuratJalanPoById, getAllSuratJalanPo, getSuratJalanPoById, updateSuratJalanPoById } from './surat-jalan-po.controller';
const router = express.Router();

router.put('/cancel', cancelSuratJalanPoById);
router.get('/', getAllSuratJalanPo);
router.get('/:id', getSuratJalanPoById);
router.post('/', createSuratJalanPo);
router.put('/', updateSuratJalanPoById);
router.delete('/', deleteSuratJalanPoById);

export default router;