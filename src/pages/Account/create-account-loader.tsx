import { AppStore } from '../../lib/create-store'
import { LoaderFunction } from 'react-router-dom'
import { getAuthBankAccountInfo } from '../../lib/account/usecases/get-auth-account-info-with-id'
import { getAuthAllTransactionsInfo } from '../../lib/transactions/usecases/get-auth-transactions-info-with-id'
import { selectAllTransactionsFromOneAccount } from '../../lib/transactions/slices/bank-transactions-info'

export const createAccountLoader =
  ({ store }: { store: AppStore }): LoaderFunction =>
  async ({ params }) => {
    const { id: accountId } = params
    if (accountId) {
      if (!store.getState().account.info.entities[accountId]) {
        await store.dispatch(getAuthBankAccountInfo({ accountId }))
      }

      const allTransactions = selectAllTransactionsFromOneAccount(
        accountId,
        store.getState()
      )

      if (allTransactions.length === 0) {
        await store.dispatch(getAuthAllTransactionsInfo({ accountId }))
      }
    }

    // How to use it on the front for updating info 
    // await store.dispatch(
    //   updateTransactionInfo({
    //     type: 'category',
    //     transactionId: 'cnt-2-tst-2',
    //     newInfo: 'testInfo',
    //   })
    // )

    return null
  }
