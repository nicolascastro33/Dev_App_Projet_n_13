import { createAction } from '@reduxjs/toolkit'
import { selectAuthUserToken } from '../../auth/reducer'
import { createAppAsyncThunk } from '../../create-app-thunk'

export const getTransactionPendingDuringUpdate = createAction<{
  transactionId: string
}>('account/getTransactionPendingDuringUpdate')

export const updateTransactionInfo = createAppAsyncThunk(
  'account/updateTransactionInfo',
  async (
    params: {
      transactionId: string
      newInfo: string
      type:string
    },
    { extra: { transactionsGateway }, getState, dispatch }
  ) => {
    const token = selectAuthUserToken(getState())
    dispatch(
      getTransactionPendingDuringUpdate({ transactionId: params.transactionId })
    )
    const transactionInfo = await transactionsGateway.updateTransactionInfo({
      token,
      transactionId: params.transactionId,
      newInfo: params.newInfo,
      type:params.type
    })
    return transactionInfo
  }
)
