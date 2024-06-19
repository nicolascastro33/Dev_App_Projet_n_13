import { selectAuthUserId } from '../../lib/auth/reducer'
import { RootState } from '../../lib/create-store'
import { selectAccounts } from '../../lib/user/slices/bank.accounts.slice'
import {
  selectIsUserProfileLoading,
  selectProfileForUser,
} from '../../lib/user/slices/profile.slice'

export enum HomeViewModelType {
  NoProfile = 'NO_PROFILE',
  LoadingAccount = 'LOADING_ACCOUNT',
  EmptyProfile = 'EMPTY_PROFILE',
  WithAccounts = 'PROFILE_WITH_ACCOUNTS',
}

export type HomeViewModel = {
  user:
    | {
        type: HomeViewModelType.NoProfile
      }
    | {
        type: HomeViewModelType.LoadingAccount
        accountInfo: string
      }
    | {
        type: HomeViewModelType.EmptyProfile
        accountInfo: string
        firstName: string
        lastName: string
      }
    | {
        type: HomeViewModelType.WithAccounts
        accountInfo: {
          id: string
          name: string
          balance: string
          amount: string
          currency: string
        }[]
        firstName: string
        lastName: string
      }
}

export const selectHomeViewModel = (
  rootState: RootState
): HomeViewModel => {
  const authUser = selectAuthUserId(rootState)
  const profile = selectProfileForUser(authUser, rootState)
  const isUserProfileLoading = selectIsUserProfileLoading(authUser, rootState)

  if (isUserProfileLoading) {
    return {
      user: {
        type: HomeViewModelType.LoadingAccount,
        accountInfo: 'Loading...',
      },
    }
  }

  if (!profile) {
    return {
      user: {
        type: HomeViewModelType.NoProfile,
      },
    }
  }

  if (profile.accounts.length === 0) {
    return {
      user: {
        type: HomeViewModelType.EmptyProfile,
        accountInfo: 'There is no account yet ',
        firstName: profile.firstName,
        lastName: profile.lastName,
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
      type: HomeViewModelType.WithAccounts,
      accountInfo,
      firstName: profile.firstName,
      lastName: profile.lastName,
    },
  }
}
7
