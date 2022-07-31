import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";

import config from "../../config/config";

import { userSelector } from "../../auth/selectors/authSelector";
import { jobSummarySelector } from "../selectors/dashboardSelector";
import { updateJobsSummary } from "../slice/dashboardSlice";

const JobsSummary = () => {
    const dispatch = useDispatch();
    const summary = useSelector(jobSummarySelector);
    const user = useSelector(userSelector);

    useEffect(() => {
        axios
            .post(
                `${config.dashboard_base_url}/summary/jobs`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${user.authToken}`,
                    },
                }
            )
            .then((response) => {
                const data = response.data;
                dispatch(updateJobsSummary(data.data));
            });
    }, [dispatch, user.authToken]);

    return (<div>Jobs</div>)
};

export default JobsSummary;