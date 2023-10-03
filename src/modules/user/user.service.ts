import { PrismaClient } from "@prisma/client";
import UserDTO from "./dto/user.dto";
const User = new PrismaClient().user;

class UserService {
    async create(payload: UserDTO) {
        const { name, email, password, roleId, tokoId } = payload;
        const result = await User.create({
            data: {
                name,
                email,
                password,
                roleId,
                tokoId
            }
        });
        return result;
    }

    async findAll() {
        const result = await User.findMany({
            include: {
                role: true,
                toko: true
            }
        });
        return result;
    }

    async findOneById(id: string) {
        const result = await User.findUnique({
            where: {
                id
            },
            include: {
                role: true,
                toko: true
            }
        });
        return result;
    }

    async updateOneById(id: string, payload: UserDTO) {
        const { name, email, password, roleId, tokoId } = payload;
        const result = await User.update({
            where: {
                id
            },
            data: {
                name,
                email,
                password,
                roleId,
                tokoId
            }
        });
        return result;
    }

    async deleteOneById(id: string) {
        const result = await User.delete({
            where: {
                id
            }
        });
        return result;
    }
}

export default UserService;