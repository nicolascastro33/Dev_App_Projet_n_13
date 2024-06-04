import { combineReducers } from '@reduxjs/toolkit'
import { profileSlice } from './slices/profile.slice'
import { bankAccountSlice } from './slices/bank.accounts.slice'

export const reducer = combineReducers({
  [profileSlice.name]: profileSlice.reducer,
  [bankAccountSlice.name]: bankAccountSlice.reducer,
})
