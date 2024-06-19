import { AppStore } from '../../create-store'
import { AuthGateway } from '../model/auth.gateway'
import { userAuthenticated } from '../reducer'

export const onAuthStateChangedListener = ({
  store,
  authGateway,
}: {
  store: AppStore
  authGateway: AuthGateway
}) => {
  authGateway.onAuthStateChanged((user) => {
    store.dispatch(userAuthenticated({ authUserToken: user }))
  })
}
