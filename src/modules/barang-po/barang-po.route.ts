import express from 'express';
import { createBarangPo, deleteBarangPoById, getAllBarangPo, getBarangPoById, updateBarangPoById } from './barang-po.controller';
const router = express.Router();

router.get('/', getAllBarangPo);
router.get('/:id', getBarangPoById);
router.post('/', createBarangPo);
router.put('/', updateBarangPoById);
router.delete('/', deleteBarangPoById);

export default router;