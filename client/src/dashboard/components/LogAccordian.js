import React, { useRef, useState } from "react";

const LogAccordian = (props) => {
    const [isActive, setIsActive] = useState(false);
    const contentRef = useRef();

    return (
        <div>
            <div className="accordian-title" onClick={() => setIsActive(!isActive)}>
                <span className="column-1">{isActive ? "-" : "+"}</span>
                <div className="column-2">{props.scheduler_name}</div>
                <div className="column-3">{props.job_name}</div>
                <div className="column-4">{props.event_status}</div>
                <div className="column-5">{props.event_time}</div>
                <div className="column-6">{props.event_return_value}</div>
                <div className="column-7">{props.event_exception}</div>
            </div>
            <div
                className={`accordian-content ${isActive ? "active" : ""}`}
                ref={contentRef}
                style={isActive ? { minHeight: contentRef.current.offsetHeight } : { height: "0px" }}
            >
                <div className="accordian-content-item">
                    <div className="accordian-content-key">Scheduler:</div>
                    <div className="accordian-content-value">{props.scheduler_name}</div>
                </div>
                <div className="accordian-content-item">
                    <div className="accordian-content-key">Scheduler status:</div>
                    <div className="accordian-content-value">{props.scheduler_status}</div>
                </div>
                <div className="accordian-content-item">
                    <div className="accordian-content-key">Job:</div>
                    <div className="accordian-content-value">{props.job_name}</div>
                </div>
                <div className="accordian-content-item">
                    <div className="accordian-content-key">Next scheduled run:</div>
                    <div className="accordian-content-value">{props.job_next_schedule_run}</div>
                </div>
                <div className="accordian-content-item">
                    <div className="accordian-content-key">Event:</div>
                    <div className="accordian-content-value">{props.event_status}</div>
                </div>
                <div className="accordian-content-item">
                    <div className="accordian-content-key">Time:</div>
                    <div className="accordian-content-value">{props.event_time}</div>
                </div>
                <div className="accordian-content-item">
                    <div className="accordian-content-key">Output:</div>
                    <div className="accordian-content-value">{props.event_return_value}</div>
                </div>
                <div className="accordian-content-item">
                    <div className="accordian-content-key">Error:</div>
                    <div className="accordian-content-value">{props.event_exception}</div>
                </div>
                <div className="accordian-content-item">
                    <div className="accordian-content-key">Traceback:</div>
                    <div className="accordian-content-value">{props.event_traceback}</div>
                </div>
            </div>
        </div>
    );
};

export default LogAccordian;
