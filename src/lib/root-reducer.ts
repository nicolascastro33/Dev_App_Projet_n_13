import { reducer as userReducer } from './user/reducer'
import { reducer as authReducer } from './auth/reducer'
import { reducer as accountReducer } from './account/reducer'
import { combineReducers } from '@reduxjs/toolkit'

export const rootReducer = combineReducers({
  user: userReducer,
  auth: authReducer,
  account: accountReducer,
})
