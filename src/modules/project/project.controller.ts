import { Request, Response, NextFunction } from 'express';
import ProjectService from './project.service';
import { IParamsQuery } from './interfaces/project.interface';

export async function createProject(req: Request, res: Response) {
    try {
        const projectService = new ProjectService();
        await projectService.create(req.body);
        return res.status(201).send({
            'status': 'success',
            'code': 201,
            'message': 'Data has been added successfully'
        });
    } catch (error) {
        return res.status(500).send({
            'status': 'error',
            'code': 500,
            'message': 'Internal server error.'
        });
    }
}

export async function getListProject(req: Request, res: Response) {
    try {
        const projectService = new ProjectService();
        const result = await projectService.getList(req.query as unknown as { ptId: string });
        return res.status(200).send({
            'status': 'success',
            'code': 200,
            'data': result,
        });
    } catch (error) {
        return res.status(500).send({
            'status': 'error',
            'code': 500,
            'message': 'Internal server error.'
        });
    }
}

export async function getAllProject(req: Request, res: Response) {
    try {
        const projectService = new ProjectService();
        const result = await projectService.findAll(req.query as unknown as IParamsQuery);
        return res.status(200).send({
            'status': 'success',
            'code': 200,
            'data': result.data,
            'document': {...result.document}
        });
    } catch (error) {
        return res.status(500).send({
            'status': 'error',
            'code': 500,
            'message': 'Internal server error.'
        });
    }
}

export async function getProjectById(req: Request, res: Response) {
    try {
        const projectService = new ProjectService();
        const result = await projectService.findOneById(req.params.id);
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

export async function updateProjectById(req: Request, res: Response) {
    try {
        const projectService = new ProjectService();
        await projectService.updateOneById(req.body.id, req.body);
        return res.status(200).send({
            'status': 'success',
            'code': 200,
            'message': 'Data has been updated successfully.'
        });
    } catch (error) {
        return res.status(500).send({
            'status': 'error',
            'code': 500,
            'message': 'Internal server error.'
        });
    }
}

export async function deleteProjectById(req: Request, res: Response) {
    try {
        const projectService = new ProjectService();
        await projectService.deleteOneById(req.body.id);
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
