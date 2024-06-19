import { describe, it, expect } from 'vitest'
import { getAuthInfoProfileUser } from '../usecases/get-auth-info-profile-user'
import { FakeUserGateway } from '../infra/fake-user.gateway'
import { FakeAuthGateway } from '../../auth/infra/fake-auth.gateway'
import { AppStore, createStore } from '../../create-store'
import { selectIsUserProfileLoading } from '../slices/profile.slice'
import { mockData } from '../../../Mock/data'
import { stateBuilder } from '../../state-builder'



describe("Feature: Retrieving authenticated user's profile info", () => {
  it('Example: Tony is authenticated and can see see his profile info', async () => {
    // arrange (given)
    givenAuthenticatedUserIs({ token: mockData.user, userId: mockData.id })
    givenExistingUserInfo({
      id: mockData.id,
      firstName: mockData.profileInfo.firstName,
      lastName: mockData.profileInfo.lastName,
      accounts: mockData.accounts,
    })
    // act (when)
    const userProfileInfoRetrieving =
      whenRetrievingAuthenticatedUserProfileInfo()
    // assert (then)
    thenTheProfileOfTheUserShouldBeLoading(mockData.id)
    await userProfileInfoRetrieving
    thenTheReceivedProfileShouldBe(mockData)
  })
})

const authGateway = new FakeAuthGateway()
const userGateway = new FakeUserGateway()
let testStateBuilder = stateBuilder()
let store: AppStore

function givenAuthenticatedUserIs({
  token,
  userId,
}: {
  token: string
  userId: string
}) {
  testStateBuilder = testStateBuilder.withAuthUser({ authUser: token, userId })
}

function givenExistingUserInfo(userInfo: {
  id: string
  firstName: string
  lastName: string
  accounts: {
    id: string
    name: string
    amount: string
    currency: string
    balance: string
  }[]
}) {
  userGateway.userInfoByUser.set("Tony", userInfo)  
}

async function whenRetrievingAuthenticatedUserProfileInfo() {
  store = createStore(
    {
      userGateway,
      authGateway,
    },
    testStateBuilder.build()
  ) 
  await store.dispatch(getAuthInfoProfileUser()) 
}

function thenTheProfileOfTheUserShouldBeLoading(user: string) {
  const isUserProfileLoading = selectIsUserProfileLoading(
    user,
    store.getState()
  )
  console.log(isUserProfileLoading)
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
    .withAuthUser({
      authUser: expectedProfileInfo.user,
      userId: expectedProfileInfo.id,
    })
    .withUser({
      id: expectedProfileInfo.id,
      accounts: expectedProfileInfo.accounts.map((m) => m.id),
      firstName: expectedProfileInfo.profileInfo.firstName,
      lastName: expectedProfileInfo.profileInfo.lastName,
    })
    .withAccounts(expectedProfileInfo.accounts)
    .withNotLoadingUserOf({ userId: expectedProfileInfo.id })
    .build()
  expect(store.getState()).toEqual(expectedState)
}
