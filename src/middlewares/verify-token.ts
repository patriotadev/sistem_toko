import { Request, Response, NextFunction } from 'express';
import Jwt from 'jsonwebtoken';
const debug = require('debug')('hbpos-server:verify-token');

const verifyToken = (req: any, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    debug(authHeader, ">>> AUTH HEADER");
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) return res.sendStatus(401);
    Jwt.verify(token as string, process.env.ACCESS_TOKEN as  string, (err, user) => {
        console.log(err);
        debug(err, ">>> ERR JWT VALIDATE");
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

export default verifyToken;