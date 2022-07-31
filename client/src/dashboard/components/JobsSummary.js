import React, { useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import * as d3 from "d3";

import config from "../../config/config";

import { userSelector } from "../../auth/selectors/authSelector";
import { jobSummarySelector } from "../selectors/dashboardSelector";
import { updateJobsSummary } from "../slice/dashboardSlice";

const JobsSummary = () => {
    const svgRef = useRef(null);
    const svgContainerRef = useRef(null);
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

    useEffect(() => {
        const svgDimensions = { width: svgContainerRef.current?.offsetWidth, height: 350 };
        const margins = { left: 20, right: 20, top: 20, bottom: 10 };
        const graphDimensions = {
            width: svgDimensions.width - margins.left - margins.right,
            height: svgDimensions.height - margins.top - margins.bottom,
        };
        const yLabelMargin = 0;
        const xLabelMargin = 50;

        const xScale = d3
            .scaleTime()
            .domain([new Date(summary.time_range.start), new Date(summary.time_range.end)])
            .range([0, graphDimensions.width - yLabelMargin]);

        const yScale = d3.scaleLinear().domain([0, summary.jobs.length]).range([graphDimensions.height, 0]);

        const svg = d3.select(svgRef.current).attr("width", svgDimensions.width).attr("height", svgDimensions.height);
        svg.selectAll("*").remove();
        const graphContainer = svg
            .append("g")
            .classed("graph", true)
            .attr("transform", `translate(${yLabelMargin}, ${xLabelMargin})`);
        const yLabelContainer = svg
            .append("g")
            .classed("x-label", true)
            .attr("transform", `translate(${margins.left}, ${xLabelMargin + 10})`);

        for (let i = 0; i < summary.jobs.length; i++) {
            for (let j = 0; j < summary.jobs[i].events.length; j++) {
                if (summary.jobs[i].events[j].miss_flag) {
                    graphContainer
                        .append("circle")
                        .attr("cx", xScale(new Date(summary.jobs[i].events[j].start)))
                        .attr("cy", yScale(summary.jobs.length - i) + 10)
                        .attr("r", 5)
                        .attr("fill", "#919191");
                } else {
                    graphContainer
                        .append("rect")
                        .attr(
                            "x",
                            xScale(
                                summary.jobs[i].events[j].start
                                    ? new Date(summary.jobs[i].events[j].start)
                                    : new Date(summary.time_range.start)
                            )
                        )
                        .attr("y", yScale(summary.jobs.length - i))
                        .attr(
                            "width",
                            (summary.jobs[i].events[j].end
                                ? xScale(new Date(summary.jobs[i].events[j].end))
                                : xScale(new Date(summary.time_range.end))) -
                                xScale(new Date(summary.jobs[i].events[j].start))
                        )
                        .attr("height", 20)
                        .attr("fill", summary.jobs[i].events[j].exception ? "#ffc8c8" : "#c8ffcb")
                        .attr("stroke", summary.jobs[i].events[j].exception ? "#fc1b1b" : "#08ac03")
                        .attr("rx", 5)
                        .attr("ry", 5);

                    if (summary.jobs[i].events[j].max_instance_count.length > 0) {
                        for (let k = 0; k < summary.jobs[i].events[j].max_instance_count.length; k++) {
                            graphContainer
                                .append("circle")
                                .attr("cx", xScale(new Date(summary.jobs[i].events[j].max_instance_count[k])))
                                .attr("cy", yScale(summary.jobs.length - i) + 10)
                                .attr("r", 5)
                                .attr("fill", "#ffab4b");
                        }
                    }
                }
            }

            yLabelContainer
                .append("text")
                .attr("x", xScale(new Date(summary.time_range.start)))
                .attr("y", yScale(summary.jobs.length - i))
                .text(summary.jobs[i].name);
        }
    }, [summary]);

    return (
        <div ref={svgContainerRef}>
            <svg ref={svgRef} />
        </div>
    );
};

export default JobsSummary;
