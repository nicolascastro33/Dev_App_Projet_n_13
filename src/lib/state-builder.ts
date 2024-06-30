import { Profile, profileAdapter } from './user/model/profile.entity'
import { RootState } from './create-store'
import {
  ActionCreatorWithPayload,
  createAction,
  createReducer,
} from '@reduxjs/toolkit'
import { rootReducer } from './root-reducer'
import { Account, accountAdapter } from './account/model/account.entity'

const initialState = rootReducer(undefined, createAction(''))

const withUser = createAction<Profile>('withUser')
const withLoadingUserOf = createAction<{ userId: string }>('withLoadingUserOf')
const withNotLoadingUserOf = createAction<{ userId: string }>(
  'withNotLoadingUserOf'
)
const withAccounts = createAction<Account[]>('withAccounts')
const withAuthUser = createAction<{ authUser: string; userId: string }>(
  'withAuthUser'
)
const reducer = createReducer(initialState, (builder) => {
  builder
    .addCase(withAuthUser, (state, action) => {
      state.auth.authUserToken = action.payload.authUser
      state.auth.userId = action.payload.userId
    })
    .addCase(withUser, (state, action) => {
      profileAdapter.addOne(state.profile.info, action.payload)
    })
    .addCase(withLoadingUserOf, (state, action) => {
      state.profile.info.loadingProfileByUser[action.payload.userId] = true
    })
    .addCase(withNotLoadingUserOf, (state, action) => {
      state.profile.info.loadingProfileByUser[action.payload.userId] = false
    })
    .addCase(withAccounts, (state, action) => {
      accountAdapter.addMany(state.account.info, action.payload)
    })
})

export const stateBuilder = (baseState = initialState) => {
  const reduce =
    <P>(actionCreator: ActionCreatorWithPayload<P>) =>
    (payload: P) =>
      stateBuilder(reducer(baseState, actionCreator(payload)))

  return {
    withAuthUser: reduce(withAuthUser),
    withUser: reduce(withUser),
    withLoadingUserOf: reduce(withLoadingUserOf),
    withNotLoadingUserOf: reduce(withNotLoadingUserOf),
    withAccounts: reduce(withAccounts),
    build(): RootState {
      return baseState
    },
  }
}
