import React from "react";

const LogHeader = () => {
    return (
        <div className="table-header">
            <div className="column-1"></div>
            <div className="column-2">
                <div className="column-text">Scheduler</div>
            </div>
            <div className="column-3">
                <div className="column-text">Job</div>
            </div>
            <div className="column-4">
                <div className="column-text">Event</div>
            </div>
            <div className="column-5">
                <div className="column-text">Time</div>
            </div>
            <div className="column-6">
                <div className="column-text">Output</div>
            </div>
            <div className="column-7">
                <div className="column-text">Errors</div>
            </div>
        </div>
    );
};

export default LogHeader;
