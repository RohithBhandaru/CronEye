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
                    to="snapshot"
                    className={({ isActive }) => {
                        return ["option-btn", isActive && "active-option-btn"].filter(Boolean).join(" ");
                    }}
                >
                    Snapshot
                </NavLink>
                <NavLink
                    to="logs"
                    className={({ isActive }) => {
                        return ["option-btn", isActive && "active-option-btn"].filter(Boolean).join(" ");
                    }}
                >
                    Logs
                </NavLink>
                <div
                    className="option-btn logout-btn"
                    onClick={() => {
                        localStorage.setItem("authToken", "");
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
