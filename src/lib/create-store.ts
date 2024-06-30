import {
  AnyAction,
  Middleware,
  ThunkDispatch,
  configureStore,
} from '@reduxjs/toolkit'
import { AuthGateway } from './auth/model/auth.gateway'
import { ProfileGateway } from './profile/model/profile.gateway'
import { AccountGateway } from './account/model/account.gateway'

import { rootReducer } from './root-reducer'

import { FakeAuthGateway } from './auth/infra/fake-auth.gateway'
import { FakeProfileGateway } from './profile/infra/fake-profile.gateway'

import { onAuthStateChangedListener } from './auth/listeners/on-auth-state-changed.listener'
import { FakeAccountGateway } from './account/infra/fake-account.gateway'
import { TransactionsGateway } from './transactions/model/transactions.gateway'
import { FakeTransactionsGateway } from './transactions/infra/fake-transactions.gateway'

export type Dependencies = {
  authGateway: AuthGateway
  profileGateway: ProfileGateway
  accountGateway: AccountGateway
  transactionsGateway: TransactionsGateway
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
    profileGateway = new FakeProfileGateway(),
    accountGateway = new FakeAccountGateway(),
    transactionsGateway = new FakeTransactionsGateway(),
  }: Partial<Dependencies> = {},
  preloadedState?: Partial<ReturnType<typeof rootReducer>>
) =>
  createStore(
    {
      authGateway,
      profileGateway,
      accountGateway,
      transactionsGateway,
    },
    preloadedState
  )

type AppStoreWithGetActions = ReturnType<typeof createStore>
export type AppStore = Omit<AppStoreWithGetActions, 'getActions'>
export type RootState = ReturnType<typeof rootReducer>
export type AppDispatch = ThunkDispatch<RootState, Dependencies, AnyAction>
