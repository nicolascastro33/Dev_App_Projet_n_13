import { createSlice } from "@reduxjs/toolkit";
import { getInfoProfileUser } from "../usecases/get-info-profile-user";
import { userAdapter } from "../model/user.entity";
import { RootState } from "../../create-store";

export const profileSlice = createSlice({
    name: "profile", 
    initialState: userAdapter.getInitialState(),
    reducers: {},
    extraReducers(builder) {
        builder.addCase(getInfoProfileUser.fulfilled, (state, action) => {
            const user = action.payload
            userAdapter.addOne(state, {
                id: user.id,
                user: user.user,
                profileInfo: {
                    firstName: user.profileInfo.firstName,
                    lastName: user.profileInfo.lastName
                },
                accounts:user.accounts.map((m) => m.id),
            })
        })
    }
});

export const selectUserInfo = (userId: string, state: RootState) => userAdapter.getSelectors().selectById(state.profile, userId)