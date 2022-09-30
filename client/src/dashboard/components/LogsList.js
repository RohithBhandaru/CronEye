import React from "react";
import { connect } from "react-redux";

import LogHeader from "./LogHeader";
import LogAccordian from "./LogAccordian";

// Accessible part of the state
const mapStateToProps = (state) => {
    return {
        logs: state.dashboard.logs,
    };
};

const LogsList = (props) => {
    console.log(props.logs);

    return (
        <div className="logs-container">
            {props.logs?.length > 1 ? (
                <div className="table-container">
                    <LogHeader />
                    {props.logs.map((log) => (
                        <LogAccordian {...log} />
                    ))}
                </div>
            ) : (
                <div>1</div>
            )}
        </div>
    );
};

const ConnectedLogsList = connect(mapStateToProps)(LogsList);

export default ConnectedLogsList;
