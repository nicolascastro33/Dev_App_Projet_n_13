import { createEntityAdapter } from '@reduxjs/toolkit'
export type Profile = {
  id: string
  firstName: string
  lastName: string
}

export const profileAdapter = createEntityAdapter<Profile>()
