import express from 'express';
import { create, deleteById, getAll, updateById } from './payment-account.controller';
const router = express.Router();

router.post('/', create);
router.get('/', getAll);
router.put('/', updateById);
router.delete('/', deleteById);

export default router;