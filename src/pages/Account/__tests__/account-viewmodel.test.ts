import { createTestStore } from '../../../lib/create-store'
import { describe, test, expect } from 'vitest'
import { ViewModel, ViewModelType } from '../account-viewmodel'
import { stateBuilder } from '../../../lib/state-builder'
import { FakeAuthGateway } from '../../../lib/auth/infra/fake-auth.gateway'
import { authenticateWithApi } from '../../../lib/auth/usecases/authenticate-with-api.usecase'
import { selectAccountViewModel } from '../account-viewmodel'
import { FakeAccountGateway } from '../../../lib/account/infra/fake-account.gateway'
import { getAuthBankAccountInfo } from '../../../lib/account/usecases/get-auth-account-info-with-id'

const stateBuilderWithTonyAuthenticated = stateBuilder().withAuthUser({
  authUser: 'Tony',
  userId: 'tony-user-id',
}) 


describe('Profile view model', () => {
  test('Example: there is no account info in the store', () => {
    const store = createTestStore()
    const ViewModel = selectAccountViewModel(store.getState())
    expect(ViewModel).toEqual({
      user: {
        type: ViewModelType.NoAccount,
      },
    })
  })
  test('Example: there is no transactions in the account', () => {
    const initialState = stateBuilderWithTonyAuthenticated
      .withUser({
        id: 'tony-user-id',
        accounts: [],
        firstName: 'tony',
        lastName: 'stark',
      })
      .build()
    const store = createTestStore({}, initialState)
    const ViewModel = selectAccountViewModel(store.getState())

    expect(ViewModel).toEqual({
      user: {
        type: ViewModelType.NoTransactions,
        accountInfo: 'There is no account yet ',
        firstName: 'tony',
        lastName: 'stark',
      },
    })
  })

  test('Example: the user account is loading ', () => {
    const initialState = stateBuilderWithTonyAuthenticated
      .withLoadingUserOf({ userId: 'tony-user-id' })
      .build()
    const store = createTestStore({}, initialState)
    const ViewModel = selectAccountViewModel(store.getState())
    expect(ViewModel).toEqual({
      user: {
        type: ViewModelType.LoadingAccount,
        accountInfo: 'Loading...',
      },
    })
  })

  test('Example: there is one transaction in the account', () => {
    const initialState = stateBuilderWithTonyAuthenticated
      .withUser({
        id: 'tony-user-id',
        firstName: 'tony',
        lastName: 'stark',
        accounts: ['act-1'],
      })
      .withAccounts([
        {
          id: 'act-1',
          name: 'testAccount',
          balance: 'current',
          amount: '000',
          currency: 'euro',
        },
      ])
      .build()
    const store = createTestStore({}, initialState)
    const ViewModel = selectAccountViewModel(store.getState())
    expect(ViewModel).toEqual({
      user: {
        type: ViewModelType.WithTransactions,
        accountInfo: [
          {
            id: 'act-1',
            name: 'testAccount',
            balance: 'current',
            amount: '000',
            currency: 'euro',
          },
        ],

        firstName: 'tony',
        lastName: 'stark',
      },
    })
  })

  test('Example: there is few transactions in the account', () => {
    const initialState = stateBuilderWithTonyAuthenticated
      .withUser({
        id: 'tony-user-id',
        firstName: 'tony',
        lastName: 'stark',
        accounts: ['act-1', 'act-2'],
      })
      .withAccounts([
        {
          id: 'act-1',
          name: 'act-1',
          balance: 'current',
          amount: '000',
          currency: 'euro',
        },
        {
          id: 'act-2',
          name: 'act-2',
          balance: 'current',
          amount: '100',
          currency: 'dollar',
        },
      ])
      .build()
    const store = createTestStore({}, initialState)
    const ViewModel = selectAccountViewModel(store.getState())
    expect(ViewModel).toEqual({
      user: {
        type: ViewModelType.WithTransactions,
        accountInfo: [
          {
            id: 'act-1',
            name: 'act-1',
            balance: 'current',
            amount: '000',
            currency: 'euro',
          },
          {
            id: 'act-2',
            name: 'act-2',
            balance: 'current',
            amount: '100',
            currency: 'dollar',
          },
        ],
        firstName: 'tony',
        lastName: 'stark',
      },
    })
  })

  test('Should have account infos when the user is identified', async () => {
    const accountId = '1234'
    const accountGateway = new FakeAccountGateway()
    accountGateway.accountInfoByAccountId.set(accountId, {
      id: accountId,
      name: 'BankTest',
      amount: '5',
      currency: 'euro',
      balance: 'test',
      transactions: [
        {
          date: '05/05/05',
          description: 'none',
        },
      ],
    })

    const authGateway = new FakeAuthGateway()
    authGateway.token = 'token'
    authGateway.userId = '1'

    const store = createTestStore({
      accountGateway,
      authGateway,
    })

    await store.dispatch(
      authenticateWithApi({
        email: 'test@email',
        password: '123',
        rememberMe: true,
      })
    )
    await store.dispatch(getAuthBankAccountInfo({ accountId }))
    const viewModel = selectAccountViewModel(store.getState())
    expect(viewModel).toEqual<ViewModel>({
      account: {
        type: ViewModelType.WithTransactions,
        accountInfo: {
          name: 'BankTest',
          amount: '5',
          currency: 'euro',
          balance: 'test',
        },
        transactions: [
          {
            date: '05/05/05',
            description: 'none',
          },
        ],
      },
    })
  })
})
