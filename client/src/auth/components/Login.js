import React from "react";

import EmailIcon from "../../assets/icons/email.svg";
import PasswordIcon from "../../assets/icons/password.svg";

const Login = () => {
    return (
        <div className="auth-main-container">
            <div className="auth-box-container">
                <p className="auth-form-title">Login</p>

                <form className="form__login" novalidate>
                    <div className="form-field-title-div form-field-title">Email</div>
                    <div className="form-field-box form-input">
                        <img src={EmailIcon} alt="Email" className="auth-icons" align="middle" />
                        <input className="form-input" name="email" type="text" required />
                    </div>

                    <div class="form-field-title-div">
                        <div className="form-field-title">Password</div>
                    </div>
                    <div className="form-field-box form-input">
                        <img src={PasswordIcon} alt="Password" className="auth-icons" align="middle" />
                        <input className="form-input" name="password" type="password" required />
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
