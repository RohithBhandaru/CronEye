import React, { useEffect, useState } from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import axios from "axios";

import { config } from "../../config/config";

import { userSelector } from "../../auth/selectors/authSelector";
import { updateSettingsForm, updateSettings } from "../slice/dashboardSlice";
import { logoutUser } from "../../auth/slice/authSlice";

import EditIcon from "../../assets/icons/EditIcon";

// Accessible part of the state
const mapStateToProps = (state) => {
    return {
        settings_form: state.dashboard.settings_form,
        settings: state.dashboard.settings,
    };
};

const SettingsScreen = (props) => {
    const [formVisible, setFormVisible] = useState(false);
    const dispatch = useDispatch();

    const user = useSelector(userSelector);

    const getSettings = () => {
        axios
            .get(`${config.dashboard_base_url}/settings`, {
                headers: {
                    Authorization: `Bearer ${user.authToken}`,
                },
            })
            .then((response) => {
                const data = response.data;
                dispatch(updateSettings(data.data));
            })
            .catch((err) => {
                if (
                    (err.response.data.status === 400 && err.response.data.message === "Provide a valid auth token") ||
                    [401, 403].includes(err.response.data.status)
                ) {
                    localStorage.setItem("authToken", "");
                    dispatch(logoutUser());
                }
            });
    };

    const patchPostSettings = () => {
        return axios({
            method: props.settings.id ? "patch" : "post",
            url: `${config.dashboard_base_url}/settings`,
            headers: {
                Authorization: `Bearer ${user.authToken}`,
            },
            data: {
                id: props.settings.id,
                project_name: props.settings_form.project_name,
            },
        })
            .then((response) => {
                const data = response.data;
                dispatch(updateSettings(data.data));
            })
            .catch((err) => {
                if (
                    (err.response.data.status === 400 && err.response.data.message === "Provide a valid auth token") ||
                    [401, 403].includes(err.response.data.status)
                ) {
                    localStorage.setItem("authToken", "");
                    dispatch(logoutUser());
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

    const handleSubmit = () => {
        patchPostSettings().then(() => {
            setFormVisible(false);
            getSettings();
        });
    };

    return (
        <div className="main-container">
            <div className="settings-container">
                <div className="settings-block">
                    <div className="block-title">Project</div>
                    <div className="settings-block-details">
                        <div className="settings-block-detail">
                            <div className="flex-row">
                                <div className="settings-block-detail-key">Name:</div>
                                {formVisible ? (
                                    <input
                                        className="settings-form-input"
                                        name="project_name"
                                        type="text"
                                        value={props.settings_form.project_name}
                                        required
                                        onChange={handleChange}
                                    />
                                ) : (
                                    <div className="settings-block-detail-value">
                                        {props.settings.project_name || "NA"}
                                    </div>
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
                            <div className="action-btn-container">
                                <div className="button bad-action-btn" onClick={() => setFormVisible(false)}>
                                    Cancel
                                </div>
                                <div className="button good-action-btn" onClick={handleSubmit}>
                                    Submit
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

const ConnectedSettingsScreen = connect(mapStateToProps)(SettingsScreen);

export default ConnectedSettingsScreen;
