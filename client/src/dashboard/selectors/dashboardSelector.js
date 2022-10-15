const summarySelector = (state) => state.dashboard.summary;

const jobSummarySelector = (state) => state.dashboard.jobs_graph;

const logsSelector = (state) => state.dashboard.logs;

const logsFiltersSelector = (state, name) => state.dashboard.logs_filters[name];

const logsFormSelector = (state) => state.dashboard.logs_form;

const isOptionSelectedSelector = (state, name, value) => state.dashboard.logs_form[name].includes(value);

const selectedOptionsSelector = (state, name) => state.dashboard.logs_form[name];

const settingsSelector = (state) => state.settings;

const settingsFormSelector = (state) => state.settings_form;

const loadingStateSelector = (state) => state.loading_state;

export {
    summarySelector,
    jobSummarySelector,
    logsSelector,
    logsFiltersSelector,
    logsFormSelector,
    isOptionSelectedSelector,
    selectedOptionsSelector,
    settingsSelector,
    settingsFormSelector,
    loadingStateSelector,
};
