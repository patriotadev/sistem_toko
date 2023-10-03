export default interface BarangPoDTO {
    nama: string
    qty: number
    satuan: string
    discount?: number
    harga: number
    jumlahHarga: number
    createdBy: string
    updatedBy?: string
    poId: string
}