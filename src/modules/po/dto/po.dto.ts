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