import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";

import SummaryCard from "./SummaryCard";

import SuccessStatusIcon from "../../assets/icons/SuccessStatusIcon";
import ErrorStatusIcon from "../../assets/icons/ErrorStatusIcon";
import PausedStatusIcon from "../../assets/icons/PausedStatusIcon";
import UnknownStatusIcon from "../../assets/icons/UnknownStatusIcon";

import config from "../../config/config";

import { updateSummary } from "../slice/dashboardSlice";
import { summarySelector } from "../selectors/dashboardSelector";
import { userSelector } from "../../auth/selectors/authSelector";

const iconMapper = (status) => {
    switch (status) {
        case "active":
            return <SuccessStatusIcon height={24} width={24} />;
        case "shutdown":
            return <ErrorStatusIcon height={30} width={30} />;
        case "paused":
            return <PausedStatusIcon height={30} width={30} />;
        default:
            return <UnknownStatusIcon height={30} width={30} />;
    }
};

const Summary = () => {
    const dispatch = useDispatch();
    const summary = useSelector(summarySelector);
    const user = useSelector(userSelector);

    useEffect(() => {
        axios
            .post(
                `${config.dashboard_base_url}/summary`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${user.authToken}`,
                    },
                }
            )
            .then((response) => {
                const data = response.data;
                dispatch(updateSummary(data.data));
            });
    }, [dispatch, user.authToken]);

    return (
        <div className="summary-container">
            <SummaryCard name="Scheduler" value={iconMapper(summary.scheduler)} />
            <SummaryCard name="Total jobs" value={summary.total_jobs} />
            <SummaryCard name="Active jobs" value={summary.running_jobs} />
            <SummaryCard name="Overrunning jobs" value={summary.overrun_jobs} />
        </div>
    );
};

export default Summary;
