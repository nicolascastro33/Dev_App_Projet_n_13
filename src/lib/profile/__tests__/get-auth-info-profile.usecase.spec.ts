import { describe, it, expect } from 'vitest'
import { getAuthInfoProfileUser } from '../usecases/get-auth-info-profile-user'
import { FakeProfileGateway } from '../infra/fake-profile.gateway'
import { FakeAuthGateway } from '../../auth/infra/fake-auth.gateway'
import { AppStore, createTestStore } from '../../create-store'
import { selectIsUserProfileLoading } from '../slices/profile.slice'
import { stateBuilder } from '../../state-builder'

export const mockData = {
  id: 'tony-user-id',
  user: 'Tony',
  profileInfo: {
    firstName: 'Tony',
    lastName: 'Stark',
    email: 'tonystark@gmail.com',
    password: '123',
  },
}

describe("Feature: Retrieving authenticated user's profile info", () => {
  it('Example: Tony is authenticated and can see see his profile info', async () => {
    // arrange (given)
    givenAuthenticatedUserIs({ token: mockData.user })
    givenExistingUserInfo({
      id: mockData.id,
      firstName: mockData.profileInfo.firstName,
      lastName: mockData.profileInfo.lastName,
    })
    // act (when)
    const userProfileInfoRetrieving =
      whenRetrievingAuthenticatedUserProfileInfo()
    // assert (then)
    thenTheProfileOfTheUserShouldBeLoading()
    await userProfileInfoRetrieving
    thenTheReceivedProfileShouldBe(mockData)
  })
})

const authGateway = new FakeAuthGateway()
const profileGateway = new FakeProfileGateway()

let testStateBuilder = stateBuilder()
let store: AppStore

function givenAuthenticatedUserIs({ token }: { token: string }) {
  testStateBuilder = testStateBuilder.withAuthUser({ authUser: token })
}

function givenExistingUserInfo(userInfo: {
  id: string
  firstName: string
  lastName: string
}) {
  profileGateway.profileInfoByUser.set('Tony', userInfo)
}

async function whenRetrievingAuthenticatedUserProfileInfo() {
  store = createTestStore(
    {
      profileGateway,
      authGateway,
    },
    testStateBuilder.build()
  )
  await store.dispatch(getAuthInfoProfileUser())
}

function thenTheProfileOfTheUserShouldBeLoading() {
  const isUserProfileLoading = selectIsUserProfileLoading(store.getState())
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
}) {
  const expectedState = stateBuilder()
    .withAuthUser({
      authUser: expectedProfileInfo.user,
    })
    .withUser({
      id: expectedProfileInfo.id,
      firstName: expectedProfileInfo.profileInfo.firstName,
      lastName: expectedProfileInfo.profileInfo.lastName,
    })
    .withNotLoadingUserOf({ userId: expectedProfileInfo.id })
    .build()
  expect(store.getState()).toEqual(expectedState)
}
