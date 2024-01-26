import express from 'express';
import { 
    createInvoicePenjualan,
    deleteInvoicePenjualanById,
    getAllInvoicePenjualan,
    getInvoicePenjualanById,
    getInvoicePenjualanByManyId,
    updateInvoicePenjualanById
} from './invoice-penjualan.controller';
const router = express.Router();

router.get('/nota', getInvoicePenjualanByManyId);
router.get('/', getAllInvoicePenjualan);
router.get('/:id', getInvoicePenjualanById);
router.post('/', createInvoicePenjualan);
router.put('/', updateInvoicePenjualanById);
router.delete('/', deleteInvoicePenjualanById);

export default router;