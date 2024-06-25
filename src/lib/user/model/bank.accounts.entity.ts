import { createEntityAdapter } from '@reduxjs/toolkit'

export type bankAccounts = {
  id: string
  name: string
  amount: string
  currency: string
  balance: string
}
export const bankAccountAdapter = createEntityAdapter<bankAccounts>()
