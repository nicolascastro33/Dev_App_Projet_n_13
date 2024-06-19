import { EntityState, createSlice, isAnyOf } from '@reduxjs/toolkit'
import {
  getAuthUserProfilePending,
  getAuthInfoProfileUser,
} from '../usecases/get-auth-info-profile-user'
import { User, userAdapter } from '../model/user.entity'
import { RootState } from '../../create-store'
import { mockData } from '../../../Mock/data'
import { getAuthUserProfilePendingDuringUpdate, updateInfoProfile } from '../usecases/update-info-profile-user'

export type ProfileSliceState = EntityState<User> & {
  loadingProfileByUser: { [userId: string]: boolean }
}

export const profileSlice = createSlice({
  name: 'profile',
  initialState: userAdapter.getInitialState({
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
        userAdapter.updateOne(state, {
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
          userAdapter.addOne(state, {
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

export const selectUserInfo = (userId: string, state: RootState) =>
  userAdapter.getSelectors().selectById(state.user.profile, userId)

export const selectIsUserProfileLoading = (userId: string, state: RootState) =>
  state.user.profile.loadingProfileByUser[userId] ?? false

export const selectProfileForUser = (userId: string, state: RootState) =>
  userAdapter
    .getSelectors()
    .selectAll(state.user.profile)
    .find((t) => t.id === userId)
