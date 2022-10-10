import React, { useState } from "react";
import { connect, useDispatch } from "react-redux";
import axios from "axios";

import FlashMessage from "../../common/components/FlashMessage.js";

import EmailIcon from "../../assets/icons/EmailIcon.js";
import PasswordIcon from "../../assets/icons/PasswordIcon.js";

import { loginUser, updateAuthForm, clearAuthForm, updateServerMessage } from "../slice/authSlice";

import {config} from "../../config/config.js";

// Accessible part of the state
const mapStateToProps = (state) => {
    return {
        auth: state.auth,
    };
};

const Login = (props) => {
    const [isLoading, setIsLoading] = useState(false);
    const [emailEmpty, setEmailEmpty] = useState(false);
    const [passwordEmpty, setPasswordEmpty] = useState(false);
    const [flash, toggleFlash] = useState(true);

    const dispatch = useDispatch();
    const handleChange = (e) => {
        dispatch(
            updateAuthForm({
                form: "loginForm",
                name: e.target.name,
                value: e.target.value,
            })
        );
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!props.auth.loginForm.email || !props.auth.loginForm.password) {
            setEmailEmpty(!props.auth.loginForm.email ? true : false);
            setPasswordEmpty(!props.auth.loginForm.password ? true : false);
        } else {
            setIsLoading(true);
            setEmailEmpty(false);
            setPasswordEmpty(false);
            axios
                .post(`${config.auth_base_url}/login`, {
                    email: props.auth.loginForm.email,
                    password: props.auth.loginForm.password,
                })
                .then((response) => {
                    const data = response.data;
                    localStorage.setItem("authToken", data.auth_token);
                    dispatch(loginUser({ email: props.auth.loginForm.email, authToken: data.auth_token }));
                    dispatch(updateServerMessage({ serverMessageType: data.status, serverMessage: data.message }));
                    dispatch(clearAuthForm());
                })
                .catch((err) => {
                    toggleFlash(true);
                    dispatch(
                        updateServerMessage({
                            serverMessageType: err.response.data.status,
                            serverMessage: err.response.data.message,
                        })
                    );
                });
        }
    };

    return (
        <div className="auth-main-container">
            {props.auth.serverMessageType === "failure" && props.auth.serverMessage && (
                <FlashMessage
                    flash={flash}
                    toggleFlash={toggleFlash}
                    serverMessageType={props.auth.serverMessageType}
                    serverMessage={props.auth.serverMessage}
                />
            )}
            <div className="auth-box-container">
                <p className="auth-form-title">Login</p>

                <form className="form__login" noValidate onSubmit={handleSubmit}>
                    <div className="form-field-title-div form-field-title">
                        <div className="form-field-title">Email</div>
                        <div style={{ color: "red" }}>*</div>
                    </div>
                    <div className="form-field-box form-input">
                        <div className="auth-icons">
                            <EmailIcon color={emailEmpty ? "red" : "black"} width={23} height={23} />
                        </div>
                        <input
                            className="form-input"
                            name="email"
                            type="text"
                            value={props.auth.loginForm.email}
                            required
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-field-title-div">
                        <div className="form-field-title">Password</div>
                        <div style={{ color: "red" }}>*</div>
                    </div>
                    <div className="form-field-box form-input">
                        <div className="auth-icons">
                            <PasswordIcon color={passwordEmpty ? "red" : "black"} width={23} height={23} />
                        </div>
                        <input
                            className="form-input"
                            name="password"
                            type="password"
                            value={props.auth.loginForm.password}
                            required
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-field-box" style={{ marginTop: "35px", marginBottom: "60px" }}>
                        <button className="button good-action-btn">Submit</button>
                    </div>
                </form>
            </div>
            <div style={{ fontStyle: "italic", marginTop: "10px" }}>
                * Use the credentials given while setting up CronEye
            </div>
        </div>
    );
};

const ConnectedLogin = connect(mapStateToProps)(Login);

export default ConnectedLogin;
