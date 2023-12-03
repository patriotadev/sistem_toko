import express from 'express';
import { createPo, deletePoById, getAllPo, getPoById, updatePoById, updateStatusPoById } from './po.controller';
const router = express.Router();

router.get('/', getAllPo);
router.get('/:id', getPoById);
router.post('/', createPo);
router.put('/', updatePoById);
router.put('/status', updateStatusPoById);
router.delete('/', deletePoById);

export default router;