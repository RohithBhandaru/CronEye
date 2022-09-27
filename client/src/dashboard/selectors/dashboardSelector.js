const summarySelector = (state) => state.dashboard.summary;

const jobSummarySelector = (state) => state.dashboard.jobs_summary;

const logsSelector = (state) => state.dashboard.logs;

const logsFiltersSelector = (state) => state.dashboard.logs_filters;

export { summarySelector, jobSummarySelector, logsSelector, logsFiltersSelector };
