import { AuthApiPromiseGateway, AuthGateway } from '../model/auth.gateway'
import { FakeAuthGateway } from './fake-auth.gateway'

export class FakeStorageAuthGateway implements AuthGateway {
  constructor(private readonly fakeAuthGateway: FakeAuthGateway) {}

  onAuthStateChanged(listener: (authUser: string | undefined) => void): void {
    this.fakeAuthGateway.onAuthStateChanged(listener)
    this.checkIfAuthenticated()
  }

  async authenticateWithApi({
    email,
    password,
  }: {
    email: string
    password: string
  }): Promise<AuthApiPromiseGateway | undefined> {
    const { token, userId } = await this.fakeAuthGateway.authenticateWithApi({
      email,
      password,
    })
    if (token && userId) {
      localStorage.setItem('fake-auth', token)
      this.fakeAuthGateway.onAuthStateChangedListener(token)
      return { token, userId }
    }
  }

  authenticatedUserLogOut(): void {}

  private checkIfAuthenticated() {
    const maybeAuthUser = localStorage.getItem('fake-auth')
    if (maybeAuthUser !== null) {
      this.fakeAuthGateway.simulateAuthStateChanged(maybeAuthUser)
    }
  }
}
