import { describe, it, expect } from 'vitest'
import { FakeAuthGateway } from '../../auth/infra/fake-auth.gateway'
import { AppStore, createTestStore } from '../../create-store'
import { stateBuilder } from '../../state-builder'
import { FakeAccountGateway } from '../infra/fake-account.gateway'
import { getAuthAllBankAccountInfo } from '../usecases/get-auth-all-bank-account-info'
import { selectAreAllBankAccountsInfoLoading } from '../slices/bank-account-info'

export const mockData = [
  {
    id: 'cnt-1',
    name: 'Argent Bank Checking (x8349)',
    amount: '2,082.79',
    currency: '$',
    balance: 'Available',
  },
  {
    id: 'cnt-2',
    name: 'Argent Bank Savings (x6712)',
    amount: '10,928.42',
    currency: '$',
    balance: 'Available',
  },
]

describe("Feature: Retrieving authenticated user's accounts info", () => {
  it('Example: Tony is authenticated and can see see his accounts info', async () => {
    // arrange (given)
    givenAuthenticatedUserIs({ token: 'token' })
    givenExistingUserInfo(mockData)
    // act (when)
    const userAccountInfoRetrieving =
      whenRetrievingAuthenticatedUserAccountInfo()
    // assert (then)
    thenTheAccountOfTheUserShouldBeLoading()
    await userAccountInfoRetrieving
    thenTheReceivedAccountsShouldBe(mockData)
  })
})

const authGateway = new FakeAuthGateway()
const accountGateway = new FakeAccountGateway()

let testStateBuilder = stateBuilder()
let store: AppStore

function givenAuthenticatedUserIs({ token }: { token: string }) {
  testStateBuilder = testStateBuilder.withAuthUser({ authUser: token })
}

function givenExistingUserInfo(
  accountsInfo: {
    id: string
    name: string
    amount: string
    currency: string
    balance: string
  }[]
) {
  accountGateway.allAccounts = accountsInfo
}

async function whenRetrievingAuthenticatedUserAccountInfo() {
  store = createTestStore(
    {
      accountGateway,
      authGateway,
    },
    testStateBuilder.build()
  )
  await store.dispatch(getAuthAllBankAccountInfo())
}

function thenTheAccountOfTheUserShouldBeLoading() {
  const areAllBankAccountsLoading = selectAreAllBankAccountsInfoLoading(
    store.getState()
  )
  expect(areAllBankAccountsLoading).toBe(true)
}

function thenTheReceivedAccountsShouldBe(
  expectedAccountsInfo: {
    id: string
    name: string
    amount: string
    currency: string
    balance: string
  }[]
) {
  const expectedState = stateBuilder()
    .withAuthUser({
      authUser: 'token',
    })
    .withAccounts(expectedAccountsInfo)
    .build()
  expect(store.getState()).toEqual(expectedState)
}
