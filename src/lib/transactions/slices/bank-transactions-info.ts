import { EntityState, createSlice } from '@reduxjs/toolkit'
import { RootState } from '../../create-store'
import { Transaction, transactionsAdapter } from '../model/transactions.entity'
import {
  getAuthAllTransactionsInfo,
  getAuthAllTransactionsInfoPending,
} from '../usecases/get-auth-transactions-info-with-id'
import { updateTransactionInfo } from '../usecases/update-auth-transactions-infos-with-id'
import { authenticatedUserLogOut } from '../../common/usecases/authenticatedUserLogOut'

export type TransactionSliceState = EntityState<Transaction> & {
  loadingAllTransactionsByAccountId: { [accountId: string]: boolean }
}

export const transactionSlice = createSlice({
  name: 'transactions',
  initialState: transactionsAdapter.getInitialState({
    loadingAllTransactionsByAccountId: {},
  }) as TransactionSliceState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(getAuthAllTransactionsInfoPending, (state, action) => {
        setTransactionsInfoLoadingState(state, {
          accountId: action.payload.accountId,
          loading: true,
        })
      })
      .addCase(getAuthAllTransactionsInfo.fulfilled, (state, action) => {
        const transactions = action.payload
        transactions.forEach((transaction) => {
          transactionsAdapter.addOne(state, {
            id: transaction.id,
            accountId: transaction.accountId,
            date: transaction.date,
            description: transaction.description,
            amount: transaction.amount,
            balance: transaction.balance,
            category: transaction.category,
            note: transaction.note,
          })
          setTransactionsInfoLoadingState(state, {
            accountId: action.meta.arg.accountId,
            loading: false,
          })
        })
      })
      .addCase(updateTransactionInfo.fulfilled, (state, action) => {
        const transaction = action.payload
        if (transaction.note) {
          transactionsAdapter.updateOne(state, {
            id: transaction.id,
            changes: {
              note: transaction.note,
            },
          })
        }
        if (transaction.category) {
          transactionsAdapter.updateOne(state, {
            id: transaction.id,
            changes: {
              category: transaction.category,
            },
          })
        }
      })
      .addCase(authenticatedUserLogOut.fulfilled, (state) => {
        transactionsAdapter.removeAll(state)
      })
  },
})

const setTransactionsInfoLoadingState = (
  state: TransactionSliceState,
  { accountId, loading }: { accountId: string; loading: boolean }
) => {
  state.loadingAllTransactionsByAccountId[accountId] = loading
}

export const selectTransactionsInfo = (
  transactionId: string,
  state: RootState
) =>
  transactionsAdapter
    .getSelectors()
    .selectById(state.transactions.info, transactionId)

export const selectAreAllTransactionsInfoLoading = (
  accountId: string,
  state: RootState
) =>
  state.transactions.info.loadingAllTransactionsByAccountId[accountId] ?? false

export const selectAllTransactionsFromOneAccount = (
  accountId: string,
  state: RootState
) =>
  transactionsAdapter
    .getSelectors()
    .selectAll(state.transactions.info)
    .filter((transaction) => transaction.accountId === accountId)
