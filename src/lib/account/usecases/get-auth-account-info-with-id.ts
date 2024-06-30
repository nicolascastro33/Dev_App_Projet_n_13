import { selectAuthUserToken } from '../../auth/reducer'
import { createAppAsyncThunk } from '../../create-app-thunk'
import { createAction } from '@reduxjs/toolkit'

export const getAuthBankAccountInfoPending = createAction<{
  accountId: string
}>('account/getAuthBankAccountInfoPending')

export const getAuthBankAccountInfo = createAppAsyncThunk(
  'account/getAuthBankAccountInfo',
  async (
    params: {
      accountId: string
    },
    { extra: { accountGateway }, dispatch, getState }
  ) => {
    const token = selectAuthUserToken(getState())
    dispatch(getAuthBankAccountInfoPending({ accountId: params.accountId }))
    const { accountInfo } = await accountGateway.getAccountInfo({
      accountId: params.accountId,
      token,
    })
    return accountInfo
  }
)
