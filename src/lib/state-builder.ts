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
const withLoadingUserOf = createAction<{ userId: string }>('withLoadingUserOf')
const withNotLoadingUserOf = createAction<{ userId: string }>(
  'withNotLoadingUserOf'
)
const withAccounts = createAction<bankAccounts[]>('withAccounts')
const withAuthUser = createAction<{ authUser: string, userId:string }>('withAuthUser')
const reducer = createReducer(initialState, (builder) => {
  builder
    .addCase(withAuthUser, (state, action) => {
      state.auth.authUserToken = action.payload.authUser
      state.auth.userId = action.payload.userId
    })
    .addCase(withUser, (state, action) => {
      userAdapter.addOne(state.user.profile, action.payload)
    })
    .addCase(withLoadingUserOf, (state, action) => {
      state.user.profile.loadingProfileByUser[action.payload.userId] = true
    })
    .addCase(withNotLoadingUserOf, (state, action) => {
      state.user.profile.loadingProfileByUser[action.payload.userId] = false
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
