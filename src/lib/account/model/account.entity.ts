import { createEntityAdapter } from '@reduxjs/toolkit'
export type Account = {
    id: string
    name: string
    amount: string
    currency: string
    balance: string
}

export const accountAdapter = createEntityAdapter<Account>()
