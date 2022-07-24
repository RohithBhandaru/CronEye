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
        updateAuthForm(state, action) {
            const { form, name, value } = action.payload;
            state[form][name] = value;
        },
        clearAuthForm(state, action) {
            state.loginForm.email = "";
            state.loginForm.password = "";
        },
        loginUser(state, action) {
            const { email, authToken } = action.payload;
            state.user.email = email;
            state.user.isAuthenticated = true;
            state.user.authToken = authToken;
        },
        logoutUser(state, action) {
            state.user = {
                email: "",
                isAuthenticated: false,
                authToken: "",
            };
            state.serverMessage = "";
            state.serverMessageType = "";
        },
        updateServerMessage(state, action) {
            const { serverMessageType, serverMessage } = action.payload;
            state.serverMessageType = serverMessageType;
            state.serverMessage = serverMessage;
        },
    },
});

const { actions, reducer } = authSlice;
export const { updateAuthForm, clearAuthForm, updateAuthFormSubmitStatus, loginUser, logoutUser, updateServerMessage } =
    actions;
export default reducer;
