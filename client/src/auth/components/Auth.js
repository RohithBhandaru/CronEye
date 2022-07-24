import React from "react";
import { useParams } from "react-router-dom";

import Login from "./Login.js";

import "../styles/styles.scss";
import LogoNoName from "../../assets/icons/logo--no-name.svg";

const Auth = (props) => {
    let { action } = useParams();

    // Switch component based on url
    const switchComponent = (action) => {
        switch (action) {
            default:
                return <Login />;
        }
    };

    return (
        <div className="auth-page-container">
            <div className="auth-title">
                <div id="croneye">
                    <img src={LogoNoName} className="auth__logo" alt="APSEye" align="middle" />
                    <div className="croneye-title">CronEye</div>
                    <div className="prod-description">Better track your APS cron jobs</div>
                </div>
            </div>

            {switchComponent(action)}
        </div>
    );
};

export default Auth;
