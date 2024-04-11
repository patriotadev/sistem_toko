import express from'express';
import { createPt, deletePtById, getAllPt, getList, getPtById, updatePtById } from './pt.controller';
const router = express.Router();

router.post('/', createPt);
router.get('/', getAllPt);
router.get('/list', getList);
router.get('/:id', getPtById);
router.put('/', updatePtById);
router.delete('/', deletePtById);

export default router;