import express from 'express';
import { createToko, getAllToko, getTokoById, getAllTokoList, updateToko, deleteToko } from './toko.controller';
const router = express.Router();

router.post('/', createToko);
router.put('/', updateToko);
router.delete('/', deleteToko);
router.get('/list', getAllTokoList);
router.get('/', getAllToko);
router.get('/:id', getTokoById);

export default router;