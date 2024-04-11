import { IPo } from "../../po/interfaces/po.interface"

export interface PoListPayload  {
    po: IPo[]
} 

export interface InvoicePoDTO {
    createdBy: string
    updatedBy?: string
    tokoId: string
    poId: string
    suratJalanPoId: string
    // poListPayload: PoListPayload[]
}