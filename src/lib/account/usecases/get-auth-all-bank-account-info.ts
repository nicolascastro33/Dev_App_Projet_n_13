import { selectAuthUserToken } from '../../auth/reducer'
import { createAppAsyncThunk } from '../../create-app-thunk'
import { createAction } from '@reduxjs/toolkit'

export const getAuthAllBankAccountInfoPending = createAction<{}>(
  'account/getAuthAllBankAccountInfoPending'
)

export const getAuthAllBankAccountInfo = createAppAsyncThunk(
  'account/getAuthAllBankAccountInfo',
  async (_, { extra: { accountGateway }, dispatch, getState }) => {
    dispatch(getAuthAllBankAccountInfoPending({}))
    const token = selectAuthUserToken(getState())
    const { allAccounts } = await accountGateway.getAllAccountsInfo({
      token,
    })
    return allAccounts
  }
)
