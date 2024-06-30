import { EntityState, createSlice } from '@reduxjs/toolkit'
import { RootState } from '../../create-store'
import { Account, accountAdapter } from '../model/account.entity'
import {
  getAuthBankAccountInfo,
  getAuthBankAccountInfoPending,
} from '../usecases/get-auth-account-info-with-id'
import {
  getAuthAllBankAccountInfo,
  getAuthAllBankAccountInfoPending,
} from '../usecases/get-auth-all-bank-account-info'

export type AccountSliceState = EntityState<Account> & {
  loadingAccountById: { [accountId: string]: boolean }
  loadingAllAccounts: boolean
}

export const accountSlice = createSlice({
  name: 'account',
  initialState: accountAdapter.getInitialState({
    loadingAccountById: {},
  }) as AccountSliceState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(getAuthBankAccountInfoPending, (state, action) => {
        setBankAccountInfoLoadingState(state, {
          accountId: action.payload.accountId,
          loading: true,
        })
      })
      .addCase(getAuthBankAccountInfo.fulfilled, (state, action) => {
        const account = action.payload
        accountAdapter.addOne(state, {
          id: account.id,
          name: account.name,
          currency: account.currency,
          balance: account.balance,
          amount: account.amount,
        })
        setBankAccountInfoLoadingState(state, {
          accountId: account.id,
          loading: false,
        })
      })
      .addCase(getAuthAllBankAccountInfoPending, (state) => {
        setAllBankAccountInfoLoadingState(state, {
          loading: true,
        })
      })
      .addCase(getAuthAllBankAccountInfo.fulfilled, (state, action) => {
        const accounts = action.payload
        accountAdapter.addMany(state, accounts)
        setAllBankAccountInfoLoadingState(state, {
          loading: false,
        })
      })
  },
})

const setBankAccountInfoLoadingState = (
  state: AccountSliceState,
  { accountId, loading }: { accountId: string; loading: boolean }
) => {
  state.loadingAccountById[accountId] = loading
}

const setAllBankAccountInfoLoadingState = (
  state: AccountSliceState,
  { loading }: { loading: boolean }
) => {
  state.loadingAllAccounts = loading
}

export const selectBankAccountInfo = (accountId: string, state: RootState) =>
  accountAdapter.getSelectors().selectById(state.account.info, accountId)

export const selectIsBankAccountInfoLoading = (
  accountId: string,
  state: RootState
) => state.account.info.loadingAccountById[accountId] ?? false

export const selectAllBankAccount = (state: RootState) =>
  accountAdapter.getSelectors().selectAll(state.account.info) ?? undefined

export const selectBankAccount = (accountId: string, state: RootState) =>
  accountAdapter
    .getSelectors()
    .selectAll(state.account.info)
    .find((t) => t.id === accountId)
