import React, { useState } from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import axios from "axios";

import FlashMessage from "../../../common/components/FlashMessage";

import { config } from "../../../config/config";

import EditIcon from "../../../assets/icons/EditIcon";

import { logoutUser } from "../../../auth/slice/authSlice";
import { updateSettingsForm, updateFlashMessage } from "../../slice/dashboardSlice";
import { userSelector } from "../../../auth/selectors/authSelector";

// Accessible part of the state
const mapStateToProps = (state) => {
    return {
        settings_form: state.dashboard.settings_form,
        flash_message_type: state.dashboard.flash_message_type,
        flash_message: state.dashboard.flash_message,
    };
};

const AuthSettings = (props) => {
    const [formVisible, setFormVisible] = useState(false);
    const [flash, toggleFlash] = useState(false);
    const dispatch = useDispatch();

    const user = useSelector(userSelector);

    const patchSettings = () => {
        axios({
            method: "post",
            url: `${config.auth_base_url}/change-password`,
            headers: {
                Authorization: `Bearer ${user.authToken}`,
            },
            data: {
                current_password: props.settings_form.current_password,
                new_password: props.settings_form.new_password,
            },
        })
            .then((response) => {
                setFormVisible(false);
                dispatch(logoutUser);
            })
            .catch((err) => {
                if (
                    (err.response.status === 400 && err.response.data.message === "Provide a valid auth token") ||
                    [401, 403].includes(err.response.status)
                ) {
                    localStorage.setItem("authToken", "");
                    dispatch(logoutUser());
                } else {
                    toggleFlash(true);
                    dispatch(
                        updateFlashMessage({
                            flash_message_type: err.response.data.status,
                            flash_message: err.response.data.message,
                        })
                    );
                }
            });
    };

    const handleChange = (e) => {
        dispatch(
            updateSettingsForm({
                name: e.target.name,
                value: e.target.value,
            })
        );
    };

    const handleCancel = () => {
        setFormVisible(false);
        dispatch(
            updateSettingsForm({
                name: "current_password",
                value: null,
            })
        );

        dispatch(
            updateSettingsForm({
                name: "new_password",
                value: null,
            })
        );

        dispatch(
            updateFlashMessage({
                flash_message_type: null,
                flash_message: null,
            })
        );
    };

    const handleSubmit = () => {
        if (props.settings_form.current_password !== props.settings_form.new_password) {
            dispatch(
                updateFlashMessage({
                    flash_message_type: "failure",
                    flash_message: "Passwords don't match.",
                })
            );
            return;
        }
        patchSettings();
    };

    return (
        <div className="settings-block">
            <div className="block-title">Authentication</div>
            <div className="settings-block-details">
                <div className="settings-block-detail">
                    <div className="flex-row" style={{ width: "100%" }}>
                        {formVisible ? (
                            <>
                                <div className="settings-block-detail-key">Current password:</div>{" "}
                                <input
                                    className="settings-form-input"
                                    name="current_password"
                                    type="text"
                                    value={props.settings_form.current_password || ""}
                                    required
                                    onChange={handleChange}
                                />
                            </>
                        ) : (
                            <>
                                <div className="settings-block-detail-key">Password:</div>{" "}
                                <div className="settings-block-detail-value">***</div>
                            </>
                        )}
                    </div>

                    {!formVisible && (
                        <div className="settings-detail-actions">
                            <EditIcon
                                width="20"
                                height="20"
                                color="black"
                                style={{ cursor: "pointer" }}
                                onClick={() => setFormVisible(true)}
                            />
                        </div>
                    )}
                </div>

                {formVisible && (
                    <div className="settings-block-detail">
                        <div className="flex-row" style={{ width: "100%" }}>
                            <div className="settings-block-detail-key">New password:</div>{" "}
                            <input
                                className="settings-form-input"
                                name="new_password"
                                type="text"
                                value={props.settings_form.new_password || ""}
                                required
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                )}

                {formVisible && (
                    <>
                        <div className="action-btn-container">
                            <div className="button bad-action-btn" onClick={handleCancel}>
                                Cancel
                            </div>
                            <div className="button good-action-btn" onClick={handleSubmit}>
                                Submit
                            </div>
                        </div>

                        <div
                            style={{
                                marginLeft: "10px",
                                width: "100%",
                                display: "flex",
                                justifyContent: "center",
                            }}
                        >
                            {props.flash_message_type === "failure" && props.flash_message && (
                                <FlashMessage
                                    flash={flash}
                                    toggleFlash={toggleFlash}
                                    serverMessageType={props.flash_message_type}
                                    serverMessage={props.flash_message}
                                />
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

const ConnectedAuthSettings = connect(mapStateToProps)(AuthSettings);

export default ConnectedAuthSettings;
