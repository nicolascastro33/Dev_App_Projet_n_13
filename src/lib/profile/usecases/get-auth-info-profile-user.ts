import { selectAuthUserToken } from '../../auth/reducer'
import { createAppAsyncThunk } from '../../create-app-thunk'
import { createAction } from '@reduxjs/toolkit'

export const getAuthUserProfilePending = createAction(
  'user/getAuthUserProfilePending'
)

export const getAuthInfoProfileUser = createAppAsyncThunk(
  'user/getAuthInfoProfileUser',
  async (_, { extra: { profileGateway }, dispatch, getState }) => {
    dispatch(getAuthUserProfilePending())
    const token = selectAuthUserToken(getState())
    const { profileInfo } = await profileGateway.getProfileInfo({ token })
    return profileInfo
  }
)
