import { createAppAsyncThunk } from '../../create-app-thunk'

export const authenticateWithApi = createAppAsyncThunk(
  'auth/authenticateWithApi',
  async (
    params: { email: string; password: string; rememberMe: boolean },
    { extra: { authGateway } }
  ) => {
    const authUser = await authGateway.authenticateWithApi({
      email: params.email,
      password: params.password,
      rememberMe: params.rememberMe,
    })
    return authUser
  }
)
