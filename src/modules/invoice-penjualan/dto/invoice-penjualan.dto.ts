import { IPenjualan } from "../../penjualan/interfaces/penjualan.interface"

export interface PenjualanListPayload  {
    penjualan: IPenjualan[]
} 

export interface InvoicePenjualanDTO {
    createdBy: string
    updatedBy?: string
    status?: string
    tokoId: string
    penjualanListPayload: PenjualanListPayload[]
}