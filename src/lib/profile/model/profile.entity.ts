import { createEntityAdapter } from '@reduxjs/toolkit'
export type Profile = {
  id: string
  firstName: string
  lastName: string
  accounts: string[]
}

export const profileAdapter = createEntityAdapter<Profile>()
