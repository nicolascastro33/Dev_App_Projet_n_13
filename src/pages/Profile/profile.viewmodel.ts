import { RootState } from '../../lib/create-store'
import { selectAccounts } from '../../lib/user/slices/bank.accounts.slice'
import { selectUserInfo } from '../../lib/user/slices/profile.slice'

export enum ProfileViewModelType {
  NoProfile = 'NO_PROFILE',
  EmptyProfile = 'EMPTY_PROFILE',
  WithAccounts = 'PROFILE_WITH_ACCOUNTS',
}

export const selectProfileViewModel = (
  rootState: RootState
): {
  user:
    | {
        type: ProfileViewModelType.NoProfile
      }
    | {
        type: ProfileViewModelType.EmptyProfile
        accountInfo: string
        profileInfo: {
          firstName: string
          lastName: string
        }
      }
    | {
        type: ProfileViewModelType.WithAccounts
        accountInfo: {
          id: string
          name: string
          balance: string
          amount: string
          currency: string
        }[]
        profileInfo: {
          firstName: string
          lastName: string
        }
      }
} => {
  const profile = selectUserInfo('tony-user-id', rootState)

  if (!profile) {
    return {
      user: {
        type: ProfileViewModelType.NoProfile,
      },
    }
  }

  if (profile.accounts.length === 0) {
    return {
      user: {
        type: ProfileViewModelType.EmptyProfile,
        accountInfo: 'There is no account yet ',
        profileInfo: {
          firstName: profile.profileInfo.firstName,
          lastName:profile.profileInfo.lastName,
        },
      },
    }
  }

  const accountInfo = selectAccounts(profile.accounts, rootState).map(
    (account) => ({
      id: account!.id,
      name: account!.name,
      balance: account!.balance,
      amount: account!.amount,
      currency: account!.currency,
    })
  )

  return {
    user: {
      type: ProfileViewModelType.WithAccounts,
      accountInfo,
      profileInfo:{
        firstName:profile.profileInfo.firstName,
        lastName:profile.profileInfo.lastName,
      },
    },
  }
}
7
