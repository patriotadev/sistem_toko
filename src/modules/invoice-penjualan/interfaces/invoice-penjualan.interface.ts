export interface IParamsQuery {
    search: string | undefined
    page: number
    perPage: number
}

export interface IInvoicePenjualanList {
    id: string
    invoicePenjualanId: string
    penjualanId: string
}

export interface IInvoicePenjualan {
    id: string
    nomor: string
    createdBy: string
    createdAt: Date
    updatedBy: string
    updatedAt: Date
    InvoicePenjualanList: IInvoicePenjualanList[]
}