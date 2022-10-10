import React from "react";

import Summary from "./Summary";
import JobsSummary from "./JobsSummary";

const Dashboard = () => {
    return (
        <div className="main-container">
            <Summary />
            <JobsSummary />
        </div>
    );
};

export default Dashboard;
