import { AppStore } from '../../lib/create-store'
import { LoaderFunction } from 'react-router-dom'
import { getAuthInfoProfileUser } from '../../lib/user/usecases/get-auth-info-profile-user'

export const createHomeLoader =
  ({ store }: { store: AppStore }): LoaderFunction =>
  () => {
    store.dispatch(getAuthInfoProfileUser())
    return null
  }
