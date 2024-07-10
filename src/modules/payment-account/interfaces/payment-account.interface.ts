export interface IParamsQuery {
    search: string | undefined
    page: number
    perPage: number,
}

export interface IPaymentAccount {
    id: string
    bankName: string
    accountNumber: string
    accountName: string
}