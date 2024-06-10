import { createEntityAdapter } from '@reduxjs/toolkit'

export type User = {
  user: string
  id: string
  profileInfo: {
    firstName: string
    lastName: string
  }
  accounts: string[]
}

export const userAdapter = createEntityAdapter<User>()
