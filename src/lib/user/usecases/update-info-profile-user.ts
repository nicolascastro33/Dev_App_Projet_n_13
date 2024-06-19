import { createAction } from '@reduxjs/toolkit'
import { selectAuthUserId, selectAuthUserToken } from '../../auth/reducer'
import { createAppAsyncThunk } from '../../create-app-thunk'

export const getAuthUserProfilePendingDuringUpdate = createAction<{ userId: string }>(
  'user/getAuthUserProfilePendingDuringUpdate'
)

export const updateInfoProfile = createAppAsyncThunk(
  'user/updateInfoProfile',
  async (
    params: {
      firstName: string
      lastName: string
    },
    { extra: { userGateway }, getState, dispatch }
  ) => {
    const token = selectAuthUserToken(getState())
    const userId = selectAuthUserId(getState())
    dispatch(getAuthUserProfilePendingDuringUpdate({ userId }))
    const authUser = await userGateway.updateInfoProfile({
      token,
      userId,
      firstName: params.firstName,
      lastName: params.lastName,
    })
    return authUser
  }
)
