import { createTestStore } from '../../../lib/create-store'
import { describe, test, expect } from 'vitest'
import { selectProfileViewModel } from '../profile.viewmodel'

describe('Profile view model', () => {
  test('Example: there is no profile info in the store', () => {
    const store = createTestStore()
    const profileViewModel = selectProfileViewModel(store.getState())
    expect(profileViewModel).toEqual({
      user: {
        type: 'NO_PROFILE',
      },
    })
  })
  test('Example: there is no account in the profile', () => {
    const store = createTestStore(
      {}, 
      {
        profile: {
          ids: ['tony-user-id'],
          entities: {
            'tony-user-id': {
              id: 'tony-user-id',
              user: 'tony',
              profileInfo: {
                firstName: 'tony',
                lastName: 'stark',
              },
              accounts: [],
            },
          },
        },
      }
    )
    const profileViewModel = selectProfileViewModel(store.getState())
    expect(profileViewModel).toEqual({
      user: {
        type: 'EMPTY_PROFILE',
        accountInfo: 'There is no account yet ',
        profileInfo: {
          firstName: 'tony',
          lastName: 'stark',
        }, 
      },
    })
  })

  test('Example: there is one account in the profile', () => {
    const store = createTestStore(
      {},
      {
        profile: {
          ids: ['tony-user-id'],
          entities: {
            'tony-user-id': {
              id: 'tony-user-id',
              user: 'tony',
              profileInfo: {
                firstName: 'tony',
                lastName: 'stark',
              },
              accounts: ['act-1'],
            },
          },
        },
        bankAccount: {
          ids: ['act-1'],
          entities: {
            'act-1': {
              id: 'act-1',
              name: 'testAccount',
              balance: 'current',
              amount: '000',
              currency: 'euro',
            },
          },
        },
      }
    )
    const profileViewModel = selectProfileViewModel(store.getState())
    expect(profileViewModel).toEqual({
      user: {
        type: 'PROFILE_WITH_ACCOUNTS',
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
    const store = createTestStore(
      {},
      {
        profile: {
          ids: ['tony-user-id'],
          entities: {
            'tony-user-id': {
              id: 'tony-user-id',
              user: 'tony',
              profileInfo: {
                firstName: 'tony',
                lastName: 'stark',
              },
              accounts: ['act-1', 'act-2'],
            },
          },
        },
        bankAccount: {
          ids: ['act-1', 'act-2'],
          entities: {
            'act-1': {
              id: 'act-1',
              name: 'act-1',
              balance: 'current',
              amount: '000',
              currency: 'euro',
            },
            'act-2': {
              id: 'act-2',
              name: 'act-2',
              balance: 'current',
              amount: '100',
              currency: 'dollar',
            },
          },
        },
      }
    )
    const profileViewModel = selectProfileViewModel(store.getState())
    expect(profileViewModel).toEqual({
      user: {
        type: 'PROFILE_WITH_ACCOUNTS',
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
