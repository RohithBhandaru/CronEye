import React from "react";
import { NavLink } from "react-router-dom";

import LogoNoName from "../../assets/icons/logo--no-name.svg";

const SideNav = () => {
    return (
        <div className="header-container">
            <div className="logo-container">
                <img src={LogoNoName} alt="CronEye" align="middle" width={"25"} height={"25"} />
                <text className="logo-name">CronEye</text>
            </div>

            <div className="options-list">
                <NavLink
                    to="/dashboard"
                    className={({ isActive }) => {
                        console.log(isActive);
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
                <NavLink to="/auth/logout" className="option-btn logout-btn">
                    Logout
                </NavLink>
            </div>
        </div>
    );
};

export default SideNav;
