import { createTestStore } from '../../../lib/create-store'
import { describe, test, expect } from 'vitest'
import {
  ViewModel,
  ViewModelType,
  selectHomeViewModel,
} from '../home-viewmodel'
import { stateBuilder } from '../../../lib/state-builder'
import { FakeAuthGateway } from '../../../lib/auth/infra/fake-auth.gateway'
import { FakeProfileGateway } from '../../../lib/profile/infra/fake-profile.gateway'
import { authenticateWithApi } from '../../../lib/auth/usecases/authenticate-with-api.usecase'
import { getAuthInfoProfileUser } from '../../../lib/profile/usecases/get-auth-info-profile-user'
import { getAuthAllBankAccountInfo } from '../../../lib/account/usecases/get-auth-all-bank-account-info'
import { FakeAccountGateway } from '../../../lib/account/infra/fake-account.gateway'

const stateBuilderWithTonyAuthenticated = stateBuilder().withAuthUser({
  authUser: 'Tony',
})

describe('Profile view model', () => {
  test('Example: there is no profile info in the store', () => {
    const store = createTestStore()
    const ViewModel = selectHomeViewModel(store.getState())
    expect(ViewModel).toEqual({
      user: {
        type: ViewModelType.NoProfile,
      },
    })
  })
  test('Example: there is no account in the profile', () => {
    const initialState = stateBuilderWithTonyAuthenticated
      .withUser({
        id: 'tony-user-id',
        firstName: 'tony',
        lastName: 'stark', 
      })
      .build()
    const store = createTestStore({}, initialState)
    const ViewModel = selectHomeViewModel(store.getState())
    expect(ViewModel).toEqual({
      user: {
        type: ViewModelType.EmptyProfile,
        accountInfo: 'There is no account yet ',
        firstName: 'tony',
        lastName: 'stark',
      },
    })
  })

  test('Example: the user account is loading ', () => {
    const initialState = stateBuilderWithTonyAuthenticated
      .withLoadingUserOf({})
      .build()
    const store = createTestStore({}, initialState)
    const ViewModel = selectHomeViewModel(store.getState())
    expect(ViewModel).toEqual({
      user: {
        type: ViewModelType.LoadingAccount,
        accountInfo: 'Loading...',
      },
    })
  })

  test('Example: there is one account in the profile', () => {
    const initialState = stateBuilderWithTonyAuthenticated
      .withUser({
        id: 'tony-user-id',
        firstName: 'tony',
        lastName: 'stark',
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
    const ViewModel = selectHomeViewModel(store.getState())
    expect(ViewModel).toEqual({
      user: {
        type: ViewModelType.WithAccounts,
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

  test('Example: there is few accounts in the bank profile', () => {
    const initialState = stateBuilderWithTonyAuthenticated
      .withUser({
        id: 'tony-user-id',
        firstName: 'tony',
        lastName: 'stark',
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
    const ViewModel = selectHomeViewModel(store.getState())
    expect(ViewModel).toEqual({
      user: {
        type: ViewModelType.WithAccounts,
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

  test('Should have user profile infos when user log in', async () => {
    const token = '1234'
    const accounts = [
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
    ]
    const profileGateway = new FakeProfileGateway()
    profileGateway.profileInfoByUser.set('1234', {
      id: '1',
      firstName: 'Tony',
      lastName: 'Stark',
    })

    const authGateway = new FakeAuthGateway()
    authGateway.token = token
    authGateway.userId = '1'

    const accountGateway = new FakeAccountGateway()
    accountGateway.allAccounts = accounts

    const store = createTestStore({
      profileGateway,
      authGateway,
      accountGateway,
    })

    await store.dispatch(
      authenticateWithApi({
        email: 'test@email',
        password: '123',
        rememberMe: true,
      })
    )
    await store.dispatch(getAuthInfoProfileUser())
    await store.dispatch(getAuthAllBankAccountInfo())
    const viewModel = selectHomeViewModel(store.getState())

    expect(viewModel).toEqual<ViewModel>({
      user: {
        type: ViewModelType.WithAccounts,
        firstName: 'Tony',
        lastName: 'Stark',
        accountInfo: accounts,
      },
    })
  })
})
