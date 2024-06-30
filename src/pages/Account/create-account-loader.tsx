import { AppStore } from '../../lib/create-store'
import { LoaderFunction } from 'react-router-dom'
import { getAuthBankAccountInfo } from '../../lib/account/usecases/get-auth-account-info-with-id'

export const createAccountLoader =
  ({ store }: { store: AppStore }): LoaderFunction =>
  async ({ params }) => {
    const { id: accountId } = params

    if (accountId && !store.getState().account.info.entities[accountId]) {
      await store.dispatch(getAuthBankAccountInfo({ accountId }))
    }
    
    return null
  }
