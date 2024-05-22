import { AuthGateway } from '../model/auth.gateway'

export class FakeAuthGateway implements AuthGateway {
  authUser!: string

  static withAuthenticatedUser(authUser: string): FakeAuthGateway {
    const gateway = new FakeAuthGateway()
    gateway.authUser = authUser
    return gateway
  }

  getAuthUser(): string {
    return this.authUser
  }
}

export const authGateway = new FakeAuthGateway()
