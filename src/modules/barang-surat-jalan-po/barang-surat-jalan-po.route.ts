import express from 'express';
import { 
    createBarangSuratJalanPo,
    deleteBarangSuratJalanPoById,
    getAllBarangSuratJalanPo,
    getBarangSuratJalanPoById,
    updateBarangSuratJalanPoById
} from './barang-surat-jalan-po.controller';
const router = express.Router();

router.get('/', getAllBarangSuratJalanPo);
router.get('/:id', getBarangSuratJalanPoById);
router.post('/', createBarangSuratJalanPo);
router.put('/', updateBarangSuratJalanPoById);
router.delete('/', deleteBarangSuratJalanPoById);

export default router;