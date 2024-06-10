import { EntityState, createSlice } from '@reduxjs/toolkit'
import {
  getAuthUserProfilePending,
  getInfoProfileUser,
} from '../usecases/get-info-profile-user'
import { User, userAdapter } from '../model/user.entity'
import { RootState } from '../../create-store'

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
    builder.addCase(getAuthUserProfilePending, (state, action) => {
      state.loadingProfileByUser[action.payload.authUser] = true
    })
    builder.addCase(getInfoProfileUser.fulfilled, (state, action) => {
      const user = action.payload
      userAdapter.addOne(state, {
        id: user.id,
        user: user.user,
        profileInfo: {
          firstName: user.profileInfo.firstName,
          lastName: user.profileInfo.lastName,
        },
        accounts: user.accounts.map((m) => m.id),
      })
      state.loadingProfileByUser[user.user] = false
    })
  },
})

export const selectUserInfo = (userId: string, state: RootState) =>
  userAdapter.getSelectors().selectById(state.user.profile, userId)

export const selectIsUserProfileLoading = (user: string, state: RootState) =>
  state.user.profile.loadingProfileByUser[user] ?? false
