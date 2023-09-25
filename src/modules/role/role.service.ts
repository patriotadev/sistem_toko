import { PrismaClient } from "@prisma/client";
import RoleDTO from "./dto/role.dto";
const Role = new PrismaClient().role;

class RoleService {
    async create(payload: RoleDTO) {
        const { description } = payload;
        const result = await Role.create({
            data : {
                description
            }
        });
        return result;
    }

    async findAll() {
        const result = await Role.findMany();
        return result;
    }

    async findOneById(id: string) {
        const result = await Role.findUnique({
            where: {
                id
            }
        });
        return result;
    }

    async updateOneById(id: string, payload: RoleDTO) {
        const { description } = payload;
        const result = await Role.update({
            where: {
                id
            },
            data: {
                description
            }
        });

        return result;
    }

    async deleteOneById(id: string) {
        const result = await Role.delete({
            where: {
                id
            }
        });
        return result;
    }
}

export default RoleService;