export default interface BarangSuratJalanPoDTO {
    id: string
    kode: string
    nama: string
    qty: number
    satuan: string
    createdBy: string
    updatedBy?: string
    suratJalanPoId: string
    stokBarangId: string
}