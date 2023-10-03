import { PrismaClient } from "@prisma/client";
import PoDTO from "./dto/po.dto";
const Po = new PrismaClient().po;

class PoService {
    async create(payload: PoDTO) {
        const { tanggal, createdBy, ptId, projectId } = payload;
        const result = await Po.create({
            data : {
                tanggal,
                createdBy,
                ptId,
                projectId
            }
        });
        return result;
    }

    async findAll() {
        const result = await Po.findMany({
            include: {
                Pt: true,
                Project: true
            }
        });
        return result;
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
        const { tanggal, updatedBy, ptId, projectId } = payload;
        const result = await Po.update({
            where: {
                id
            },
            data : {
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