import { User, userAdapter } from './user/model/user.entity'
import { RootState } from './create-store'
import {
  ActionCreatorWithPayload,
  createAction,
  createReducer,
} from '@reduxjs/toolkit'
import { rootReducer } from './root-reducer'
import {
  bankAccountAdapter,
  bankAccounts,
} from './user/model/bank.accounts.entity'

const initialState = rootReducer(undefined, createAction(''))

const withUser = createAction<User>('withUser')
const withLoadingUserOf = createAction<{ user: string }>('withLoadingUserOf')
const withNotLoadingUserOf = createAction<{ user: string }>(
  'withNotLoadingUserOf'
)
const withAccounts = createAction<bankAccounts[]>('withAccounts')
const withAuthUser = createAction<{ authUser: string }>('withAuthUser')
const reducer = createReducer(initialState, (builder) => {
  builder
    .addCase(withAuthUser, (state, action) => {
      state.auth.authUser = action.payload.authUser
    })
    .addCase(withUser, (state, action) => {
      userAdapter.addOne(state.user.profile, action.payload)
    })
    .addCase(withLoadingUserOf, (state, action) => {
      state.user.profile.loadingProfileByUser[action.payload.user] = true
    })
    .addCase(withNotLoadingUserOf, (state, action) => {
      state.user.profile.loadingProfileByUser[action.payload.user] = false
    })
    .addCase(withAccounts, (state, action) => {
      bankAccountAdapter.addMany(state.user.bankAccount, action.payload)
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
