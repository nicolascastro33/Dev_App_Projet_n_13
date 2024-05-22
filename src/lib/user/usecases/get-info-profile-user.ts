import { createAppAsyncThunk } from "../../create-app-thunk";

export const getInfoProfileUser =  createAppAsyncThunk(
    "user/getInfoProfileUser", 
    async (_, {extra: {authGateway, userGateway}}) => {
        const authUser = authGateway.getAuthUser();
        const {userInfo} = await userGateway.getInfoProfileUser({userId:authUser})
        return userInfo
    }
)