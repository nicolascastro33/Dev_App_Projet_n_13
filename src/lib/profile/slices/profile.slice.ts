import { EntityState, createSlice, isAnyOf } from '@reduxjs/toolkit'
import {
  getAuthUserProfilePending,
  getAuthInfoProfileUser,
} from '../usecases/get-auth-info-profile-user'
import { Profile } from '../model/profile.entity'
import { RootState } from '../../create-store'
import { updateInfoProfile } from '../usecases/update-info-profile-user'
import { authenticatedUserLogOut } from '../../common/usecases/authenticatedUserLogOut'

export type ProfileSliceState = EntityState<Profile> & {
  firstName: undefined | string
  lastName: undefined | string
  loadingProfileByUser: boolean
}

export const profileSlice = createSlice({
  name: 'profile',
  initialState: {
    firstName: undefined,
    lastName: undefined,
    loadingProfileByUser: false,
  } as ProfileSliceState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(getAuthUserProfilePending, (state) => {
        setUserProfileInfoLoadingState(state, {
          loading: true,
        })
      })
      .addCase(updateInfoProfile.fulfilled, (state, action) => {
        state.firstName = action.payload.firstName
        state.lastName = action.payload.lastName
        setUserProfileInfoLoadingState(state, {
          loading: false,
        })
      })
      .addCase(authenticatedUserLogOut.fulfilled, (state) => {
        state.firstName = undefined
        state.lastName = undefined
        state.loadingProfileByUser = false
      })
      .addMatcher(
        isAnyOf(getAuthInfoProfileUser.fulfilled),
        (state, action) => {
          if (action.payload) {
            state.firstName = action.payload.firstName
            state.lastName = action.payload.lastName
          }
          setUserProfileInfoLoadingState(state, {
            loading: false,
          })
        }
      )
  },
})

const setUserProfileInfoLoadingState = (
  state: ProfileSliceState,
  { loading }: { loading: boolean }
) => {
  state.loadingProfileByUser = loading
}

export const selectProfileInfo = (state: RootState) =>
  state.profile.info ?? undefined

export const selectUserFirstName = (state: RootState) =>
  state.profile.info.firstName
export const selectUserLastName = (state: RootState) =>
  state.profile.info.lastName

export const selectIsUserProfileLoading = (state: RootState) =>
  state.profile.info.loadingProfileByUser ?? false
