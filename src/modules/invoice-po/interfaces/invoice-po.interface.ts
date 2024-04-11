export interface IParamsQuery {
    search: string | undefined
    page: number
    perPage: number
    ptId: string
    projectId: string
    suratJalanPoId: string
}

export interface IInvoicePoList {
    id: string
    invoicePoId: string
    poId: string
}

export interface IInvoicePo {
    id: string
    jatuhTempo: number
    nomor: string
    createdBy: string
    createdAt: Date
    updatedBy: string
    updatedAt: Date
    InvoicePoList: IInvoicePoList[]
}