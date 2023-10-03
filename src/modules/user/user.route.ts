import express from 'express';
import { createUser, deleteUserById, getAllUser, getUserById, updateUserById } from './user.controller';
const router = express.Router();

router.get('/', getAllUser);
router.get('/:id', getUserById);
router.post('/', createUser);
router.put('/', updateUserById);
router.delete('/', deleteUserById);

export default router;