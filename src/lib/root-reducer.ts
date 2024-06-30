import { reducer as profileReducer } from './profile/reducer'
import { reducer as authReducer } from './auth/reducer'
import { reducer as accountReducer } from './account/reducer'
import {reducer as transactionsReducer} from './transactions/reducer'
import { combineReducers } from '@reduxjs/toolkit'

export const rootReducer = combineReducers({
  auth: authReducer,
  profile: profileReducer,
  account: accountReducer,
  transactions: transactionsReducer
})
