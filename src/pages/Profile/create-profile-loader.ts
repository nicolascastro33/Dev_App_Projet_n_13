import { AppStore } from '../../lib/create-store'
import { LoaderFunction } from 'react-router-dom'
import { getInfoProfileUser } from '../../lib/user/usecases/get-info-profile-user'

export const createProfileLoader =
  ({ store }: { store: AppStore }): LoaderFunction =>
  () => {
    store.dispatch(getInfoProfileUser())
    return null
  }
