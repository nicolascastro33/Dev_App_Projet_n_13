import { createEntityAdapter } from '@reduxjs/toolkit'
export type User = {
  id: string
  firstName: string
  lastName: string
  accounts: string[]
}

export const userAdapter = createEntityAdapter<User>()
