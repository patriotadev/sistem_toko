export default interface PoDTO {
    noPo: string
    tanggal: Date
    jatuhTempo: number
    createdBy: string
    updatedBy?: string
    ptId: string
    status: string
    projectId: string
    invoicePoId: string
}

export interface PembayaranPoDTO {
    id?: string
    poId: string
    totalPembayaran: number
    jumlahBayar: number
    metode: string
    isApprove: boolean
    approvedAt: Date
    approvedBy: string
    createdBy: string
    createdAt: Date
    updatedBy?: string
    updatedAt?: Date
}