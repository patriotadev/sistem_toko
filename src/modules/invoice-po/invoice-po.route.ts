import express from 'express';
import { 
    createInvoicePo,
    deleteInvoicePoById,
    getAllInvoicePo,
    getInvoicePoById,
    getInvoicePoByManyId,
    updateInvoicePoById,
    // updateStatusInvoiceById
} from './invoice-po.controller';
const router = express.Router();

router.get('/nota', getInvoicePoByManyId);
router.get('/', getAllInvoicePo);
router.get('/:id', getInvoicePoById);
router.post('/', createInvoicePo);
router.put('/', updateInvoicePoById);
// router.put('/status', updateStatusInvoiceById);
router.delete('/', deleteInvoicePoById);

export default router;