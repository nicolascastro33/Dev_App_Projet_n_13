import { describe, it, expect } from 'vitest'
import { getInfoProfileUser } from '../usecases/get-info-profile-user'
import { FakeUserGateway } from '../infra/fake-user.gateway'
import { FakeAuthGateway } from '../../auth/infra/fake-auth.gateway'
import { createStore } from '../../create-store'
import { selectUserInfo } from '../slices/profile.slice'
import { selectAccount } from '../slices/bank.accounts.slice'
import { mockData } from '../../../Mock/data'

describe("Feature: Retrieving authenticated user's profile info", () => {
  it('Example: Tony is authenticated and can see see his profile info', async () => {
    // arrange (given)
    givenAuthenticatedUserIs('Tony')
    givenExistingUserInfo(mockData)
    // act (when)
    await whenRetrievingAuthenticatedUserProfileInfo()
    // assert (then)
    thenTheReceivedProfileShouldBe(mockData)
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
  userGateway.userInfoByUser.set('Tony', userInfo)
}

async function whenRetrievingAuthenticatedUserProfileInfo() {
  await store.dispatch(getInfoProfileUser())
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
  const authUserProfile = selectUserInfo(
    expectedProfileInfo.id,
    store.getState()
  )
  expect(authUserProfile).toEqual({
    id: expectedProfileInfo.id,
    user: expectedProfileInfo.user,
    profileInfo: {
      firstName: expectedProfileInfo.profileInfo.firstName,
      lastName: expectedProfileInfo.profileInfo.lastName,
    },
    accounts: expectedProfileInfo.accounts.map((m) => m.id),
  })

  expectedProfileInfo.accounts.forEach((account) => {
    expect(selectAccount(account.id, store.getState())).toEqual(account)
  })
}
