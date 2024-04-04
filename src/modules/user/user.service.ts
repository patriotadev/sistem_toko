import { PrismaClient } from "@prisma/client";
import UserDTO from "./dto/user.dto";
import { IParamsQuery } from "./interfaces/user.interface";
import bcrypt from 'bcrypt';
const User = new PrismaClient().user;

class UserService {
    async create(payload: UserDTO) {
        const { name, email, password, roleId, tokoId } = payload;
        const result = await User.create({
            data: {
                name,
                email,
                password: await bcrypt.hash(password, 10),
                roleId,
                tokoId
            }
        });
        return result;
    }

    async findAll({search, page, perPage}: IParamsQuery) {
        const sizePerPage = perPage ? Number(perPage) : 100;                                         
        const skipPage = sizePerPage * page - sizePerPage;
        const totalCount = await User.count();
        const totalPages = Math.ceil(totalCount / perPage);
        let result;
        if (search !== 'undefined') {
            result = await User.findMany({
                where: {
                    OR: [
                        {
                            name: {
                                contains: search
                            }
                        },
                        {
                            email: {
                                contains: search
                            }
                        },
                    ]
                },
                skip: skipPage,
                take: Number(perPage),
                orderBy: {
                    id: 'desc'
                },
                include: {
                    role: true,
                    toko: true
                }
            });
        } else {
            result = await User.findMany({
                skip: skipPage,
                take: Number(perPage),
                orderBy: {
                    id: 'desc'
                },
                include: {
                    role: true,
                    toko: true
                }
            });
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

    async updatePasswordById(id: string, payload: {
        id: string,
        newPassword: string,
        oldPassword: string
    }) {
        const { newPassword, oldPassword } = payload;
        const user = await User.findUnique({
            where: {
                id
            }
        });
        if (user) {
            const checkOldPass = await bcrypt.compare(oldPassword, user.password);
            if (checkOldPass) {
                const result = await User.update({
                    where: {
                        id
                    },
                    data: {
                        password: await bcrypt.hash(newPassword, 10),
                    }
                });
                return result;
            }
            return false;
        }
       
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