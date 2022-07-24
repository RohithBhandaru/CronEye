import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { userSelector } from "../../auth/selectors/authSelector";

const ProtectedLayout = ({ children }) => {
    const user = useSelector(userSelector);

    if (!user.authToken) {
        return <Navigate to="/auth/login" />;
    }

    return (
        <div>
            <Outlet />
        </div>
    );
};

export default ProtectedLayout;
