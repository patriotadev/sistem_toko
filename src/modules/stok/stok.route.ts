import express from 'express';
import { createStok, deleteStokById, getAllStok, getStokById, updateStokById } from './stok.controller';

const router = express.Router();

router.get('/', getAllStok);
router.get('/:id', getStokById);
router.post('/', createStok);
router.put('/', updateStokById);
router.delete('/', deleteStokById);

export default router;