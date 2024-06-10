import { AnyAction, ThunkDispatch, configureStore } from '@reduxjs/toolkit'
import { AuthGateway } from './auth/model/auth.gateway'
import { UserGateway } from './user/model/user.gateway'
import { rootReducer } from './root-reducer'
import { FakeAuthGateway } from './auth/infra/fake-auth.gateway'
import { FakeUserGateway } from './user/infra/fake-user.gateway'

export type Dependencies = {
  authGateway: AuthGateway
  userGateway: UserGateway
}

export const createStore = (
  dependencies: Dependencies,
  preloadedState?: Partial<RootState>
) =>
  configureStore({
    reducer: rootReducer,
    middleware(getDefaultMiddleware) {
      return getDefaultMiddleware({
        thunk: {
          extraArgument: dependencies,
        },
      })
    },
    preloadedState,
  })

export const createTestStore = (
  {
    authGateway = new FakeAuthGateway(),
    userGateway = new FakeUserGateway(),
  }: Partial<Dependencies> = {},
  preloadedState?: Partial<ReturnType<typeof rootReducer>>
) =>
  createStore(
    {
      authGateway,
      userGateway,
    },
    preloadedState
  )

export type AppStore = ReturnType<typeof createStore>
export type RootState = ReturnType<typeof rootReducer>
export type AppDispatch = ThunkDispatch<RootState, Dependencies, AnyAction>
