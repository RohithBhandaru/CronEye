import React, { useState } from "react";
import { connect, useSelector, useDispatch } from "react-redux";
import axios from "axios";

import Option from "../../common/components/SingleSelectDropdown/Option";

import { logsFormSelector } from "../selectors/dashboardSelector";
import { userSelector } from "../../auth/selectors/authSelector";
import { logoutUser } from "../../auth/slice/authSlice";
import { updateLogs, updateLogsPaginator } from "../slice/dashboardSlice";

import {config} from "../../config/config";

import ChevronLeftIcon from "../../assets/icons/ChevronLeftIcon";
import ChevronRightIcon from "../../assets/icons/ChevronRightIcon";

// Accessible part of the state
const mapStateToProps = (state) => {
    return {
        paginator: state.dashboard.logs_paginator,
    };
};

const pageSizeOptions = [10, 20, 50, 100];

const Paginator = (props) => {
    const [modal, toggleModal] = useState(false);

    const dispatch = useDispatch();
    const logs_form = useSelector(logsFormSelector);
    const user = useSelector(userSelector);

    const handleChange = ({ event_type, event_value }) => {
        let page_number = props.paginator.current_page;
        let page_size = props.paginator.per_page;

        if (event_type === "next_page") {
            if (page_number >= props.paginator.total_pages) {
                return;
            }
            page_number = page_number + 1;
        } else if (event_type === "previous_page") {
            if (page_number <= 1) {
                return;
            }
            page_number = page_number - 1;
        } else if (event_type === "page_size_change") {
            page_size = event_value;
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
                Showing {(props.paginator.current_page - 1) * props.paginator.per_page + 1} -{" "}
                {Math.min(props.paginator.total, props.paginator.current_page * props.paginator.per_page)} of{" "}
                {props.paginator.total} items
            </div>

            <div className="paginator-controls">
                <div className="paginator-page-size">
                    <div>Items per page:</div>
                    <div className="paginator-field" onClick={() => toggleModal(true)}>
                        {props.paginator.per_page || 20}
                    </div>
                    {modal && (
                        <>
                            <div className="cancel-canvas" onClick={() => toggleModal(false)}></div>
                            <div className="centered" onClick={() => toggleModal(false)}>
                                <div
                                    className={"modal modal-small"}
                                    style={{ justifyContent: "space-between", marginTop: "-140px", marginLeft: "83px" }}
                                >
                                    {pageSizeOptions.map((value) => {
                                        return (
                                            <Option
                                                value={value}
                                                onClick={() => {
                                                    toggleModal();
                                                    handleChange({
                                                        event_type: "page_size_change",
                                                        event_value: value,
                                                    });
                                                }}
                                                key={value}
                                            />
                                        );
                                    })}
                                </div>
                            </div>
                        </>
                    )}
                </div>

                <div className="paginator-page-number">
                    <ChevronLeftIcon
                        width="24"
                        height="24"
                        color={props.paginator.current_page > 1 ? "#0a64a5" : "#88a4b8"}
                        style={{ cursor: props.paginator.current_page > 1 ? "pointer" : "no-drop" }}
                        onClick={handleChange}
                        onClickEvent="previous_page"
                    />

                    <div style={{ margin: "0px 10px" }}>
                        Page {props.paginator.current_page} of {props.paginator.total_pages || 1}
                    </div>

                    <ChevronRightIcon
                        width="24"
                        height="24"
                        color={props.paginator.current_page < props.paginator.total_pages ? "#0a64a5" : "#88a4b8"}
                        style={{
                            cursor: props.paginator.current_page < props.paginator.total_pages ? "pointer" : "no-drop",
                        }}
                        onClick={handleChange}
                        onClickEvent="next_page"
                    />
                </div>
            </div>
        </div>
    );
};

// <input
//     type={"text"}
//     value={pageNumber}
//     className="paginator-field"
//     style={{
//         cursor: logs_form.current_page < logs_form.total_pages ? "pointer" : "no-drop",
//         width: "50px",
//         textAlign: "center",
//     }}
//     onChange={(e) => {
//         setPageNumber(Math.max(Math.min(e.target.value, props.paginator?.total_pages), 1));

//         handleChange();
//     }}
// />

const ConnectedPaginator = connect(mapStateToProps)(Paginator);

export default ConnectedPaginator;
