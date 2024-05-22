import { describe, it, expect } from 'vitest'
import { getInfoProfileUser } from '../usecases/get-info-profile-user'
import { FakeUserGateway} from '../infra/fake-user.gateway'
import { FakeAuthGateway} from '../../auth/infra/fake-auth.gateway'
import { createStore } from '../../create-store'

describe("Feature: Retrieving authenticated user's profile info", () => {
  it('Example: Tony is authenticated and can see see his profile info', async () => {
    // arrange (given)
    givenAuthenticatedUserIs('Tony')
    givenExistingUserInfo({
      firstName: 'Tony',
      lastName: 'Stark',
      email: 'tony@stark.com',
    })
    // act (when)
    await whenRetrievingAuthenticatedUserProfileInfo()
    // assert (then)
    thenTheReceivedProfileShouldBe({
      firstName: 'Tony',
      lastName: 'Stark',
      email: 'tony@stark.com',
    })
  })
})
const authGateway = new FakeAuthGateway()
const userGateway = new FakeUserGateway()
const store = createStore({
  authGateway,
  userGateway,
})

function givenAuthenticatedUserIs(user: string) {
  authGateway.authUser = user
}

function givenExistingUserInfo(userInfo: {
  firstName: string
  lastName: string
  email: string
}) {
  userGateway.userInfoByUser.set('Tony', userInfo)
}

async function whenRetrievingAuthenticatedUserProfileInfo() {
  await store.dispatch(getInfoProfileUser())
}

function thenTheReceivedProfileShouldBe(expectedProfileInfo: {
  firstName: string
  lastName: string
  email: string
}) {
  const authUserProfile = store.getState()
  expect(authUserProfile).toEqual(expectedProfileInfo)
}
