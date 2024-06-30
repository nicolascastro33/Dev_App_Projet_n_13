import { createEntityAdapter } from '@reduxjs/toolkit'
export type Transaction = {
  id: string
  accountId: string
  date: string
  description: string
  amount: string
  balance: string
  category: string
  note: string | undefined
}

export const transactionsAdapter = createEntityAdapter<Transaction>()
