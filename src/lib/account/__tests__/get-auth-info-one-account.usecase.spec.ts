import { describe, it, expect } from 'vitest'
import { FakeAuthGateway } from '../../auth/infra/fake-auth.gateway'
import { AppStore, createTestStore } from '../../create-store'
import { stateBuilder } from '../../state-builder'
import { FakeAccountGateway } from '../infra/fake-account.gateway'
import { selectIsBankAccountInfoLoading } from '../slices/bank-account-info'
import { getAuthBankAccountInfo } from '../usecases/get-auth-account-info-with-id'

export const mockData = [
  {
    id: 'test-id-1',
    name: 'Argent Bank Checking (x8349)',
    amount: '2,082.79',
    currency: '$',
    balance: 'Available',
  },
  {
    id: 'test-id-2',
    name: 'Argent Bank Savings (x6712)',
    amount: '10,928.42',
    currency: '$',
    balance: 'Available',
  },
]

describe("Feature: Retrieving authenticated user's accounts info", () => {
  it('Example: Tony is authenticated and can see see his accounts info', async () => {
    const accountId = 'test-id-1'
    // arrange (given)
    givenAuthenticatedUserIs({ token: 'token' })
    givenExistingUserInfo(mockData)
    // act (when)
    const userAccountInfoRetrieving =
      whenRetrievingAuthenticatedUserAccountInfo(accountId)
    // assert (then)
    thenTheAccountOfTheUserShouldBeLoading(accountId)
    await userAccountInfoRetrieving
    thenTheReceivedAccountsShouldBe(mockData[0])
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

async function whenRetrievingAuthenticatedUserAccountInfo(accountId: string) {
  store = createTestStore(
    {
      accountGateway,
      authGateway,
    },
    testStateBuilder.build()
  )
  await store.dispatch(getAuthBankAccountInfo({ accountId }))
}

function thenTheAccountOfTheUserShouldBeLoading(accountId: string) {
  const isBankAccountLoading = selectIsBankAccountInfoLoading(
    accountId,
    store.getState()
  )
  expect(isBankAccountLoading).toBe(true)
}

function thenTheReceivedAccountsShouldBe(expectedAccountInfo: {
  id: string
  name: string
  amount: string
  currency: string
  balance: string
}) {
  const expectedState = stateBuilder()
    .withAuthUser({
      authUser: 'token',
    })
    .withOneAccount(expectedAccountInfo)
    .withNotLoadingAccountOf({ accountId: expectedAccountInfo.id })
    .build()
  expect(store.getState()).toEqual(expectedState)
}
