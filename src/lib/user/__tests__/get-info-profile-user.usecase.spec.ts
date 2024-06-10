import { describe, it, expect } from 'vitest'
import { getInfoProfileUser } from '../usecases/get-info-profile-user'
import { FakeUserGateway } from '../infra/fake-user.gateway'
import { FakeAuthGateway } from '../../auth/infra/fake-auth.gateway'
import { AppStore, createStore } from '../../create-store'
import { selectIsUserProfileLoading } from '../slices/profile.slice'
import { mockData } from '../../../Mock/data'
import { stateBuilder } from '../../state-builder'

describe("Feature: Retrieving authenticated user's profile info", () => {
  it('Example: Tony is authenticated and can see see his profile info', async () => {
    // arrange (given)
    givenAuthenticatedUserIs('Tony')
    givenExistingUserInfo(mockData)
    // act (when)
    const userProfileInfoRetrieving =
      whenRetrievingAuthenticatedUserProfileInfo()
    // assert (then)
    thenTheProfileOfTheUserShouldBeLoading('Tony')
    await userProfileInfoRetrieving
    thenTheReceivedProfileShouldBe(mockData)
  })
})

const authGateway = new FakeAuthGateway()
const userGateway = new FakeUserGateway()
let testStateBuilder = stateBuilder()
let store: AppStore

function givenAuthenticatedUserIs(user: string) {
  authGateway.authUser = user
  testStateBuilder = testStateBuilder.withAuthUser({ authUser: user })
}

function givenExistingUserInfo(userInfo: {
  user: string
  id: string
  profileInfo: {
    firstName: string
    lastName: string
    email: string
    password: string
  }
  accounts: {
    id: string
    name: string
    amount: string
    currency: string
    balance: string
  }[]
}) {
  userGateway.userInfoByUser.set(userInfo.user, userInfo)
}

async function whenRetrievingAuthenticatedUserProfileInfo() {
  store = createStore(
    {
      userGateway,
      authGateway,
    },
    testStateBuilder.build()
  )
  await store.dispatch(getInfoProfileUser())
}

function thenTheProfileOfTheUserShouldBeLoading(user: string) {
  const isUserProfileLoading = selectIsUserProfileLoading(
    user,
    store.getState()
  )
  expect(isUserProfileLoading).toBe(true)
}

function thenTheReceivedProfileShouldBe(expectedProfileInfo: {
  user: string
  id: string
  profileInfo: {
    firstName: string
    lastName: string
    email: string
    password: string
  }
  accounts: {
    id: string
    name: string
    amount: string
    currency: string
    balance: string
  }[]
}) {
  const expectedState = stateBuilder()
    .withAuthUser({ authUser: expectedProfileInfo.user })
    .withUser({
      id: expectedProfileInfo.id,
      user: expectedProfileInfo.user,
      accounts: expectedProfileInfo.accounts.map((m) => m.id),
      profileInfo: {
        firstName: expectedProfileInfo.profileInfo.firstName,
        lastName: expectedProfileInfo.profileInfo.lastName,
      },
    })
    .withAccounts(expectedProfileInfo.accounts)
    .withNotLoadingUserOf({ user: expectedProfileInfo.user })
    .build()

  expect(store.getState()).toEqual(expectedState)
}
