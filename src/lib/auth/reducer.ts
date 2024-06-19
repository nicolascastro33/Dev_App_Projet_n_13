import { createAction, createReducer } from '@reduxjs/toolkit'
import { RootState } from '../create-store'
import { authenticateWithApi } from './usecases/authenticate-with-api.usecase'
import { authenticatedUserLogOut } from './usecases/authenticatedUserLogOut'

export type AuthState = {
  authUserToken?: string | undefined
  userId?: string | undefined
}

export const userAuthenticated = createAction<{
  authUserToken: string | undefined
  userId?: string | undefined
}>('auth/userAuthenticated')

export const reducer = createReducer<AuthState>(
  {
    authUserToken: undefined,
    userId: undefined,
  },
  (builder) => {
    builder
      .addCase(userAuthenticated, (state, action) => {
        if (action.payload.authUserToken) {
          state.authUserToken = action.payload.authUserToken
          state.userId = action.payload.userId
        }
      })
      .addCase(authenticateWithApi.fulfilled, (state, action) => {
        if (action.payload?.token) {
          state.authUserToken = action.payload.token
          state.userId = action.payload.userId
        }
      })
      .addCase(authenticatedUserLogOut.fulfilled, (state) => {
        state.authUserToken = undefined
        state.userId = undefined
      })
  }
)

export const selectIsUserAuthenticated = (rootState: RootState) =>
  rootState.auth.authUserToken !== undefined

export const selectAuthUserId = (rootState: RootState) =>
  rootState.auth.userId ?? ''

export const selectAuthUserToken = (rootState: RootState) =>
  rootState.auth.authUserToken ?? ''
