import { selectAllBankAccount } from '../../lib/account/slices/bank-account-info'
import { selectAuthUserId } from '../../lib/auth/reducer'
import { RootState } from '../../lib/create-store'
import {
  selectIsUserProfileLoading,
  selectProfileForUser,
} from '../../lib/profile/slices/profile.slice'

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
  const accounts = selectAllBankAccount(rootState)
  const isUserProfileLoading = selectIsUserProfileLoading(authUser, rootState)

  if (isUserProfileLoading) {
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

  if (!accounts) {
    return {
      user: {
        type: ViewModelType.EmptyProfile,
        accountInfo: 'There is no account yet ',
        firstName: profile.firstName,
        lastName: profile.lastName,
      },
    }
  }

  if (isUserProfileLoading && profile) {
    return {
      user: {
        type: ViewModelType.UpdateInfoProfile,
        accountInfo: accounts,
        firstName: profile.firstName,
        lastName: profile.lastName,
      },
    }
  }

  return {
    user: {
      type: ViewModelType.WithAccounts,
      accountInfo: accounts,
      firstName: profile.firstName,
      lastName: profile.lastName,
    },
  }
}
