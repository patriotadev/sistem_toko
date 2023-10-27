import { PrismaClient } from "@prisma/client";
import PoDTO from "./dto/po.dto";
import { IParamsQuery } from "./interfaces/po.interface";
const Po = new PrismaClient().po;

class PoService {
    async create(payload: PoDTO) {
        const { noPo, tanggal, createdBy, ptId, projectId } = payload;
        const result = await Po.create({
            data : {
                noPo,
                tanggal: new Date(tanggal),
                createdBy,
                ptId,
                projectId
            }
        });
        return result;
    }

    async findAll({search, page, perPage, ptId, projectId}: IParamsQuery) {
        const skipPage = Number(page) * 10 - 10;
        const totalCount = await Po.count();
        const totalPages = Math.ceil(totalCount / perPage);
        let result;
        if (ptId === 'all') {
            if (search !== 'undefined') {
                result = await Po.findMany({
                    where: {
                        noPo: {
                            contains: search,
                            mode: 'insensitive'
                        },
                    },
                    skip: skipPage,
                    take: Number(perPage),
                    include: {
                        Pt: true,
                        Project: true
                    },
                    orderBy: {
                        createdAt: 'desc'
                    }
                });
            } else {
                result = await Po.findMany({
                    skip: skipPage,
                    take: Number(perPage),
                    include: {
                        Pt: true,
                        Project: true
                    },
                    orderBy: {
                        createdAt: 'desc'
                    }
                });
            }
        } else {

            if (projectId === 'all') {
                if (search !== 'undefined') {
                    result = await Po.findMany({
                        where: {
                            noPo: {
                                contains: search,
                                mode: 'insensitive'
                            },
                            ptId
                        },
                        skip: skipPage,
                        take: Number(perPage),
                        include: {
                            Pt: true,
                            Project: true
                        },
                        orderBy: {
                            createdAt: 'desc'
                        }
                    });
                } else {
                    result = await Po.findMany({
                        where: {
                            ptId
                        },
                        skip: skipPage,
                        take: Number(perPage),
                        include: {
                            Pt: true,
                            Project: true
                        },
                        orderBy: {
                            createdAt: 'desc'
                        }
                    });
                }
            } else {
                if (search !== 'undefined') {
                    result = await Po.findMany({
                        where: {
                            noPo: {
                                contains: search,
                                mode: 'insensitive'
                            },
                            ptId,
                            projectId
                        },
                        skip: skipPage,
                        take: Number(perPage),
                        include: {
                            Pt: true,
                            Project: true
                        },
                        orderBy: {
                            createdAt: 'desc'
                        }
                    });
                } else {
                    result = await Po.findMany({
                        where: {
                            ptId,
                            projectId
                        },
                        skip: skipPage,
                        take: Number(perPage),
                        include: {
                            Pt: true,
                            Project: true
                        },
                        orderBy: {
                            createdAt: 'desc'
                        }
                    });
                }
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
        const result = await Po.findUnique({
            where: {
                id
            }
        });
        return result;
    }

    async updateOneById(id: string, payload: PoDTO) {
        const { noPo, tanggal, updatedBy, ptId, projectId } = payload;
        const result = await Po.update({
            where: {
                id
            },
            data : {
                noPo,
                tanggal,
                updatedBy,
                ptId,
                projectId
            }
        });
        return result;
    }

    async deleteOneById(id: string) {
        const result = await Po.delete({
            where: {
                id
            }
        });
        return result;
    }
}

export default PoService;