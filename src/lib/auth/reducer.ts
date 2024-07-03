import { createAction, createReducer } from '@reduxjs/toolkit'
import { RootState } from '../create-store'
import { authenticateWithApi } from './usecases/authenticate-with-api.usecase'
import { authenticatedUserLogOut } from '../common/usecases/authenticatedUserLogOut'

export type AuthState = {
  authUserToken?: string | undefined
  userId?: string | undefined
}

export const userAuthenticated = createAction<{
  authUserToken: string | undefined
}>('auth/userAuthenticated')

export const reducer = createReducer<AuthState>(
  {
    authUserToken: undefined,
  },
  (builder) => {
    builder
      .addCase(userAuthenticated, (state, action) => {
        if (action.payload.authUserToken) {
          state.authUserToken = action.payload.authUserToken
        }
      })
      .addCase(authenticateWithApi.fulfilled, (state, action) => {
        if (action.payload?.token) {
          state.authUserToken = action.payload.token
        }
      })
      .addCase(authenticatedUserLogOut.fulfilled, (state) => {
        state.authUserToken = undefined
      })
      .addCase(authenticateWithApi.rejected, (state) => {
        state.authUserToken = undefined
      })
  }
)

export const selectIsUserAuthenticated = (rootState: RootState) =>
  rootState.auth.authUserToken !== undefined

export const selectAuthUserToken = (rootState: RootState) =>
  rootState.auth.authUserToken ?? ''
