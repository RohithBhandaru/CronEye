import React, { useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import * as d3 from "d3";
import moment from "moment";

import config from "../../config/config";

import { userSelector } from "../../auth/selectors/authSelector";
import { jobSummarySelector } from "../selectors/dashboardSelector";
import { updateJobsSummary } from "../slice/dashboardSlice";
import { logoutUser } from "../../auth/slice/authSlice";

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
            const jobHeight = 60;
            const svgDimensions = {
                width: svgContainerRef.current?.clientWidth,
                height: jobHeight * summary.jobs?.length + margins.bottom + margins.top,
            };
            const graphDimensions = {
                width: svgDimensions.width - margins.left - margins.right,
                height: svgDimensions.height - margins.top - margins.bottom,
            };
            const yLabelMargin = 150;
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
                            .attr("cy", yScale(summary.jobs.length - i) + 10)
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
                            .attr("y", yScale(summary.jobs.length - i))
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
                                    .attr("cy", yScale(summary.jobs.length - i) + 10)
                                    .attr("r", 7)
                                    .attr("fill", "#ffab4b")
                                    .attr("class", "graph-event-block");
                            }
                        }
                    }
                }

                yLabelContainer
                    .append("text")
                    .attr("x", xScale(moment(summary.time_range.start)))
                    .attr("y", yScale(summary.jobs.length - i))
                    .text(summary.jobs[i].name)
                    .style("font-size", "12px");
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
