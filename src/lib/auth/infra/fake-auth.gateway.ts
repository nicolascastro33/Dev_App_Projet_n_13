import { AuthGateway, AuthUser } from '../model/auth.gateway'
import { AuthApiPromiseGateway } from '../model/auth.gateway'

export class FakeAuthGateway implements AuthGateway {
  token!:string
  userId!:string

  onAuthStateChangedListener: (authUser: AuthUser) => void = () => {
    return
  }

  constructor(private readonly delay = 0) {}

  onAuthStateChanged(listener: (authUser: string | undefined) => void): void {
    this.onAuthStateChangedListener = listener
  }

  authenticateWithApi({
    email,
    password,
  }: {
    email: string
    password: string
  }): Promise<AuthApiPromiseGateway> {
    console.log(email, password)
    return new Promise((resolve) =>
      setTimeout(
        () => resolve({ token: this.token, userId:this.userId }),
        this.delay
      )
    )
  }

  authenticatedUserLogOut(): void {}

  simulateAuthStateChanged(authUser: string) {
    this.onAuthStateChangedListener(authUser)
  }
}

export const authGateway = new FakeAuthGateway()
