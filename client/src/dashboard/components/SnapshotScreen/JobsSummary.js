import React, { useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import * as d3 from "d3";
import moment from "moment";

import { config } from "../../../config/config";

import { userSelector } from "../../../auth/selectors/authSelector";
import { jobSummarySelector } from "../../selectors/dashboardSelector";
import { updateJobsSummary } from "../../slice/dashboardSlice";
import { logoutUser } from "../../../auth/slice/authSlice";

const successStatusUnfilledIcon = `
<svg 
    width="14" 
    height="14" 
    viewBox="0 0 32 32" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
>
    <g clip-path="url(#clip0_70_705)">
        <path 
            d="M12.6464 24.3536L13 24.7072L13.3536 24.3536L28.3536 9.35361L28.7071 9.00006L28.3536 8.64651L26.9396 7.23251L26.586 6.87897L26.2325 7.23249L13 20.464L5.76753 13.2325L5.41398 12.879L5.06045 13.2325L3.64645 14.6465L3.29289 15.0001L3.64645 15.3536L12.6464 24.3536Z" 
            fill="#08AC03" 
            stroke="#08AC03"
        />
    </g>
</svg>
`;

const errorStatusUnfilledIcon = `
<svg 
    width="14" 
    height="14" 
    viewBox="0 0 32 32" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
>
    <g clip-path="url(#clip0_70_708)">
        <path 
            d="M24.3536 9.75355L24.7071 9.4L24.3536 9.04645L22.9536 7.64645L22.6 7.29289L22.2464 7.64645L16 13.8929L9.75355 7.64645L9.4 7.29289L9.04645 7.64645L7.64645 9.04645L7.29289 9.4L7.64645 9.75355L13.8929 16L7.64645 22.2464L7.29289 22.6L7.64645 22.9536L9.04645 24.3536L9.4 24.7071L9.75355 24.3536L16 18.1071L22.2464 24.3536L22.6 24.7071L22.9536 24.3536L24.3536 22.9536L24.7071 22.6L24.3536 22.2464L18.1071 16L24.3536 9.75355Z" 
            fill="#B50808" 
            stroke="#B50808"
        />
    </g>
</svg>
`;

const warningStatusUnfilledIcon = `
<svg 
    width="14" 
    height="14" 
    viewBox="0 0 32 32" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
>
    <g clip-path="url(#clip0_1114_470)">
        <path d="M15 7.5H14.5V8V19V19.5H15H17H17.5V19V8V7.5H17H15Z" fill="#E49A29" stroke="#E49A29"/>
        <path 
            d="M16 21.5C15.6044 21.5 15.2178 21.6173 14.8889 21.8371C14.56 22.0568 14.3036 22.3692 14.1522 22.7346C14.0009 23.1001 13.9613 23.5022 14.0384 23.8902C14.1156 24.2781 14.3061 24.6345 14.5858 24.9142C14.8655 25.1939 15.2219 25.3844 15.6098 25.4616C15.9978 25.5387 16.3999 25.4991 16.7654 25.3478C17.1308 25.1964 17.4432 24.94 17.6629 24.6111C17.8827 24.2822 18 23.8956 18 23.5C18 22.9696 17.7893 22.4609 17.4142 22.0858C17.0391 21.7107 16.5304 21.5 16 21.5Z" 
            fill="#E49A29" 
            stroke="#E49A29"
        />
    </g>
</svg>
`;

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
            })
            .catch((err) => {
                if (
                    (err.response.data.status === 400 && err.response.data.message === "Provide a valid auth token") ||
                    [401, 403].includes(err.response.data.status)
                ) {
                    localStorage.setItem("authToken", "");
                    dispatch(logoutUser());
                }
            });
    }, [dispatch, user.authToken]);

    useEffect(() => {
        if (Object.keys(summary).length !== 0) {
            const margins = { left: 20, right: 20, top: 20, bottom: 20 };
            const jobHeight = 80;
            const svgDimensions = {
                width: svgContainerRef.current?.clientWidth,
                height: jobHeight * summary.jobs?.length + margins.bottom + margins.top,
            };
            const graphDimensions = {
                width: svgDimensions.width - margins.left - margins.right,
                height: svgDimensions.height - margins.top - margins.bottom,
            };
            const yLabelMargin = 250;
            const xLabelMargin = 50;

            const xScale = d3
                .scaleUtc()
                .domain([moment(summary.time_range.start), moment(summary.time_range.end)])
                .range([0, graphDimensions.width - yLabelMargin]);

            const yScale = d3
                .scaleLinear()
                .domain([0, summary.jobs.length])
                .range([jobHeight * summary.jobs.length, 0]);

            const svg = d3
                .select(svgRef.current)
                .attr("width", svgDimensions.width)
                .attr("height", svgDimensions.height);
            svg.selectAll("*").remove();
            const graphContainer = svg
                .append("g")
                .classed("graph", true)
                .attr("transform", `translate(${yLabelMargin}, ${xLabelMargin})`);
            const yLabelContainer = svg
                .append("g")
                .classed("x-label", true)
                .attr("transform", `translate(${margins.left - 10}, ${xLabelMargin + 10})`);

            const ttip1 = graphContainer
                .append("foreignObject")
                .attr("class", "tooltip")
                .style("opacity", 0)
                .style("width", 150);

            graphContainer
                .append("g")
                .attr("class", "x axis")
                .attr("transform", `translate(0, -15)`)
                .call(
                    d3
                        .axisTop(xScale)
                        .ticks(5)
                        .tickFormat((time) => moment(time).format("h:mm A"))
                )
                .call((g) => g.select(".domain").remove())
                .style("font-size", "12px");

            graphContainer
                .append("g")
                .attr("class", "y gridlines")
                .attr("transform", `translate(0, -15)`)
                .call(d3.axisTop(xScale).ticks(5).tickSize(-graphDimensions.height).tickFormat(""))
                .call((g) => g.select(".domain").remove())
                .style("stroke-dasharray", "2 10");

            const handleMouseOver = (payload) => {
                d3.select("#tooltip-text").remove();
                const ttip1Div = ttip1
                    .append("xhtml:div")
                    .attr("id", "tooltip-text")
                    .html(
                        `<div>Duration: ${moment(payload.event.end ? payload.event.end : payload.time_range.end).diff(
                            moment(payload.event.start ? payload.event.start : payload.time_range.start),
                            "minutes"
                        )} min(s)</div>`
                    )
                    .style("font-size", "12px");

                const htmlContentHeight = ttip1Div.node().getBoundingClientRect().height;
                ttip1.attr("height", htmlContentHeight + 10);
                const rectDimensions = d3.select(".tooltip").node().getBoundingClientRect();

                let translateX;
                if (payload.event.start && payload.event.end) {
                    translateX =
                        (xScale(moment(payload.event.start)) +
                            xScale(moment(payload.event.end)) -
                            rectDimensions.width) /
                        2;
                } else {
                    if (!payload.event.start && payload.event.end) {
                        translateX =
                            (xScale(moment(payload.time_range.start)) +
                                xScale(moment(payload.event.end)) -
                                rectDimensions.width) /
                            2;
                    } else if (payload.event.start && !payload.event.end) {
                        translateX =
                            (xScale(moment(payload.event.start)) +
                                xScale(moment(payload.time_range.end)) -
                                rectDimensions.width) /
                            2;
                    } else {
                        translateX =
                            (xScale(moment(payload.time_range.start)) +
                                xScale(moment(payload.time_range.end)) -
                                rectDimensions.width) /
                            2;
                    }
                }
                ttip1.raise();
                ttip1
                    .transition()
                    .duration(10)
                    .style("opacity", 1)
                    .attr("transform", `translate(${translateX}, ${payload.translateY - rectDimensions.height - 10})`);
            };
            const handleMouseOut = () => {
                ttip1.transition().duration(100).style("opacity", 0);
            };

            for (let i = 0; i < summary.jobs.length; i++) {
                for (let j = 0; j < summary.jobs[i].events.length; j++) {
                    if (summary.jobs[i].events[j].miss_flag) {
                        graphContainer
                            .append("circle")
                            .attr("cx", xScale(moment(summary.jobs[i].events[j].start)))
                            .attr("cy", yScale(summary.jobs.length - i) + 20)
                            .attr("r", 7)
                            .attr("fill", "#919191")
                            .attr("class", "graph-event-block")
                            .attr("id", "missed-event-" + summary.jobs[i].id + j);
                    } else {
                        graphContainer
                            .append("rect")
                            .attr(
                                "x",
                                xScale(
                                    summary.jobs[i].events[j].start
                                        ? moment(summary.jobs[i].events[j].start)
                                        : moment(summary.time_range.start)
                                )
                            )
                            .attr("y", yScale(summary.jobs.length - i) + 10)
                            .attr(
                                "width",
                                (summary.jobs[i].events[j].end
                                    ? xScale(moment(summary.jobs[i].events[j].end))
                                    : xScale(moment(summary.time_range.end))) -
                                    xScale(moment(summary.jobs[i].events[j].start))
                            )
                            .attr("height", 20)
                            .attr(
                                "fill",
                                summary.jobs[i].events[j].exception
                                    ? "#f0cccc"
                                    : summary.jobs[i].events[j].end
                                    ? "#ccf0cd"
                                    : "#cccdf0"
                            )
                            .attr(
                                "stroke",
                                summary.jobs[i].events[j].exception
                                    ? "#ff4242"
                                    : summary.jobs[i].events[j].end
                                    ? "#08ac03"
                                    : "#030eac"
                            )
                            .attr("rx", 5)
                            .attr("ry", 5)
                            .attr("class", "graph-event-block")
                            .on("mouseover", () =>
                                handleMouseOver({
                                    event: summary.jobs[i].events[j],
                                    translateY: yScale(summary.jobs.length - i) + 5,
                                    time_range: summary.time_range,
                                })
                            )
                            .on("mouseout", () => handleMouseOut());

                        if (summary.jobs[i].events[j].max_instance_count.length > 0) {
                            for (let k = 0; k < summary.jobs[i].events[j].max_instance_count.length; k++) {
                                graphContainer
                                    .append("circle")
                                    .attr("cx", xScale(moment(summary.jobs[i].events[j].max_instance_count[k])))
                                    .attr("cy", yScale(summary.jobs.length - i) + 20)
                                    .attr("r", 7)
                                    .attr("fill", "#ffab4b")
                                    .attr("class", "graph-event-block");
                            }
                        }
                    }
                }

                let status_flag, status_text;
                if (summary.jobs[i].events[summary.jobs[i].events.length - 1].exception) {
                    status_flag = "error";
                    status_text = `Status: Failed at ${moment(
                        summary.jobs[i].events[summary.jobs[i].events.length - 1].end
                    ).format("HH:mm A")}`;
                } else if (
                    !summary.jobs[i].events[summary.jobs[i].events.length - 1].end &&
                    !summary.jobs[i].events[summary.jobs[i].events.length - 1].miss_flag
                ) {
                    if (summary.jobs[i].events[summary.jobs[i].events.length - 1].max_instance_count.length > 0) {
                        status_flag = "warning";
                        status_text = "Status: Overunning";
                    } else {
                        status_flag = "running";
                        status_text = "Status: Running";
                    }
                } else if (summary.jobs[i].events[summary.jobs[i].events.length - 1].end) {
                    if (
                        summary.jobs[i].next_scheduled_run &&
                        moment().diff(moment(summary.jobs[i].next_scheduled_run), "minutes") < 10
                    ) {
                        status_text = `Status: Starting in ${moment().diff(
                            moment(summary.jobs[i].next_scheduled_run),
                            "minutes"
                        )} mins`;
                    } else {
                        status_text = `Status: Finished at ${moment(
                            summary.jobs[i].events[summary.jobs[i].events.length - 1].end
                        ).format("HH:mm A")}`;
                    }
                    status_flag = "success";
                }

                if (!status_flag && !status_text) {
                    if (
                        summary.jobs[i].next_scheduled_run &&
                        moment().diff(moment(summary.jobs[i].next_scheduled_run), "minutes") < 10
                    ) {
                        status_text = `Status: Starting in ${moment().diff(
                            moment(summary.jobs[i].next_scheduled_run),
                            "minutes"
                        )} mins`;
                        status_flag = "success";
                    }
                }

                const ylabel = yLabelContainer
                    .append("foreignObject")
                    .attr("x", xScale(moment(summary.time_range.start)))
                    .attr("y", yScale(summary.jobs.length - i))
                    .style("font-size", "12px")
                    .style("width", "200");

                const ylabelDiv = ylabel.append("xhtml:div").html(
                    `<div class='flex-column'>
                            <div class='ylabel-title'>${summary.jobs[i].name}</div>
                            <div class='job-status-div flex-row'>
                                ${
                                    status_flag === "success" || status_flag === "running"
                                        ? successStatusUnfilledIcon
                                        : status_flag === "error"
                                        ? errorStatusUnfilledIcon
                                        : status_flag === "warning"
                                        ? warningStatusUnfilledIcon
                                        : ""
                                }
                                <div style="margin-left: 5px">${status_text || ""}</div>
                            </div>
                        </div>`
                );

                const htmlContentHeight = ylabelDiv.node().getBoundingClientRect().height;
                ylabel.attr("height", htmlContentHeight + 10);
            }
        }
    }, [summary]);

    return (
        <div ref={svgContainerRef} style={{ margin: "10px 30px 30px 30px" }}>
            <div className="block-title non-first-block">Jobs</div>
            <div className="labels">
                <div className="label-block">
                    <div
                        style={{
                            height: "20px",
                            width: "20px",
                            backgroundColor: "#cccdf0",
                            border: "1px solid #030eac",
                            borderRadius: "5px",
                            marginRight: "5px",
                        }}
                    />
                    <div style={{ fontStyle: "italic" }}>Running</div>
                </div>

                <div className="label-block">
                    <div
                        style={{
                            height: "20px",
                            width: "20px",
                            backgroundColor: "#ccf0cd",
                            border: "1px solid #08ac03",
                            borderRadius: "5px",
                            marginRight: "5px",
                        }}
                    />
                    <div style={{ fontStyle: "italic" }}>Successful run</div>
                </div>

                <div className="label-block">
                    <div
                        style={{
                            height: "20px",
                            width: "20px",
                            backgroundColor: "#f0cccc",
                            border: "1px solid #ff4242",
                            borderRadius: "5px",
                            marginRight: "5px",
                        }}
                    />
                    <div style={{ fontStyle: "italic" }}>Failed run</div>
                </div>

                <div className="label-block">
                    <div
                        style={{
                            height: "15px",
                            width: "15px",
                            backgroundColor: "#ffab4b",
                            borderRadius: "10px",
                            marginRight: "5px",
                        }}
                    />
                    <div style={{ fontStyle: "italic" }}>Max. instance breach</div>
                </div>

                <div className="label-block">
                    <div
                        style={{
                            height: "15px",
                            width: "15px",
                            backgroundColor: "#919191",
                            borderRadius: "10px",
                            marginRight: "5px",
                        }}
                    />
                    <div style={{ fontStyle: "italic" }}>Missed run</div>
                </div>
            </div>
            <svg ref={svgRef} />
        </div>
    );
};

export default JobsSummary;
