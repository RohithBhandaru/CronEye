import React from "react";
import SummaryCardSkeletonLoader from "../../../common/components/SummaryCardSkeletonLoader";

const SummaryCard = (props) => {
    return (
        <div className="card-container">
            <div className="card-title">{props.name}</div>
            {props.value ? (
                <div className="card-value">{props.value}</div>
            ) : (
                <SummaryCardSkeletonLoader width="20" height="20" />
            )}
        </div>
    );
};

export default SummaryCard;
