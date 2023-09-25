import {Request, Response, NextFunction} from 'express';
import AuthService from './auth.service';
import {RegisterValidation, LoginValidation} from './validators/auth-validator';

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
        const {error} = LoginValidation(req.body);
        if (error) return res.status(400).send({
            "message": "Failed",
            "error": error.details[0].message
        });
        const authService = new AuthService();
        const result = await authService.login(req.body);
        if (result) {
            const accessToken = authService.generateAccessToken(result.user);
            const refreshToken = authService.generateRefreshToken(result.user);
            await authService.postRefreshTokenToList(refreshToken, result.user);

            return res.status(201).send({
                "message": "Success",
                "data": {
                    accessToken,
                    refreshToken
                }
            });
        }
        return res.status(400).send({
            "message": "Failed",
            "error": 'User not found.'
        })
    } catch (error) {
        res.status(500).send({
            "message": "Failed",
            "error": 'Internal server error.'
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