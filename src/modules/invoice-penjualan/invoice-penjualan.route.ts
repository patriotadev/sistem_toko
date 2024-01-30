import express from 'express';
import { 
    createInvoicePenjualan,
    deleteInvoicePenjualanById,
    getAllInvoicePenjualan,
    getInvoicePenjualanById,
    getInvoicePenjualanByManyId,
    updateInvoicePenjualanById,
    updateStatusInvoiceById
} from './invoice-penjualan.controller';
const router = express.Router();

router.get('/nota', getInvoicePenjualanByManyId);
router.get('/', getAllInvoicePenjualan);
router.get('/:id', getInvoicePenjualanById);
router.post('/', createInvoicePenjualan);
router.put('/', updateInvoicePenjualanById);
router.put('/status', updateStatusInvoiceById);
router.delete('/', deleteInvoicePenjualanById);

export default router;