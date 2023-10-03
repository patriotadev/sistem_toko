import express from 'express';
import { createSuratJalanPo, deleteSuratJalanPoById, getAllSuratJalanPo, getSuratJalanPoById, updateSuratJalanPoById } from './surat-jalan-po.controller';
const router = express.Router();

router.get('/', getAllSuratJalanPo);
router.get('/:id', getSuratJalanPoById);
router.post('/', createSuratJalanPo);
router.put('/', updateSuratJalanPoById);
router.delete('/', deleteSuratJalanPoById);

export default router;