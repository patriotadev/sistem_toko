import { IRole } from "../../role/interfaces/role.interface"
import { IToko } from "../../toko/interfaces/toko.interface"

export interface IParamsQuery {
    search: string | undefined
    page: number
    perPage: number
}

export interface IPengguna {
    id: string
    name: string
    email: string
    password: string
    roleId: string
    tokoId: string
    role: IRole,
    toko: IToko
  }