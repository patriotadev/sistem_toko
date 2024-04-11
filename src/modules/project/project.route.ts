import express from 'express';
import { createProject, deleteProjectById, getAllProject, getListProject, getProjectById, updateProjectById } from './project.controller';
const router = express.Router();

router.post('/', createProject);
router.get('/', getAllProject);
router.get('/list', getListProject);
router.get('/:id', getProjectById);
router.put('/', updateProjectById);
router.delete('/', deleteProjectById);

export default router;