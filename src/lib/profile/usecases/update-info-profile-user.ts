import { selectAuthUserToken } from '../../auth/reducer'
import { createAppAsyncThunk } from '../../create-app-thunk'
import { getAuthUserProfilePending } from './get-auth-info-profile-user'

export const updateInfoProfile = createAppAsyncThunk(
  'user/updateInfoProfile',
  async (
    params: {
      firstName: string
      lastName: string
    },
    { extra: { profileGateway }, getState, dispatch }
  ) => {
    const token = selectAuthUserToken(getState())
    dispatch(getAuthUserProfilePending())
    const authUser = await profileGateway.updateInfoProfile({
      token,
      firstName: params.firstName,
      lastName: params.lastName,
    })
    return authUser
  }
)
