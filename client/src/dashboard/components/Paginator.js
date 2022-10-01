import React, { useState } from "react";
import { connect, useSelector, useDispatch } from "react-redux";
import axios from "axios";

import { logsFormSelector } from "../selectors/dashboardSelector";
import { userSelector } from "../../auth/selectors/authSelector";
import { logoutUser } from "../../auth/slice/authSlice";
import { updateLogs, updateLogsPaginator } from "../slice/dashboardSlice";

import config from "../../config/config";

import ChevronLeftIcon from "../../assets/icons/ChevronLeftIcon";
import ChevronRightIcon from "../../assets/icons/ChevronRightIcon";

// Accessible part of the state
const mapStateToProps = (state) => {
    return {
        paginator: state.dashboard.logs_paginator,
    };
};

const Paginator = (props) => {
    const [pageNumber, setPageNumber] = useState(props.paginator.current_page);
    const [perPage, setPerPage] = useState(props.paginator.per_page);

    const dispatch = useDispatch();
    const logs_form = useSelector(logsFormSelector);
    const user = useSelector(userSelector);
    console.log(logs_form);

    const handleChange = (event_type) => {
        let page_number = pageNumber;
        let page_size = perPage;

        if (event_type === "next_page") {
            page_number = page_number + 1;
        } else if (event_type === "previous_page") {
            page_number = page_number - 1;
        }

        axios
            .post(
                `${config.dashboard_base_url}/logs`,
                {
                    filters: {
                        schedulers: logs_form.schedulers,
                        jobs: logs_form.jobs,
                        events: logs_form.events,
                    },
                    page_number,
                    page_size,
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
                    (err.response.data.status === 400 && err.response.data.message === "Provide a valid auth token") ||
                    [401, 403].includes(err.response.data.status)
                ) {
                    localStorage.setItem("authToken", "");
                    dispatch(logoutUser());
                }
            });
    };

    return (
        <div className="paginator-container">
            <div>
                Items {(props.paginator.current_page - 1) * props.paginator.per_page} -{" "}
                {Math.min(props.paginator.total, props.paginator.current_page * props.paginator.per_page)}
            </div>

            <div className="paginator-controls">
                <div className="paginator-page-size">
                    <div>Size:</div>
                    <div className="paginator-field">{logs_form.per_page || 20}</div>
                </div>
                <div className="paginator-page-number">
                    <ChevronLeftIcon
                        width="24"
                        height="24"
                        color={logs_form.current_page > 1 ? "#0a64a5" : "#5e8cad"}
                        style={{ cursor: logs_form.current_page > 1 ? "pointer" : "no-drop" }}
                        onClick={handleChange}
                        onClickEvent="previous_page"
                    />
                    <input
                        type={"text"}
                        value={pageNumber}
                        className="paginator-field"
                        style={{
                            cursor: logs_form.current_page < logs_form.total_pages ? "pointer" : "no-drop",
                            width: "50px",
                            textAlign: "center",
                        }}
                        onChange={(e) => {
                            setPageNumber(Math.max(Math.min(e.target.value, props.paginator?.total_pages), 1));
                            handleChange();
                        }}
                    />
                    <div style={{ marginRight: "10px" }}>of {logs_form.total_pages || 1}</div>
                    <ChevronRightIcon
                        width="24"
                        height="24"
                        color={logs_form.current_page < logs_form.total_pages ? "#0a64a5" : "#5e8cad"}
                        style={{ cursor: logs_form.current_page < logs_form.total_pages ? "pointer" : "no-drop" }}
                        onClick={handleChange}
                        onClickEvent="next_page"
                    />
                </div>
            </div>
        </div>
    );
};

const ConnectedPaginator = connect(mapStateToProps)(Paginator);

export default ConnectedPaginator;
