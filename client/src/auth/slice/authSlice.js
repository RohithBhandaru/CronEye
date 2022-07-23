import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name: "auth",
    initialState: {
        user: {
            email: "",
            isAuthenticated: false,
            authToken: "",
        },
        serverMessageType: "",
        serverMessage: "",
        loginForm: {
            email: "",
            password: "",
        },
    },
    reducers: {
        updateAuthForm(state, action) {},
        updateAuthFormSubmitStatus(state, action) {},
        loginUser(state, action) {},
        logoutUser(state, action) {},
        updateServerMessage(state, action) {},
    },
});

const { actions, reducer } = authSlice;
export const { updateAuthForm, updateAuthFormSubmitStatus, loginUser, logoutUser, updateServerMessage } = actions;
export default reducer;
