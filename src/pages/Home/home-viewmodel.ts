import { selectAuthUserId } from '../../lib/auth/reducer'
import { RootState } from '../../lib/create-store'
import { selectAccounts } from '../../lib/user/slices/bank.accounts.slice'
import {
  selectIsUserProfileLoading,
  selectProfileForUser,
} from '../../lib/user/slices/profile.slice'

export enum ViewModelType {
  NoProfile = 'NO_PROFILE',
  LoadingAccount = 'LOADING_ACCOUNT',
  UpdateInfoProfile = 'UPDATE_INFO_PROFILE',
  EmptyProfile = 'EMPTY_PROFILE',
  WithAccounts = 'PROFILE_WITH_ACCOUNTS',
}

export type ViewModel = {
  user:
    | {
        type: ViewModelType.NoProfile
      }
    | {
        type: ViewModelType.LoadingAccount
        accountInfo: string
      }
    | {
        type: ViewModelType.EmptyProfile
        accountInfo: string
        firstName: string
        lastName: string
      }
    | {
        type: ViewModelType.WithAccounts
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
      | {
        type: ViewModelType.UpdateInfoProfile
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

export const selectHomeViewModel = (rootState: RootState): ViewModel => {
  const authUser = selectAuthUserId(rootState)
  const profile = selectProfileForUser(authUser, rootState)
  const isUserProfileLoading = selectIsUserProfileLoading(authUser, rootState)

  if (isUserProfileLoading) {
    console.log(profile)
    return {
      user: {
        type: ViewModelType.LoadingAccount,
        accountInfo: 'Loading...',
      },
    }
  }

  if (!profile) {
    return {
      user: {
        type: ViewModelType.NoProfile,
      },
    }
  }

  if (profile.accounts.length === 0) {
    return {
      user: {
        type: ViewModelType.EmptyProfile,
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

  if (isUserProfileLoading && profile) {
    return {
      user: {
        type: ViewModelType.UpdateInfoProfile,
        accountInfo,
        firstName: profile.firstName,
        lastName: profile.lastName,
      },
    }
  }

  return {
    user: {
      type: ViewModelType.WithAccounts,
      accountInfo,
      firstName: profile.firstName,
      lastName: profile.lastName,
    },
  }
}
