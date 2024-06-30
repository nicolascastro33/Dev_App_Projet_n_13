import { combineReducers } from '@reduxjs/toolkit'
import { profileSlice } from './slices/profile.slice'

export const reducer = combineReducers({
  info: profileSlice.reducer,
})
