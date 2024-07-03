import { createAppAsyncThunk } from '../../create-app-thunk'

export const authenticatedUserLogOut = createAppAsyncThunk(
  'auth/authenticatedUserLogOut',
  async (_, { extra: { authGateway } }) => {
    const authUser = await authGateway.authenticatedUserLogOut()
    return authUser
  }
)
