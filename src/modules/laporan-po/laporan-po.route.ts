import express from 'express';
import { getDaftarTagihan } from './laporan-po.controller';
const router = express.Router();

router.get('/', getDaftarTagihan);

export default router;