import express from 'express';
import { createToko, getAllToko, getTokoById } from './toko.controller';
const router = express.Router();

router.post('/', createToko);
router.get('/', getAllToko);
router.get('/:id', getTokoById);

export default router;