import { describe, it, expect } from 'vitest'
import { FakeAuthGateway } from '../../auth/infra/fake-auth.gateway'
import { AppStore, createTestStore } from '../../create-store'
import { stateBuilder } from '../../state-builder'
import { FakeTransactionsGateway } from '../infra/fake-transactions.gateway'
import { getAuthAllTransactionsInfo } from '../usecases/get-auth-transactions-info-with-id'
import { selectAreAllTransactionsInfoLoading } from '../slices/bank-transactions-info'

export const mockData = [
  {
    id: 'test-id-1',
    accountId: 'test-account-id',
    date: 'June 13th, 2020',
    description: 'Payment from John Doe',
    amount: '100',
    balance: '1900',
    category: undefined,
    note: undefined,
  },
  {
    id: 'test-id-2',
    accountId: 'test-account-id',
    date: 'June 13th, 2020',
    description: 'Payment from John Doe',
    amount: '100',
    balance: '1900',
    category: undefined,
    note: undefined,
  },
]

describe("Feature: Retrieving authenticated user's accounts info", () => {
  it('Example: Tony is authenticated and can see see his accounts info', async () => {
    const accountId = 'test-account-id'
    // arrange (given)
    givenAuthenticatedUserIs({ token: 'token' })
    givenExistingUserInfo(mockData)
    // act (when)
    const userAccountInfoRetrieving =
      whenRetrievingAuthenticatedUserAllTransactionsInfoFromOneAccountWithId(
        accountId
      )
    // assert (then)
    thenTheTransactionOfTheUserShouldBeLoading(accountId)
    await userAccountInfoRetrieving
    thenTheReceivedAccountsShouldBe(mockData)
  })
})

const authGateway = new FakeAuthGateway()
const transactionsGateway = new FakeTransactionsGateway()

let testStateBuilder = stateBuilder()
let store: AppStore

function givenAuthenticatedUserIs({ token }: { token: string }) {
  testStateBuilder = testStateBuilder.withAuthUser({ authUser: token })
}

function givenExistingUserInfo(
  transactionsInfo: {
    id: string
    accountId: string
    date: string
    description: string
    amount: string
    balance: string
    category: string | undefined
    note: string | undefined
  }[]
) {
  transactionsGateway.allTransactions = transactionsInfo
}

async function whenRetrievingAuthenticatedUserAllTransactionsInfoFromOneAccountWithId(
  accountId: string
) {
  store = createTestStore(
    {
      transactionsGateway,
      authGateway,
    },
    testStateBuilder.build()
  )
  await store.dispatch(getAuthAllTransactionsInfo({ accountId }))
}

function thenTheTransactionOfTheUserShouldBeLoading(accountId: string) {
  const AreAllBankTransactionsInfoLoading = selectAreAllTransactionsInfoLoading(
    accountId,
    store.getState()
  )
  expect(AreAllBankTransactionsInfoLoading).toBe(true)
}

function thenTheReceivedAccountsShouldBe(
  expectedAccountInfo: {
    id: string
    accountId: string
    date: string
    description: string
    amount: string
    balance: string
    category: string | undefined
    note: string | undefined
  }[]
) {
  const expectedState = stateBuilder()
    .withAuthUser({
      authUser: 'token',
    })
    .withTransactions(expectedAccountInfo)
    .withNotLoadingTransactionsOf({
      accountId: expectedAccountInfo[0].accountId,
    })
    .build()
  console.log(store.getState().transactions)
  expect(store.getState()).toEqual(expectedState)
}
