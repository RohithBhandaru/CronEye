import React from "react";

import Filters from "./Filters";
import LogsList from "./LogsList";

const Logs = () => {
    return (
        <div className="main-container">
            <Filters />
            <LogsList />
        </div>
    );
};

export default Logs;
