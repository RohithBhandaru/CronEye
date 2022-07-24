import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";

import EmailIcon from "../../assets/icons/EmailIcon.js";
import PasswordIcon from "../../assets/icons/PasswordIcon.js";
import { authFormSelector } from "../selectors/authSelector.js";

import { updateAuthForm } from "../slice/authSlice";

import config from "../../config/config.js";

const Login = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [emailEmpty, setEmailEmpty] = useState(false);
    const [passwordEmpty, setPasswordEmpty] = useState(false);

    const formData = useSelector(authFormSelector);
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
        if (!formData.email || !formData.password) {
            setEmailEmpty(!formData.email ? true : false);
            setPasswordEmpty(!formData.password ? true : false);
        } else {
            setIsLoading(true);
            setEmailEmpty(false);
            setPasswordEmpty(false);
            axios
                .post(`${config.auth_base_url}/login`, { email: formData.email, password: formData.password })
                .then((response) => {
                    console.log(response.data);
                });
        }
    };

    return (
        <div className="auth-main-container">
            <div className="auth-box-container">
                <p className="auth-form-title">Login</p>

                <form className="form__login" noValidate onSubmit={handleSubmit}>
                    <div className="form-field-title-div form-field-title">Email</div>
                    <div className="form-field-box form-input">
                        <div className="auth-icons">
                            <EmailIcon color={emailEmpty ? "red" : "black"} width={23} height={23} />
                        </div>
                        <input className="form-input" name="email" type="text" required onChange={handleChange} />
                    </div>

                    <div className="form-field-title-div">
                        <div className="form-field-title">Password</div>
                    </div>
                    <div className="form-field-box form-input">
                        <div className="auth-icons">
                            <PasswordIcon color={passwordEmpty ? "red" : "black"} width={23} height={23} />
                        </div>
                        <input
                            className="form-input"
                            name="password"
                            type="password"
                            required
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-field-box" style={{ marginTop: "35px", marginBottom: "60px" }}>
                        <button className="button good-action-btn">Submit</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
