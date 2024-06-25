import { combineReducers } from '@reduxjs/toolkit'
import { accountSlice } from './slices/bank-account-info'

export const reducer = combineReducers({
  info: accountSlice.reducer,
})
