import React from "react";

const SummaryCard = (props) => {
    return (
        <div className="card-container">
            <div className="card-title">{props.name}</div>
            <div className="card-value">{props.value}</div>
        </div>
    );
};

export default SummaryCard;
