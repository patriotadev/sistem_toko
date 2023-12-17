import { Request, Response, NextFunction } from 'express';
import UserService from './user.service';
import { IParamsQuery } from './interfaces/user.interface';

export async function createUser(req: Request, res: Response) {
    try {
        const userService = new UserService();
        await userService.create(req.body);
        return res.status(201).send({
            'status': 'success',
            'code': 201,
            'message': 'Data has been added successfully.'
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            'status': 'error',
            'code': 500,
            'message': 'Internal server error.'
        });
    }
}

export async function getAllUser(req: Request, res: Response) {
    try {
       const userService = new UserService();
       const result = await userService.findAll(req.query as unknown as IParamsQuery);
       return res.status(200).send({
            'status': 'success',
            'code': 200,
            'data': result.data,
            'document': {...result.document}
       }) 
    } catch (error) {
        return res.status(500).send({
            'status': 'error',
            'code': 500,
            'message': 'Internal server error.'
        });
    }
}

export async function getUserById(req: Request, res: Response) {
    try {
        const userService = new UserService();
        const result = await userService.findOneById(req.params.id);
        return res.status(200).send({
                'status': 'success',
                'code': 200,
                'data': result
        });
    } catch (error) {
        return res.status(500).send({
            'status': 'error',
            'code': 500,
            'message': 'Internal server error.'
        });
    }
}

export async function updateUserById(req: Request, res: Response) {
    try {
        const userService = new UserService();
        if (req.body.newPassword) {
            const updatePassResult = await userService.updatePasswordById(req.body.id, req.body);
            if (!updatePassResult) {
                return res.status(400).send({
                    'status': 'failed',
                    'code': 400,
                    'message': 'Password lama tidak sesuai.'
                });
            }
        } else {
            await userService.updateOneById(req.body.id, req.body);
        }
        return res.status(200).send({
            'status': 'success',
            'code': 200,
            'message': 'Data has been updated successfully.'
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            'status': 'error',
            'code': 500,
            'message': 'Internal server error.'
        });
    }
}

export async function deleteUserById(req: Request, res: Response) {
    try {
        const userService = new UserService();
        await userService.deleteOneById(req.body.id);
        return res.status(200).send({
            'status': 'success',
            'code': 200,
            'message': 'Data has been deleted successfully.'
        });
    } catch (error) {
        return res.status(500).send({
            'status': 'error',
            'code': 500,
            'message': 'Internal server error.'
        });
    }
}