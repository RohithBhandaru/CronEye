import { configureStore } from "@reduxjs/toolkit";

import authReducer from "../auth/slice/authSlice";
import dashboardReducer from "../dashboard/slice/dashboardSlice";

const store = configureStore({
    reducer: {
        auth: authReducer,
        dashboard: dashboardReducer,
    },
});

export default store;
