import { createAppAsyncThunk } from '../../create-app-thunk'
import { createAction } from '@reduxjs/toolkit'

export const getAuthUserProfilePending = createAction<{ authUser: string }>(
  'user/getAuthUserProfilePending'
)

export const getInfoProfileUser = createAppAsyncThunk(
  'user/getInfoProfileUser',
  async (_, { extra: { authGateway, userGateway }, dispatch }) => {
    const authUser = authGateway.getAuthUser()
    dispatch(getAuthUserProfilePending({ authUser }))
    const { userInfo } = await userGateway.getUserInfo({ userId: authUser })
    return userInfo
  }
)
