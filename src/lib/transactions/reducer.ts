import { combineReducers } from '@reduxjs/toolkit'
import { transactionSlice } from './slices/bank-transactions-info'

export const reducer = combineReducers({
  info: transactionSlice.reducer,
})
