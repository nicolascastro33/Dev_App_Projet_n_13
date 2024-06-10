import { createTestStore } from '../../../lib/create-store'
import { describe, test, expect } from 'vitest'
import {
  ProfileViewModelType,
  selectProfileViewModel,
} from '../profile.viewmodel'
import { stateBuilder } from '../../../lib/state-builder'

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
    const initialState = stateBuilder()
      .withUser({
        id: 'tony-user-id',
        accounts: [],
        user: 'Tony',
        profileInfo: {
          firstName: 'tony',
          lastName: 'stark',
        },
      })
      .build()
    const store = createTestStore({}, initialState)
    const profileViewModel = selectProfileViewModel(store.getState())
    expect(profileViewModel).toEqual({
      user: {
        type: ProfileViewModelType.EmptyProfile,
        accountInfo: 'There is no account yet ',
        profileInfo: {
          firstName: 'tony',
          lastName: 'stark',
        },
      },
    })
  })

  test('Example: the user account is loading ', () => {
    const initialState = stateBuilder()
      .withLoadingUserOf({ user: 'Tony' })
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
    const initialState = stateBuilder()
      .withUser({
        id: 'tony-user-id',
        user: 'tony',
        profileInfo: {
          firstName: 'tony',
          lastName: 'stark',
        },
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
        profileInfo: {
          firstName: 'tony',
          lastName: 'stark',
        },
      },
    })
  })

  test('Example: there is few accounts in the bank profile', () => {
    const initialState = stateBuilder()
      .withUser({
        id: 'tony-user-id',
        user: 'tony',
        profileInfo: {
          firstName: 'tony',
          lastName: 'stark',
        },
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
        profileInfo: {
          firstName: 'tony',
          lastName: 'stark',
        },
      },
    })
  })
})
