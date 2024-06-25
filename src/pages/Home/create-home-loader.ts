import { AppStore } from '../../lib/create-store'
import { LoaderFunction } from 'react-router-dom'
import { getAuthInfoProfileUser } from '../../lib/user/usecases/get-auth-info-profile-user'

export const createHomeLoader =
    ({ store }: { store: AppStore }): LoaderFunction =>
   async () => {
    if (!store.getState().user.profile.ids.length) {
      await store.dispatch(getAuthInfoProfileUser())
    }
    return null
  }
