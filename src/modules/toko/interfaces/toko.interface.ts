import { IPengguna } from "../../user/interfaces/user.interface"

export interface IParamsQuery {
    search: string | undefined
    page: number
    perPage: number
}

export interface IToko {
    id: string
    description: string
    contact: string
    address: string
    city: string
    User: IPengguna[]
}