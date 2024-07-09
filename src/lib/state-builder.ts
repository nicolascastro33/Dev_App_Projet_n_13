import { Profile } from './profile/model/profile.entity'
import { RootState } from './create-store'
import {
  ActionCreatorWithPayload,
  createAction,
  createReducer,
} from '@reduxjs/toolkit'
import { rootReducer } from './root-reducer'
import { Account, accountAdapter } from './account/model/account.entity'
import {
  Transaction,
  transactionsAdapter,
} from './transactions/model/transactions.entity'

const initialState = rootReducer(undefined, createAction(''))

const withUser = createAction<Profile>('withUser')
const withLoadingUserOf = createAction<{}>('withLoadingUserOf')
const withNotLoadingUserOf = createAction<{}>('withNotLoadingUserOf')
const withAccounts = createAction<Account[]>('withAccounts')
const withOneAccount = createAction<Account>('withOneAccount')
const withLoadingAccountOf = createAction<{accountId:string}>('withLoadingAccountOf')
const withNotLoadingAccountOf = createAction<{accountId:string}>('withNotLoadingAccountOf')
const withTransactions = createAction<Transaction[]>('withTransactions')
const withNotLoadingTransactionsOf = createAction<{accountId:string}>('withNotLoadingTransactionsOf')
const withAuthUser = createAction<{ authUser: string }>('withAuthUser')
const reducer = createReducer(initialState, (builder) => {
  builder
    .addCase(withAuthUser, (state, action) => {
      state.auth.authUserToken = action.payload.authUser
    })
    .addCase(withUser, (state, action) => {
      state.profile.info.firstName = action.payload.firstName
      state.profile.info.lastName = action.payload.lastName
    })
    .addCase(withLoadingUserOf, (state) => {
      state.profile.info.loadingProfileByUser = true
    })
    .addCase(withNotLoadingUserOf, (state) => {
      state.profile.info.loadingProfileByUser = false
    })
    .addCase(withAccounts, (state, action) => {
      accountAdapter.addMany(state.account.info, action.payload)
    })
    .addCase(withOneAccount, (state, action) => {
      accountAdapter.addOne(state.account.info, action.payload)
    })
    .addCase(withLoadingAccountOf, (state, action) => {
      state.account.info.loadingAccountById[action.payload.accountId] = true
    })
    .addCase(withNotLoadingAccountOf, (state, action) => {
      state.account.info.loadingAccountById[action.payload.accountId] = false
    })
    .addCase(withTransactions, (state, action) => {
      transactionsAdapter.addMany(state.transactions.info, action.payload)
    })
    .addCase(withNotLoadingTransactionsOf, (state, action) => {
      state.transactions.info.loadingAllTransactionsByAccountId[action.payload.accountId] = false
    })
})

export const stateBuilder = (baseState = initialState) => {
  const reduce =
    <P>(actionCreator: ActionCreatorWithPayload<P>) =>
    (payload: P) =>
      stateBuilder(reducer(baseState, actionCreator(payload)))

  return {
    withAuthUser: reduce(withAuthUser),
    withUser: reduce(withUser),
    withLoadingUserOf: reduce(withLoadingUserOf),
    withNotLoadingUserOf: reduce(withNotLoadingUserOf),
    withAccounts: reduce(withAccounts),
    withOneAccount: reduce(withOneAccount),
    withLoadingAccountOf: reduce(withLoadingAccountOf),
    withNotLoadingAccountOf: reduce(withNotLoadingAccountOf),
    withTransactions: reduce(withTransactions),
    withNotLoadingTransactionsOf: reduce(withNotLoadingTransactionsOf),
    build(): RootState {
      return baseState
    },
  }
}
