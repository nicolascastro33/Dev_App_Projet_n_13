import { selectAuthUserId, selectAuthUserToken } from '../../auth/reducer'
import { createAppAsyncThunk } from '../../create-app-thunk'
import { createAction } from '@reduxjs/toolkit'
import { selectIsUserProfileLoading } from '../slices/profile.slice'

export const getAuthUserProfilePending = createAction<{ userId: string }>(
  'user/getAuthUserProfilePending'
)

export const getAuthInfoProfileUser = createAppAsyncThunk(
  'user/getAuthInfoProfileUser',
  async (_, { extra: { userGateway }, dispatch, getState }) => {
    const token = selectAuthUserToken(getState())
    const userId = selectAuthUserId(getState())
    dispatch(getAuthUserProfilePending({ userId }))
    const { userInfo } = await userGateway.getUserInfo({ token })
    return userInfo
  },
  {
    condition(_, { getState }) {
      const userId = selectAuthUserId(getState())
      const isUserProfileLoading = selectIsUserProfileLoading(
        userId,
        getState()
      )
      return !isUserProfileLoading
    },
  }
)
