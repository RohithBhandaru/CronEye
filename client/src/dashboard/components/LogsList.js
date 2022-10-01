import React from "react";
import { connect } from "react-redux";

import LogHeader from "./LogHeader";
import LogAccordian from "./LogAccordian";
import Paginator from "./Paginator";

import NoDataIllustration from "../../assets/illustrations/NoDataIllustration";

// Accessible part of the state
const mapStateToProps = (state) => {
    return {
        logs: state.dashboard.logs,
    };
};

const LogsList = (props) => {
    return (
        <div className="logs-container">
            <div className="table-container">
                <LogHeader />
                {props.logs?.length > 1 ? (
                    props.logs.map((log) => <LogAccordian {...log} />)
                ) : (
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "center",
                            padding: "20px",
                            width: "100%",
                            backgroundColor: "white",
                        }}
                    >
                        <NoDataIllustration width="200" height="200" />
                        <span style={{ margin: "20px", color: "#0a64a5", fontSize: "14px", fontWeight: "600" }}>
                            No data available
                        </span>
                    </div>
                )}
                <Paginator />
            </div>
        </div>
    );
};

const ConnectedLogsList = connect(mapStateToProps)(LogsList);

export default ConnectedLogsList;
