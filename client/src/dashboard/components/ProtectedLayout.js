import React, { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";

import Header from "./Header";

import "../styles/dashboard.scss";

import { config } from "../../config/config";
import { userSelector } from "../../auth/selectors/authSelector";
import { updateSettings } from "../slice/dashboardSlice";
import { logoutUser } from "../../auth/slice/authSlice";

const ProtectedLayout = ({ children }) => {
    const dispatch = useDispatch();

    const user = useSelector(userSelector);

    useEffect(() => {
        if (user.authToken) {
            axios
                .get(`${config.dashboard_base_url}/settings`, {
                    headers: {
                        Authorization: `Bearer ${user.authToken}`,
                    },
                })
                .then((response) => {
                    const data = response.data;
                    dispatch(updateSettings(data.data));

                    if (data.data.project_name) {
                        document.title = `CronEye - ${data.data.project_name}`;
                    }
                })
                .catch((err) => {
                    if (
                        (err.response.status === 400 && err.response.data.message === "Provide a valid auth token") ||
                        [401, 403].includes(err.response.status)
                    ) {
                        localStorage.setItem("authToken", "");
                        dispatch(logoutUser());
                    }
                });
        }
    }, [dispatch, user.authToken]);

    if (!user.authToken) {
        return <Navigate to="/auth/login" />;
    }

    return (
        <div className="dashboard-container">
            <Header />
            <Outlet />
        </div>
    );
};

export default ProtectedLayout;
