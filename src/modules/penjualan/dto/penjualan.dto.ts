export interface PenjualanDTO {
    id?: string
    namaPelanggan: string
    kontakPelanggan: string
    alamatPelanggan: string
    jumlahTotal: number
    createdBy: string
    updatedBy?: string
    tokoId: string
}

export interface BarangPenjualanDTO {
    id?: string
    kode: string
    nama: string
    qty: number
    harga: number
    satuan: string
    jumlahHarga: number,
    discount?: number
    createdBy: string
    penjualanId: string
    step: number
    isMaster: boolean
    stokBarangId: string
}

export interface PembayaranPenjualanDTO {
    id?: string
    penjualanId: string
    totalPembayaran: number
    jumlahBayar: number
    metode: string
    isApprove: boolean
    approvedAt: Date
    approvedBy: string
    createdBy: string
    createdAt: Date
    updatedBy?: string
    updatedAt?: Date
}