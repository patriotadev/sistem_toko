import { IToko } from "../../toko/interfaces/toko.interface"

export interface IParamsQuery {
    search: string | undefined
    page: number
    perPage: number,
    tokoId: string
    tab: string
}

export interface IStok {
    id: string
    kode: string
    nama: string
    jumlah: number
    satuan: string
    hargaModal: number
    hargaJual: number
    createdBy: string
    tokoId: string
    toko: IToko
}
