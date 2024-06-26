import express, { NextFunction, Request, Response } from 'express';
import {generateNewToken, login, logout, register} from './auth.controller';
import verifyToken from '../../middlewares/verify-token';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/token', generateNewToken)
router.post('/logout', logout);

export default router;