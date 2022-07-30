import React from "react";

const SummaryCard = (props) => {
    console.log("-->>", props.value);
    return (
        <div className="card-container">
            <div className="card-title">{props.name}</div>
            <div className="card-value">{props.value}</div>
        </div>
    );
};

export default SummaryCard;
