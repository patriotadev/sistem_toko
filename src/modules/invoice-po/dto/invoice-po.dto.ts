import { IPo } from "../../po/interfaces/po.interface"

export interface PoListPayload  {
    po: IPo[]
} 

export interface InvoicePoDTO {
    jatuhTempo: number
    createdBy: string
    status?: string
    updatedBy?: string
    tokoId: string
    poListPayload: PoListPayload[]
}