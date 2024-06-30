import { selectAuthUserToken } from '../../auth/reducer'
import { createAppAsyncThunk } from '../../create-app-thunk'
import { createAction } from '@reduxjs/toolkit'

export const getAuthAllTransactionsInfoPending = createAction<{
  accountId: string
}>('transactions/getAuthAllTransactionsInfoPending')

export const getAuthAllTransactionsInfo = createAppAsyncThunk(
  'transactions/getAuthAllTransactionsInfo',
  async (
    params: {
      accountId: string
    },
    { extra: { transactionsGateway }, dispatch, getState }
  ) => {
    const token = selectAuthUserToken(getState())
    dispatch(getAuthAllTransactionsInfoPending({ accountId: params.accountId }))
    const { transactionsInfo } = await transactionsGateway.getTransactionsInfo({
      accountId: params.accountId,
      token,
    })
    return transactionsInfo
  }
)
