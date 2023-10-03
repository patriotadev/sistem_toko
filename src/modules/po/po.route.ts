import express from 'express';
import { createPo, deletePoById, getAllPo, getPoById, updatePoById } from './po.controller';
const router = express.Router();

router.get('/', getAllPo);
router.get('/:id', getPoById);
router.post('/', createPo);
router.put('/', updatePoById);
router.delete('/', deletePoById);

export default router;