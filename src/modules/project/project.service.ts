import { PrismaClient, Project } from "@prisma/client";
import ProjectDTO from "./dto/project.dto";
import { IParamsQuery } from "./interfaces/project.interface";
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

    async findAll({ search, page, perPage, ptId }: IParamsQuery) {
        const skipPage = Number(page) * 10 - 10;
        const totalCount = await Project.count();
        const totalPages = Math.ceil(totalCount / perPage);
        let result;
        if (ptId === 'all') {
            if (search !== 'undefined') {
                result = await Project.findMany({
                    where: {
                        nama: {
                            contains: search,
                            mode: 'insensitive'
                        },
                    },
                    skip: skipPage,
                    take: Number(perPage),
                    include: {
                        Pt: true
                    },
                    orderBy: {
                        createdAt: 'desc'
                    }
                });
            } else {
                result = await Project.findMany({
                    skip: skipPage,
                    take: Number(perPage),
                    include: {
                        Pt: true
                    },
                    orderBy: {
                        createdAt: 'desc'
                    }
                });
            }
        } else {
            if (search !== 'undefined') {
                result = await Project.findMany({
                    where: {
                        nama: {
                            contains: search,
                            mode: 'insensitive'
                        },
                        ptId
                    },
                    skip: skipPage,
                    take: Number(perPage),
                    include: {
                        Pt: true
                    },
                    orderBy: {
                        createdAt: 'desc'
                    }
                });
            } else {
                result = await Project.findMany({
                    where: {
                        ptId
                    },
                    skip: skipPage,
                    take: Number(perPage),
                    include: {
                        Pt: true
                    },
                    orderBy: {
                        createdAt: 'desc'
                    }
                });
            }
        }

        return {
            data: result,
            document: {
                currentPage: Number(page),
                pageSize: Number(perPage),
                totalCount,
                totalPages,
            }
        };
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