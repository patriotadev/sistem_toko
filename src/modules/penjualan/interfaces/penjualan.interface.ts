import { IToko } from "../../toko/interfaces/toko.interface"
import { ISuratJalanPenjualan } from "./surat-jalan-penjualan.interface"

export interface IParamsQuery {
    search: string | undefined
    page: number
    perPage: number
    tokoId: string
    dateStart: Date
    dateEnd: Date
}

export interface IBarangPenjualan {
    id?: string
    kode: string
    nama: string
    qty: number
    satuan: string
    harga: string
    isMaster: boolean
    step: number
    discount?: number
    createdBy: string
    jumlahHarga: number
    stokBarangId: string
}

export interface IPembayaranPenjualan {
    id?: string
    penjualanId: string
    totalPembayaran: number
    jumlahBayar: number
    metode: string
    isApprove: boolean
    approvedAt?: Date
    approvedBy?: string
    createdBy: string
    createdAt: Date
    updatedBy?: string
    updatedAt?: Date
}

export interface IPenjualan {
    id: string
    namaPelanggan: string
    kontakPelanggan: string
    alamatPelanggan: string
    jumlahTotal: number
    createdBy: string
    createdAt: Date
    updatedBy: string
    updatedAt: Date
    toko: IToko[]
    tokoId: string
    BarangPenjualan: IBarangPenjualan[]
    PembayaranPenjualan: IPembayaranPenjualan[]
  }