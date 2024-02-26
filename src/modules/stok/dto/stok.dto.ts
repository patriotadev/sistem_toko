export default interface StokDTO {
    id: string
    kode: string
    nama : string
    jumlah : number
    satuan: string
    isPo?: boolean
    jumlahPo: number
    hargaModal : number
    hargaJual : number
    createdBy : string
    updatedBy?:  string
    tempStokId?: string
    tokoId: string
}