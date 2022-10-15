import React from "react";
import { connect } from "react-redux";

import LogHeader from "./LogTableHeader";
import LogAccordian from "./LogAccordian";
import Paginator from "./Paginator";
import Loader from "../../../common/components/Loader";

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
                    <Loader />
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
