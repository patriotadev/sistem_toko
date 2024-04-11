import express from 'express';
import { createRole, deleteRoleById, getAllRole, getRoleById, updateRoleById } from './role.controller';
const router = express.Router();

router.post('/', createRole);
router.get('/', getAllRole);
router.get('/:id', getRoleById);
router.put('/', updateRoleById);
router.delete('/', deleteRoleById);

export default router;