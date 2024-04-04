import { Request, Response, NextFunction } from "express"

export const AppValidationRequest = (req: Request, res: Response, next: NextFunction) => {
    const appName = req.header('X-Application-Name');
    const appKey = req.header('X-Application-Token');

    try {
        if (!appName) {
            return res.status(403).send({
                'status': 'error',
                'code': 403,
                'message': 'Access Denied.'
            });
        }
    
        if (appName !== process.env.APP_NAME) {
            return res.status(401).send({
                'status': 'error',
                'code': 401,
                'message': 'Access Denied.'
            });
        }
    
        if (appKey !== process.env.APP_KEY) {
            return res.status(401).send({
                'status': 'error',
                'code': 401,
                'message': 'Access Denied.'
            });
        }
        next();
    } catch (error) {
        return res.status(500).send({
            'status': 'error',
            'code': 500,
            'message': 'Internal Server Error.'
        });
    }
}