import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

import Header from "./Header";

import "../styles/dashboard.scss";

import { userSelector } from "../../auth/selectors/authSelector";

const ProtectedLayout = ({ children }) => {
    const user = useSelector(userSelector);

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
