import { createSlice, isAnyOf } from '@reduxjs/toolkit'
import { RootState } from '../../create-store'
import { getAuthInfoProfileUser } from '../usecases/get-auth-info-profile-user'
import { bankAccountAdapter } from '../model/bank.accounts.entity'
import { mockData } from '../../../Mock/data'

export const bankAccountSlice = createSlice({
  name: 'bankAccount',
  initialState: bankAccountAdapter.getInitialState(),
  reducers: {},
  extraReducers(builder) {
    builder
      .addMatcher(
        isAnyOf(getAuthInfoProfileUser.fulfilled),(state) => {
        bankAccountAdapter.addMany(state, mockData.accounts)

      })
  },
})

export const selectAccount = (id: string, state: RootState) =>
  bankAccountAdapter.getSelectors().selectById(state.user.bankAccount, id)

export const selectAccounts = (ids: string[], state: RootState) =>
  ids.map((id) => selectAccount(id, state)).filter(Boolean)
