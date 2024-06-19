import { getInfo, getToken } from '../../../fetch'
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
    if (token) {
      const userId = await getInfo(token).then((i) => i.id)
      if (rememberMe) {
        localStorage.setItem('token', token)
        localStorage.setItem('userId', userId)
      }
      this.onAuthStateChangedListener(token)
      return { token, userId }
    }
  }

  authenticatedUserLogOut(): void {
    localStorage.clear()
    this.onAuthStateChangedListener(undefined)
  }

  simulateAuthStateChanged(authUser: string) {
    this.onAuthStateChangedListener(authUser)
  }
}

export const authGateway = new ApiAuthGateway()
