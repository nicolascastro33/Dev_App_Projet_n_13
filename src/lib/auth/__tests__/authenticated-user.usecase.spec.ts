import { describe, expect, test } from 'vitest'
import { stateBuilder } from '../../state-builder'
import { createTestStore } from '../../create-store'
import { authenticateWithApi } from '../usecases/authenticate-with-api.usecase'
import { FakeAuthGateway } from '../infra/fake-auth.gateway'

describe('Feature: Authenticated with Api', () => {
  test('Example: Tony authenticates with Api successfully', async () => {
    givenAuthenticationWithApiWillSucceedForUser({
      token: 'token',
      userId: 'test-id',
    })
    await whenUserAuthenticateWithApi()
    thenUserShouldBeAuthenticated({
      token: 'token',
      userId: 'test-id',
    })
  })
})

const authGateway = new FakeAuthGateway()
const store = createTestStore({
  authGateway,
})

function givenAuthenticationWithApiWillSucceedForUser({
  token,
  userId,
}: {
  token: string
  userId: string
}) {
  authGateway.token = token
  authGateway.userId = userId
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

function thenUserShouldBeAuthenticated({
  token,
  userId,
}: {
  token: string
  userId: string
}) {
  const expectedState = stateBuilder()
    .withAuthUser({ authUser: token, userId })
    .build()
  expect(store.getState()).toEqual(expectedState)
}
