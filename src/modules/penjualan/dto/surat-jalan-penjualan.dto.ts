export interface SuratJalanPenjualanDTO {
    id?: string
    nomor: string
    namaSupir: string
    createdBy: string
    createdAt: Date
    updatedBy?: string
    updatedAt?: Date
    penjualanId: string
    tokoId: string
}

export interface BarangSuratJalanPenjualanDTO {
    id?: string
    kode: string
    nama: string
    qty: number
    satuan: string
    createdBy: string
    createdAt: Date
    updatedBy?: string
    updatedAt?: Date
    suratJalanPenjualanId: string
    stokBarangId: string
}