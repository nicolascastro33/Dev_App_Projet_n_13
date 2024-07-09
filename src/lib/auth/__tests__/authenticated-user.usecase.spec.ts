import { describe, expect, test } from 'vitest'
import { stateBuilder } from '../../state-builder'
import { createTestStore } from '../../create-store'
import { authenticateWithApi } from '../usecases/authenticate-with-api.usecase'
import { FakeAuthGateway } from '../infra/fake-auth.gateway'

describe('Feature: Authenticated with Api', () => {
  test('Example: Tony authenticates with Api successfully', async () => {
    givenAuthenticationWithApiWillSucceedForUser({
      token: 'token',
    })
    await whenUserAuthenticateWithApi()
    thenUserShouldBeAuthenticated({
      token: 'token',
    })
  })
})

const authGateway = new FakeAuthGateway()
const store = createTestStore({
  authGateway,
})

function givenAuthenticationWithApiWillSucceedForUser({
  token,
}: {
  token: string
}) {
  authGateway.token = token
}

async function whenUserAuthenticateWithApi() {
  return store.dispatch(
    authenticateWithApi({
      email: 'test@email',
      password: '123',
      rememberMe: true,
    })
  )
}

function thenUserShouldBeAuthenticated({ token }: { token: string }) {
  const expectedState = stateBuilder().withAuthUser({ authUser: token }).build()
  expect(store.getState()).toEqual(expectedState)
}
