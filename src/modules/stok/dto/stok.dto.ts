export default interface StokDTO {
    id: string
    kode: string
    nama : string
    jumlah : number
    satuan: string
    hargaModal : number
    hargaJual : number
    createdBy : string
    updatedBy?:  string
    tokoId: string
}