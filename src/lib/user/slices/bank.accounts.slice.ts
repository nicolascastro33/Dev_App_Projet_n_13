import { createSlice } from '@reduxjs/toolkit'
import { RootState } from '../../create-store'
import { getInfoProfileUser } from '../usecases/get-info-profile-user'
import { bankAccountAdapter } from '../model/bank.accounts.entity'

export const bankAccountSlice = createSlice({
  name: 'bankAccount',
  initialState: bankAccountAdapter.getInitialState(),
  reducers: {},
  extraReducers(builder) {
    builder.addCase(getInfoProfileUser.fulfilled, (state, action) => {
      bankAccountAdapter.addMany(state, action.payload.accounts)
    })
  },
})

export const selectAccount = (id: string, state: RootState) => bankAccountAdapter.getSelectors().selectById(state.bankAccount, id)

export const selectAccounts = (ids: string[], state:RootState) => ids.map((id) => selectAccount(id, state)).filter(Boolean)