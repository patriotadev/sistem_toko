import ProjectDTO from "./dto/project.dto";
import { IParamsQuery } from "./interfaces/project.interface";
import prisma from "../../libs/prisma";
const Project = prisma.project;
const PembayaranPo = prisma.pembayaranPo;
const debug = require('debug')('hbpos-server:project-service');
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

    async getList(payload: { ptId: string | undefined }) {
        const { ptId } = payload;
        let result;
        if (ptId) {
            result = await Project.findMany({
                where: {
                    ptId
                },
                include: {
                    Po: true
                }
            });
        } else {
            result = await Project.findMany({
                include: {
                    Po: true
                }
            });
        }
        return result;
    }

    async findAll({ search, page, perPage, ptId }: IParamsQuery) {
        const sizePerPage = perPage ? Number(perPage) : 100;                                         
        const skipPage = sizePerPage * page - sizePerPage;
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
                        Pt: true,
                        Po: true
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
                        Pt: true,
                        Po: true
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
                        Pt: true,
                        Po: true
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
                        Pt: true,
                        Po: true
                    },
                    orderBy: {
                        createdAt: 'desc'
                    }
                });
            }
        }

        const tempResult: any = [];
        await Promise.all(result.map(async (item) => {
            const pembayaranPo = await PembayaranPo.findMany({
                where: {
                    poId: {
                        in: item.Po.map((po) => po.id)
                    }
                },
                include: {
                    Po: true
                }
            });
            tempResult.push({
                ...item,
                pembayaranPo
            })
        }))
        debug(tempResult, ">>> tempResult");
        return {
            data: tempResult,
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
                updatedAt: new Date(),
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