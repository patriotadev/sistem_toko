import express from 'express';
import { createTandaTerimaNota, deleteTandaTerimaNotaById, getAllTandaTerimaNota, getTandaTerimaNotaById, updateStatusNotaById, updateTandaTerimaNotaById } from './tanda-terima-nota.controller';
const router = express.Router();

router.get('/', getAllTandaTerimaNota);
router.get('/:id', getTandaTerimaNotaById);
router.post('/', createTandaTerimaNota);
router.put('/status', updateStatusNotaById);
router.put('/', updateTandaTerimaNotaById);
router.delete('/', deleteTandaTerimaNotaById);

export default router;