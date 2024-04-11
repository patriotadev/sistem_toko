import express from 'express';
import { 
    createPo,
    deletePoById,
    getAllPo,
    getPoById,
    getPoByManyId,
    getPoList,
    getRiwayatPembayaran, 
    updatePembayaran,
    updatePoById,
    updateStatusPoById
} from './po.controller';
const router = express.Router();

router.get('/invoice', getPoByManyId);
router.get('/', getAllPo);
router.get('/list', getPoList);
router.get('/riwayat-pembayaran', getRiwayatPembayaran);
router.get('/:id', getPoById);
router.put('/pembayaran', updatePembayaran);
router.post('/', createPo);
router.put('/', updatePoById);
router.put('/status', updateStatusPoById);
router.delete('/', deletePoById);

export default router;