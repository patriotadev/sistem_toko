import { IBarangPo } from "../../barang-po/interfaces/barang-po.interface"

export interface IPo {
    id: string
    noPo: string
    tanggal: Date
    tanggalJatuhTempo: Date
    createdBy: string
    updatedBy?: string
    ptId: string
    projectId: string
    status: string
    BarangPo: IBarangPo[],
    Pt: {
        id: string
        nama: string,
    }
    Project: {
        id: string
        nama: string
    }
}

export interface IParamsQuery {
    search: string | undefined
    page: number
    perPage: number,
    ptId: string,
    projectId: string
}