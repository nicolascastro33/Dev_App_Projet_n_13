import { AppStore } from '../../lib/create-store'
import { LoaderFunction } from 'react-router-dom'
import { getAuthBankAccountInfo } from '../../lib/account/usecases/get-auth-account-info-with-id'

export const createAccountLoader =
  ({ store }: { store: AppStore }): LoaderFunction =>
  async () => {
    const accountId = window.location.pathname.replace('/account/', '')
    if (!store.getState().account.info.entities[accountId]) {
      console.log('hello')
      await store.dispatch(getAuthBankAccountInfo({accountId}))
    }
    return null
  }
