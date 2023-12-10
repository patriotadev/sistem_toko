import { IPo } from "../../po/interfaces/po.interface"

export interface PoListPayload  {
    po: IPo[]
} 

export interface InvoicePoDTO {
    nomor: string
    createdBy: string
    updatedBy?: string
    poListPayload: PoListPayload[]
}