import {Request, Response, NextFunction} from 'express';
import AuthService from './auth.service';
import {RegisterValidation, LoginValidation} from './validators/auth-validator';
const debug = require('debug')('hbpos-server:auth-controller');

export async function register(req: Request, res: Response) {
    try {
        const {error} = RegisterValidation(req.body);
        if (error) return res.status(400).send({
            "message": "Failed",
            "error": error.details[0].message
        });
        const authService = new AuthService();
        const result = await authService.register(req.body);
        const accessToken = authService.generateAccessToken(result);
        const refreshToken = authService.generateRefreshToken(result);
        await authService.postRefreshTokenToList(refreshToken, result);
        res.status(201).send({
            "message": "Success",
            "data": {
                accessToken,
                refreshToken
            }
        });
    } catch (error) {
        console.log(error)
        res.status(500).send({
            "message": "Failed",
            "error": 'Internal Server error'
        })
    }
}

export async function login(req: Request, res: Response, next: NextFunction) {
    try {
        console.log("payload", req.body);
        const {error} = LoginValidation(req.body);
        if (error) return res.status(400).send({
            "message": "Failed",
            "error": error.details[0].message
        });
        const authService = new AuthService();
        const result = await authService.login(req.body);
        debug(result, ">>> result");
        if (result) {
            const accessToken = await authService.generateAccessToken(result.user);
            const refreshToken = authService.generateRefreshToken(result.user);
            const userRole = await authService.getUserRole(result.user);
            const userToko = await authService.getUserToko(result.user);
            const paymentAccount = await authService.getPaymentAccount();
            const userRoleMenu = await authService.getUserRoleMenu(result.user);
            await authService.postRefreshTokenToList(refreshToken, result.user);
            console.log("Access Token==>", accessToken)
            debug(userRoleMenu, ">>> User Role Menu");
            return res.status(200).send({
                "status": "Success",
                "code": 200,
                "data": {
                    accessToken,
                    refreshToken,
                    role: userRole,      
                    toko: userToko, 
                    userRoleMenu: userRoleMenu,
                    paymentAccount                                                                        
                }
            });
        }
        return res.status(400).send({
            "status": "Failed",
            "code": 400,
            "error": 'Oops.. email atau password salah'
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            "Status": "Failed",
            "code": 500,
            "error": error
        })
    }
}

export async function generateNewToken(req: Request, res: Response, next: NextFunction) {
    try {
        const authService = new AuthService();
        const refreshToken = req.body.refreshToken;
        const accessToken = await authService.generateNewAccessToken(refreshToken);
        if (accessToken) {
            return res.status(201).send({
                "message": "Success",
                "data": {
                    accessToken,
                }
            })
        }
        return res.sendStatus(403);
    } catch (error) {
        res.status(500).send({
            "message": "Failed",
            "error": error
        })
    }

}

export async function logout (req: Request, res: Response, next: NextFunction) {
    try {
        const authService = new AuthService();
        await authService.logout(req.body.userId);
        res.status(201).send({
            "message": "Logout success.",
        })
    } catch (error) {
        res.status(500).send({
            "message": "Failed",
            "error": 'Internal server error.'
        })
    }
}