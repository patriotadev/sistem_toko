import { IPo } from "../../po/interfaces/po.interface"
import { IStok } from "../../stok/interfaces/stok.interface"

export interface IParamsQuery {
    search: string | undefined
    page: number
    perPage: number,
}

export interface IBarangSuratJalanPo {
    id: string
    nama: string
    qty: number
    satuan: string
    createdBy: string
    createdAt: Date
    updatedBy: string
    updatedAt: Date
    isMaster: boolean
    step: number
    suratJalanPo: ISuratJalanPo
    suratJalanPoId: string
    StokBarang: IStok
    stokBarangId: string
}

export interface ISuratJalanPo {
    id: string
    nomor: string
    namaSupir: string
    createdBy: string
    createdAt: Date
    updatedBy: string
    updatedAt: Date
    po: IPo[]
    penjualanId: string
    BarangSuratJalanPo: IBarangSuratJalanPo[]
}
