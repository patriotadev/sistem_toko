import { PrismaClient, Project } from "@prisma/client";
import ProjectDTO from "./dto/project.dto";
const Project = new PrismaClient().project;


class ProjectService {
    async create(payload: ProjectDTO) {
        const { nama, createdBy, ptId } = payload;
        const result = await Project.create({
            data: {
                nama,
                createdBy,
                ptId
            }
        });
        return result;
    }

    async findAll() {
        const result = await Project.findMany({
            include: {
                Pt: true
            }
        });
        return result
    }

    async findOneById(id: string) {
        const result = await Project.findUnique({
            where : {
                id
            }
        });
        return result;
    }

    async updateOneById(id: string, payload: ProjectDTO) {
        const { nama, updatedBy, ptId } = payload;
        const result = await Project.update({
            where : {
                id
            },
            data : {
                nama,
                updatedBy,
                ptId
            }
        });
        return result;
    }

    async deleteOneById(id: string) {
        const result = await Project.delete({
            where: {
                id
            }
        });
        return result;
    }


}

export default ProjectService;