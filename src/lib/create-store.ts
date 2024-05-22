import { AnyAction, ThunkDispatch, configureStore } from "@reduxjs/toolkit";
import { profileSlice } from "./user/slices/profile.slice";
import { AuthGateway } from "./auth/model/auth.gateway";
import { UserGateway } from "./user/model/user.gateway";

export type Dependencies = {
    authGateway: AuthGateway
    userGateway: UserGateway
}

const rootReducer = profileSlice.reducer

export const createStore = (dependencies: Dependencies) =>
    configureStore({
        reducer:rootReducer,
        middleware(getDefaultMiddleware){
            return getDefaultMiddleware({
                thunk:{
                    extraArgument:dependencies,
                },
            })
        }
    })

export type AppStore = ReturnType<typeof createStore>;
export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = ThunkDispatch<RootState, Dependencies, AnyAction>;
