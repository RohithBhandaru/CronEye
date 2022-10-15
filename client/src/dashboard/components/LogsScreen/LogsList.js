import React from "react";
import { connect } from "react-redux";

import LogHeader from "./LogTableHeader";
import LogAccordian from "./LogAccordian";
import Paginator from "./Paginator";
// import Loader from "../../../common/components/Loader";
import LogsSkeletonLoader from "../../../common/components/LogsSkeletonLoader";

import NoDataIllustration from "../../../assets/illustrations/NoDataIllustration";

// Accessible part of the state
const mapStateToProps = (state) => {
    return {
        logs: state.dashboard.logs,
        loader: state.dashboard.loading_state,
    };
};

const LogsList = (props) => {
    return (
        <div className="logs-container">
            <div className="table-container">
                <LogHeader />

                {props.loader.logs ? (
                    // <div style={{ margin: "40px" }}>
                    //     <Loader />
                    // </div>
                    <div style={{ width: "100%", backgroundColor: "white" }}>
                        <LogsSkeletonLoader width="100%" height="60px" />
                        <div style={{ borderBottom: "2px solid #f0f1f5", height: "2px" }} />
                        <LogsSkeletonLoader width="100%" height="60px" />
                        <div style={{ borderBottom: "2px solid #f0f1f5", height: "2px" }} />
                        <LogsSkeletonLoader width="100%" height="60px" />
                        <div style={{ borderBottom: "2px solid #f0f1f5", height: "2px" }} />
                    </div>
                ) : props.logs?.length > 0 ? (
                    props.logs.map((log, idx) => <LogAccordian {...log} key={idx} />)
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
