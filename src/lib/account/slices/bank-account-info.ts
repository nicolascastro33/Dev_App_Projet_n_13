import { EntityState, createSlice } from '@reduxjs/toolkit'
import { RootState } from '../../create-store'
import { Account, accountAdapter } from '../model/account.entity'
import {
  getAuthBankAccountInfo,
  getAuthBankAccountInfoPending,
} from '../usecases/get-auth-account-info-with-id'

export type AccountSliceState = EntityState<Account> & {
  loadingAccountById: { [accountId: string]: boolean }
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
          transactions: account.transactions,
        })
        setBankAccountInfoLoadingState(state, {
          accountId: account.id,
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

export const selectBankAccountInfo = (accountId: string, state: RootState) =>
  accountAdapter.getSelectors().selectById(state.account.info, accountId)

export const selectIsBankAccountInfoLoading = (
  accountId: string,
  state: RootState
) => state.account.info.loadingAccountById[accountId] ?? false

export const selectBankAccount = (accountId: string, state: RootState) =>
  accountAdapter
    .getSelectors()
    .selectAll(state.account.info)
    .find((t) => t.id === accountId)
