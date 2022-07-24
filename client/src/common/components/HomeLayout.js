import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { userSelector } from "../../auth/selectors/authSelector";

const HomeLayout = ({ children }) => {
    const user = useSelector(userSelector);

    if (user.authToken) {
        return <Navigate to="/dashboard" />;
    }

    return (
        <div>
            <Outlet />
        </div>
    );
};

export default HomeLayout;
