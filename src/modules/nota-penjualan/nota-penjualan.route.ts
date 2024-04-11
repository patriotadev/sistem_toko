import express from 'express';
import { 
    createNotaPenjualan,
    deleteNotaPenjualanById,
    getAllNotaPenjualan,
    getNotaPenjualanById,
    updateNotaPenjualanById 
} from './nota-penjualan.controller';
const router = express.Router();

router.get('/', getAllNotaPenjualan);
router.get('/:id', getNotaPenjualanById);
router.post('/', createNotaPenjualan);
router.put('/', updateNotaPenjualanById);
router.delete('/', deleteNotaPenjualanById);

export default router;