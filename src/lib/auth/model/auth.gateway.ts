export type AuthUser = string | undefined

export interface AuthGateway {
  authenticateWithApi({
    email,
    password,
    rememberMe,
  }: {
    email: string
    password: string
    rememberMe: boolean
  }): Promise<AuthApiPromiseGateway | undefined>
  onAuthStateChanged(listener: (authUser: AuthUser) => void): void
  authenticatedUserLogOut(): void
}

export type AuthApiPromiseGateway = {
  token: string
}
