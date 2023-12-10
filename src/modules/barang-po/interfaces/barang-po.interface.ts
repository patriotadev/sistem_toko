import { IPo } from "../../po/interfaces/po.interface"

export interface IBarangPo {
    id: string
    nama: string
    qty: number
    satuan: string
    discount: number
    harga: number
    jumlahHarga: number
    isMaster: boolean
    createdBy: string
    createdAt: Date
    updatedBy: string
    updatedAt: Date
    po: IPo[]
    poId: string
}