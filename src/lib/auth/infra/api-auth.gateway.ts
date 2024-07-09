import { getToken } from '../../../fetch'
import {
  AuthApiPromiseGateway,
  AuthGateway,
  AuthUser,
} from '../model/auth.gateway'

export class ApiAuthGateway implements AuthGateway {
  token: undefined | string = undefined
  onAuthStateChangedListener!: (authUser: AuthUser) => void

  onAuthStateChanged(listener: (authUser: AuthUser) => void): void {
    this.onAuthStateChangedListener = listener
  }

  async authenticateWithApi({
    email,
    password,
    rememberMe,
  }: {
    email: string
    password: string
    rememberMe: boolean
  }): Promise<AuthApiPromiseGateway | undefined> {
    const token = await getToken({ email, password })
    if (!token) return
    localStorage.setItem('token', token)

    this.onAuthStateChangedListener(token)

    return { token }
  }

  authenticatedUserLogOut(): void {
    localStorage.clear()
    this.onAuthStateChangedListener(undefined)
  }
}

export const authGateway = new ApiAuthGateway()
