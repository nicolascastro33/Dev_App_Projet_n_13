import { createSlice } from "@reduxjs/toolkit";
import { getInfoProfileUser } from "../usecases/get-info-profile-user";

type profileState = {
    firstName: string
    lastName: string
    email: string
}

export const profileSlice = createSlice({
    name: "profile", 
    initialState: {} as profileState,
    reducers: {},
    extraReducers(builder) {
        builder.addCase(getInfoProfileUser.fulfilled, (_, action) => {
            return action.payload;
        })
    }
});