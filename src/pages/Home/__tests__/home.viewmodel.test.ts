import { createTestStore } from '../../../lib/create-store'
import { describe, test, expect } from 'vitest'
import {
  ProfileViewModel,
  ProfileViewModelType,
  selectProfileViewModel,
} from '../home.viewmodel'
import { stateBuilder } from '../../../lib/state-builder'
import { FakeAuthGateway } from '../../../lib/auth/infra/fake-auth.gateway'
import { FakeUserGateway } from '../../../lib/user/infra/fake-user.gateway'
import { authenticateWithApi } from '../../../lib/auth/usecases/authenticate-with-api.usecase'

const stateBuilderWithTonyAuthenticated = stateBuilder().withAuthUser({
  authUser: 'Tony',
  userId: 'tony-user-id',
})

describe('Profile view model', () => {
  test('Example: there is no profile info in the store', () => {
    const store = createTestStore()
    const profileViewModel = selectProfileViewModel(store.getState())
    expect(profileViewModel).toEqual({
      user: {
        type: ProfileViewModelType.NoProfile,
      },
    })
  })
  test('Example: there is no account in the profile', () => {
    const initialState = stateBuilderWithTonyAuthenticated
      .withUser({
        id: 'tony-user-id',
        accounts: [],
        userAuthToken: 'Tony',
        firstName: 'tony',
        lastName: 'stark',
      })
      .build()
    const store = createTestStore({}, initialState)
    const profileViewModel = selectProfileViewModel(store.getState())

    expect(profileViewModel).toEqual({
      user: {
        type: ProfileViewModelType.EmptyProfile,
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
    const profileViewModel = selectProfileViewModel(store.getState())
    expect(profileViewModel).toEqual({
      user: {
        type: ProfileViewModelType.LoadingAccount,
        accountInfo: 'Loading...',
      },
    })
  })

  test('Example: there is one account in the profile', () => {
    const initialState = stateBuilderWithTonyAuthenticated
      .withUser({
        id: 'tony-user-id',
        userAuthToken: 'Tony',
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
    const profileViewModel = selectProfileViewModel(store.getState())
    expect(profileViewModel).toEqual({
      user: {
        type: ProfileViewModelType.WithAccounts,
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
        userAuthToken: 'Tony',
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
    const profileViewModel = selectProfileViewModel(store.getState())
    expect(profileViewModel).toEqual({
      user: {
        type: ProfileViewModelType.WithAccounts,
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
    const userGateway = new FakeUserGateway()
    userGateway.userInfoByUser.set('1', {
      id: '1',
      firstName: 'Tony',
      lastName: 'Stark',
      userAuthToken: token,
    })

    const authGateway = new FakeAuthGateway()
    authGateway.token = token
    authGateway.userId = '1'

    const store = createTestStore({
      userGateway,
      authGateway,
    })

    await store.dispatch(
      authenticateWithApi({ email: 'test@email', password: '123' })
    )

    console.log(store.getState())
    const viewModel = selectProfileViewModel(store.getState())
    expect(viewModel).toEqual<ProfileViewModel>({
      user: {
        type: ProfileViewModelType.EmptyProfile,
        firstName: 'Tony',
        lastName: 'Stark',
        accountInfo: 'There is no account yet ',
      },
    })
  })
})
