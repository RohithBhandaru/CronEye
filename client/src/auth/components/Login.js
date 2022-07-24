import React from "react";
import { useDispatch } from "react-redux";

import EmailIcon from "../../assets/icons/email.svg";
import PasswordIcon from "../../assets/icons/password.svg";

import { updateAuthForm } from "../slice/authSlice";

const Login = () => {
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

    return (
        <div className="auth-main-container">
            <div className="auth-box-container">
                <p className="auth-form-title">Login</p>

                <form className="form__login" noValidate>
                    <div className="form-field-title-div form-field-title">Email</div>
                    <div className="form-field-box form-input">
                        <img src={EmailIcon} alt="Email" className="auth-icons" align="middle" />
                        <input className="form-input" name="email" type="text" required onChange={handleChange} />
                    </div>

                    <div className="form-field-title-div">
                        <div className="form-field-title">Password</div>
                    </div>
                    <div className="form-field-box form-input">
                        <img src={PasswordIcon} alt="Password" className="auth-icons" align="middle" />
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
