import { createEntityAdapter } from "@reduxjs/toolkit"

export type bankTransactions = {
    id: string
    name: string
    amount: number
    currency: string
    date:string
}

export const bankTransactionsAdapter = createEntityAdapter<bankTransactions>()