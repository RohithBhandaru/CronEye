import React, { useEffect } from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import axios from "axios";

import Field from "../../common/components/MultiSelectDropdown/Field";

import config from "../../config/config";

import { userSelector } from "../../auth/selectors/authSelector";
import { updateLogs, updateLogsFilters } from "../slice/dashboardSlice";
import { logoutUser } from "../../auth/slice/authSlice";

// Accessible part of the state
const mapStateToProps = (state) => {
    return {
        form: state.dashboard.logs_form,
    };
};

const Filters = (props) => {
    const dispatch = useDispatch();

    const user = useSelector(userSelector);

    useEffect(() => {
        axios
            .get(`${config.dashboard_base_url}/logs/filters`, {
                headers: {
                    Authorization: `Bearer ${user.authToken}`,
                },
            })
            .then((response) => {
                const data = response.data;
                dispatch(updateLogsFilters(data.data));
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

        axios
            .post(
                `${config.dashboard_base_url}/logs`,
                {
                    filters: {
                        schedulers: [],
                        jobs: [],
                        events: [],
                    },
                },
                {
                    headers: {
                        Authorization: `Bearer ${user.authToken}`,
                    },
                }
            )
            .then((response) => {
                const data = response.data;
                dispatch(updateLogs(data.data));
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
    }, [dispatch, user.authToken]);

    const handleSubmit = () => {
        axios
            .post(
                `${config.dashboard_base_url}/logs`,
                {
                    filters: {
                        schedulers: props.form.schedulers,
                        jobs: props.form.jobs,
                        events: props.form.events,
                    },
                },
                {
                    headers: {
                        Authorization: `Bearer ${user.authToken}`,
                    },
                }
            )
            .then((response) => {
                const data = response.data;
                dispatch(updateLogs(data.data));
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

    return (
        <div className="filters-container">
            <div className="block-title">History</div>
            <div className="filter-row flex-row">
                <Field name="schedulers" length="normal" />
                <Field name="jobs" length="normal" />
                <Field name="events" length="big" />
                <button className="button good-action-btn" onClick={handleSubmit}>
                    Submit
                </button>
            </div>
        </div>
    );
};

const ConnectedFilters = connect(mapStateToProps)(Filters);

export default ConnectedFilters;
