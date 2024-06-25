import {
  AnyAction,
  Middleware,
  ThunkDispatch,
  configureStore,
} from '@reduxjs/toolkit'
import { AuthGateway } from './auth/model/auth.gateway'
import { UserGateway } from './user/model/user.gateway'
import { AccountGateway } from './account/model/account.gateway'

import { rootReducer } from './root-reducer'

import { FakeAuthGateway } from './auth/infra/fake-auth.gateway'
import { FakeUserGateway } from './user/infra/fake-user.gateway'

import { onAuthStateChangedListener } from './auth/listeners/on-auth-state-changed.listener'
import { FakeAccountGateway } from './account/infra/fake-account.gateway'

export type Dependencies = {
  authGateway: AuthGateway
  userGateway: UserGateway
  accountGateway: AccountGateway
}

export const createStore = (
  dependencies: Dependencies,
  preloadedState?: Partial<RootState>
) => {
  const actions: AnyAction[] = []
  const logActionsMiddleware: Middleware = () => (next) => (action) => {
    actions.push(action)
    return next(action)
  }
  const store = configureStore({
    reducer: rootReducer,
    middleware(getDefaultMiddleware) {
      return getDefaultMiddleware({
        thunk: {
          extraArgument: dependencies,
        },
      }).prepend(logActionsMiddleware)
    },
    preloadedState,
  })

  onAuthStateChangedListener({ store, authGateway: dependencies.authGateway })
  return {
    ...store,
    getActions() {
      return actions
    },
  }
}

export const createTestStore = (
  {
    authGateway = new FakeAuthGateway(),
    userGateway = new FakeUserGateway(),
    accountGateway = new FakeAccountGateway(),
  }: Partial<Dependencies> = {},
  preloadedState?: Partial<ReturnType<typeof rootReducer>>
) =>
  createStore(
    {
      authGateway,
      userGateway,
      accountGateway,
    },
    preloadedState
  )

type AppStoreWithGetActions = ReturnType<typeof createStore>
export type AppStore = Omit<AppStoreWithGetActions, 'getActions'>
export type RootState = ReturnType<typeof rootReducer>
export type AppDispatch = ThunkDispatch<RootState, Dependencies, AnyAction>
