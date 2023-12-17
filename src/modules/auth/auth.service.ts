import { PrismaClient } from "@prisma/client";
import AuthDTO from "./dto/auth.dto";
import Jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
const User = new PrismaClient().user;
const RefreshToken = new PrismaClient().refreshToken;
const Role = new PrismaClient().role;

export default class AuthService {

    async generateAccessToken(payload: AuthDTO) {
        const token = Jwt.sign({
            id: payload.id,
            name: payload.name,
            email: payload.email
        },
            process.env.ACCESS_TOKEN as string,
            { expiresIn: "15m" }
        );
       
        return token;
    }

    async getUserRole(payload: AuthDTO) {
        const role = await Role.findUnique({
            where: {
                id: payload.roleId
            },
            include: {
                RoleMenu: true
            }
        });
        console.log("Role from service==>",role);
        return role;
    }

    generateRefreshToken(payload: AuthDTO) {
        const token = Jwt.sign({id: payload.id, name: payload.name, email: payload.email},
            process.env.REFRESH_TOKEN as string,
            { expiresIn: "2d" }
        );
        return token;
    }

    async getRefreshToken(refreshToken: string) {
        return await RefreshToken.findUnique({
            where: {
                refreshToken
            }
        });
    }

    async postRefreshTokenToList(refreshToken: string, payload: AuthDTO) {
        const getRefreshToken = await this.getRefreshToken(refreshToken);
        console.log(getRefreshToken);
        if (!getRefreshToken) {
            await RefreshToken.create({
                data: {
                    refreshToken,
                    expiredAt: new Date(),
                    userId: payload.id,
                }
            });
            return true;
        } else {
            return false;
        }
    }

    async generateNewAccessToken(refreshToken: string) {
        const getRefreshToken = await this.getRefreshToken(refreshToken);
        if (getRefreshToken) {
            const user = await User.findUnique({
                where: {
                    id: getRefreshToken.userId as string
                }
            });
            const isValidate = Jwt.verify(getRefreshToken.refreshToken as string, process.env.REFRESH_TOKEN as  string);
            if (isValidate) {
                const accessToken = this.generateAccessToken(user as AuthDTO);
                return accessToken;
            }
            return false;
        }
        return false;
    }

    async register(payload: AuthDTO) {
        const { name, email, password, roleId, tokoId } = payload;
        const result =  await User.create({
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

    async login(payload: AuthDTO) {
        const {email, password} = payload;
        const user = await User.findUnique({
            where: {
                email: email
            }
        });
        if (user) {
            const isValidRequest = await bcrypt.compare(password, user.password)
            if (isValidRequest) {
                return {
                    user
                };
            }
            return false;
        } 
        return false;
    }

    async logout(userId: string) {
        await RefreshToken.deleteMany({
            where: {
                userId
            }
        })
    }
}