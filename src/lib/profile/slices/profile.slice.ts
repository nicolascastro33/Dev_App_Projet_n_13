import { EntityState, createSlice, isAnyOf } from '@reduxjs/toolkit'
import {
  getAuthUserProfilePending,
  getAuthInfoProfileUser,
} from '../usecases/get-auth-info-profile-user'
import { Profile, profileAdapter } from '../model/profile.entity'
import { RootState } from '../../create-store'
import { mockData } from '../../../Mock/data'
import {
  getAuthUserProfilePendingDuringUpdate,
  updateInfoProfile,
} from '../usecases/update-info-profile-user'

export type ProfileSliceState = EntityState<Profile> & {
  loadingProfileByUser: { [userId: string]: boolean }
}

export const profileSlice = createSlice({
  name: 'profile',
  initialState: profileAdapter.getInitialState({
    loadingProfileByUser: {},
  }) as ProfileSliceState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(getAuthUserProfilePending, (state, action) => {
        setUserProfileInfoLoadingState(state, {
          userId: action.payload.userId,
          loading: true,
        })
      })
      .addCase(getAuthUserProfilePendingDuringUpdate, (state, action) => {
        setUserProfileInfoLoadingState(state, {
          userId: action.payload?.userId,
          loading: true,
        })
      })
      .addCase(updateInfoProfile.fulfilled, (state, action) => {
        const user = action.payload
        profileAdapter.updateOne(state, {
          id: user.userId,
          changes: {
            firstName: user.firstName,
            lastName: user.lastName,
          },
        })
        setUserProfileInfoLoadingState(state, {
          userId: user.userId,
          loading: false,
        })
      })
      .addMatcher(
        isAnyOf(getAuthInfoProfileUser.fulfilled),
        (state, action) => {
          const user = action.payload
          profileAdapter.addOne(state, {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            accounts: mockData.accounts.map((m) => m.id),
          })
          setUserProfileInfoLoadingState(state, {
            userId: user.id,
            loading: false,
          })
        }
      )
  },
})

const setUserProfileInfoLoadingState = (
  state: ProfileSliceState,
  { userId, loading }: { userId: string; loading: boolean }
) => {
  state.loadingProfileByUser[userId] = loading
}

export const selectProfileInfo = (userId: string, state: RootState) =>
  profileAdapter.getSelectors().selectById(state.profile.info, userId)

export const selectUserFirstName = (userId: string, state: RootState) =>
  profileAdapter.getSelectors().selectById(state.profile.info, userId)?.firstName

export const selectIsUserProfileLoading = (userId: string, state: RootState) =>
  state.profile.info.loadingProfileByUser[userId] ?? false

export const selectProfileForUser = (userId: string, state: RootState) =>
  profileAdapter
    .getSelectors()
    .selectAll(state.profile.info)
    .find((t) => t.id === userId)
