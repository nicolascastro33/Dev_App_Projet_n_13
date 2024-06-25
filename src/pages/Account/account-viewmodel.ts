import {
  selectBankAccountInfo,
  selectIsBankAccountInfoLoading,
} from '../../lib/account/slices/bank-account-info'
import { RootState } from '../../lib/create-store'



export enum ViewModelType {
  NoAccount = 'NO_PROFILE',
  LoadingAccount = 'LOADING_ACCOUNT',
  NoTransactions = 'NO_TRANSACTIONS',
  WithTransactions = 'PROFILE_WITH_TRANSACTIONS',
}

export type ViewModel = {
  account:
    | {
        type: ViewModelType.NoAccount
      }
    | {
        type: ViewModelType.LoadingAccount
        accountInfo: string
      }
    | {
        type: ViewModelType.NoTransactions
        accountInfo: {
          name: string
          amount: string
          currency: string
          balance: string
        }
        transactions: string
      }
    | {
        type: ViewModelType.WithTransactions
        accountInfo: {
          name: string
          amount: string
          currency: string
          balance: string
        }
        transactions: {
          date: string
          description: string
        }[]
      }
}

export const selectAccountViewModel = (rootState: RootState): ViewModel => {
  const accountId = window.location.pathname.replace('/account/', '')
  const account = selectBankAccountInfo(accountId, rootState)
  const IsBankAccountInfoLoading = selectIsBankAccountInfoLoading(
    accountId,
    rootState
  )

  if (IsBankAccountInfoLoading) {
    return {
      account: {
        type: ViewModelType.LoadingAccount,
        accountInfo: 'Loading...',
      },
    }
  }

  if (!account) {
    return {
      account: {
        type: ViewModelType.NoAccount,
      },
    }
  }

  if (account.transactions.length === 0) {
    return {
      account: {
        type: ViewModelType.NoTransactions,
        accountInfo: {
          name: account.name,
          amount: account.amount,
          currency: account.currency,
          balance: account.balance,
        },
        transactions: 'No transactions for the moment.',
      },
    }
  }

  return {
    account: {
      type: ViewModelType.WithTransactions,
      accountInfo: {
        name: account.name,
        amount: account.amount,
        currency: account.currency,
        balance: account.balance,
      },
      transactions: account.transactions
    },
  }
}
