import { IStok } from "../../stok/interfaces/stok.interface"
import { IPenjualan } from "./penjualan.interface"

export interface IParamsQuery {
    search: string | undefined
    page: number
    perPage: number
}

export interface IBarangSuratJalanPenjualan {
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
    suratJalanPenjualan: ISuratJalanPenjualan
    suratJalanPenjualanId: string
    StokBarang: IStok
    stokBarangId: string
}

export interface ISuratJalanPenjualan {
    id: string
    nomor: string
    namaSupir: string
    createdBy: string
    createdAt: Date
    updatedBy: string
    updatedAt: Date
    penjualan: IPenjualan[]
    penjualanId: string
    BarangSuratJalanPenjualan: IBarangSuratJalanPenjualan[]
}
