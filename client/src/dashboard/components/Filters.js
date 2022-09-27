import React, { useState, useEffect } from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import axios from "axios";

import Field from "../../common/components/MultiSelectDropdown/Field";

import config from "../../config/config";

import { userSelector } from "../../auth/selectors/authSelector";
import { updateLogsFilters } from "../slice/dashboardSlice";
import { logoutUser } from "../../auth/slice/authSlice";

// Accessible part of the state
const mapStateToProps = (state) => {
    return {
        auth: state.auth,
    };
};

const Filters = () => {
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
    }, [dispatch, user.authToken]);

    return (
        <div className="filters-container">
            <Field name="jobs" />
        </div>
    );
};

const ConnectedFilters = connect(mapStateToProps)(Filters);

export default ConnectedFilters;
