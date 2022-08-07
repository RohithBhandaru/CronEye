import React from "react";
import { useDispatch } from "react-redux";
import { NavLink } from "react-router-dom";

import LogoNoName from "../../assets/icons/logo--no-name.svg";
import { logoutUser } from "../../auth/slice/authSlice";

const SideNav = () => {
    const dispatch = useDispatch();
    return (
        <div className="header-container">
            <div className="logo-container">
                <img src={LogoNoName} alt="CronEye" align="middle" width={"25"} height={"25"} />
                <div className="logo-name">CronEye</div>
            </div>

            <div className="options-list">
                <NavLink
                    to="/dashboard"
                    className={({ isActive }) => {
                        return ["option-btn", isActive && "active-option-btn"].filter(Boolean).join(" ");
                    }}
                >
                    Dashboard
                </NavLink>
                <NavLink
                    to="/dashbaord/jobs"
                    className={({ isActive }) =>
                        ["option-btn", isActive && "active-option-btn"].filter(Boolean).join(" ")
                    }
                >
                    Jobs
                </NavLink>
                <div
                    className="option-btn logout-btn"
                    onClick={() => {
                        localStorage.setItem("authToken", "")
                        dispatch(logoutUser());
                    }}
                >
                    Logout
                </div>
            </div>
        </div>
    );
};

export default SideNav;
