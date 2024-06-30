import { AppStore } from '../../lib/create-store'
import { LoaderFunction } from 'react-router-dom'
import { getAuthInfoProfileUser } from '../../lib/profile/usecases/get-auth-info-profile-user'
import { getAuthAllBankAccountInfo } from '../../lib/account/usecases/get-auth-all-bank-account-info'

export const createHomeLoader =
  ({ store }: { store: AppStore }): LoaderFunction =>
  async () => {
    if (!store.getState().profile.info.ids.length) {
      await store.dispatch(getAuthInfoProfileUser())
    }
    await store.dispatch(getAuthAllBankAccountInfo())
    return null
  }
