import React, { useEffect } from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import axios from "axios";

import Field from "../../../common/components/MultiSelectDropdown/Field";

import { config } from "../../../config/config";

import { userSelector } from "../../../auth/selectors/authSelector";
import { updateLogs, updateLogsFilters, updateLogsPaginator, updateLoadingState } from "../../slice/dashboardSlice";
import { logoutUser } from "../../../auth/slice/authSlice";

// Accessible part of the state
const mapStateToProps = (state) => {
    return {
        form: state.dashboard.logs_form,
        paginator: state.dashboard.logs_paginator,
    };
};

const Filters = (props) => {
    const dispatch = useDispatch();

    const user = useSelector(userSelector);

    useEffect(() => {
        new Promise((resolve) => {
            dispatch(updateLoadingState({ name: "logs", value: true }));
            resolve();
        }).then(() => {
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
                        (err.response.status === 400 &&
                            err.response.data.message === "Provide a valid auth token") ||
                        [401, 403].includes(err.response.status)
                    ) {
                        localStorage.setItem("authToken", "");
                        dispatch(logoutUser());
                    }
                });

            getLogs();
        });
    }, [dispatch, user.authToken]);

    const getLogs = () => {
        return axios
            .post(
                `${config.dashboard_base_url}/logs`,
                {
                    filters: {
                        schedulers: props.form.schedulers,
                        jobs: props.form.jobs,
                        events: props.form.events,
                    },
                    page_number: props.paginator.current_page,
                    page_size: props.paginator.per_page,
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
                dispatch(updateLogsPaginator(data.meta.pagination));
            })
            .catch((err) => {
                if (
                    (err.response.status === 400 && err.response.data.message === "Provide a valid auth token") ||
                    [401, 403].includes(err.response.status)
                ) {
                    localStorage.setItem("authToken", "");
                    dispatch(logoutUser());
                }
            });
    };

    const handleSubmit = () => {
        new Promise((resolve) => {
            dispatch(updateLoadingState({ name: "logs", value: true }));
            resolve();
        })
            .then(() => {
                getLogs();
            })
            .then(() => dispatch(updateLoadingState({ name: "logs", value: false })));
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
