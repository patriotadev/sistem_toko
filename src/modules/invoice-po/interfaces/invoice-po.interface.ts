export interface IParamsQuery {
    search: string | undefined
    page: number
    perPage: number
}

export interface IInvoicePoList {
    id: string
    invoicePoId: string
    poId: string
}

export interface IInvoicePo {
    id: string
    nomor: string
    createdBy: string
    createdAt: Date
    updatedBy: string
    updatedAt: Date
    InvoicePoList: IInvoicePoList[]
}