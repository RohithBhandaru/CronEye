import React from "react";

const LogHeader = () => {
    return (
        <div className="table-header">
            <div className="column-1"></div>
            <div className="column-2">Scheduler</div>
            <div className="column-3">Job</div>
            <div className="column-4">Event</div>
            <div className="column-5">Time</div>
            <div className="column-6">Output</div>
            <div className="column-7">Errors</div>
        </div>
    );
};

export default LogHeader;
