export default interface BarangPoDTO {
    kode: string
    nama: string
    qty: number
    satuan: string
    discount?: number
    harga: number
    jumlahHarga: number
    createdBy: string
    updatedBy?: string
    step: number
    stokBarangId: string
    poId: string
}