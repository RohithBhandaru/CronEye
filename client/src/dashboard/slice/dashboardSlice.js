import { createSlice } from "@reduxjs/toolkit";

const dashboardSlice = createSlice({
    name: "dashboard",
    initialState: {
        summary: {
            scheduler: null,
            total_jobs: null,
            running_jobs: null,
            overrun_jobs: null,
        },
        loading_state: {
            summary: true,
            jobs_graph: true,
            logs: true,
        },
        jobs_graph: {},
        logs: {},
        logs_paginator: {},
        logs_filters: [],
        logs_form: {
            search: null,
            schedulers: [],
            jobs: [],
            events: [],
            event_dates: [],
            page_number: null,
            page_size: null,
        },
        settings_form: {
            project_name: null,
        },
        settings: {
            id: null,
            project_name: null,
        },
    },
    reducers: {
        updateSummary(state, action) {
            const { scheduler, total_jobs, running_jobs, overrun_jobs } = action.payload;
            state.summary = {
                scheduler,
                total_jobs,
                running_jobs,
                overrun_jobs,
            };
        },
        updateJobsSummary(state, action) {
            state.jobs_graph = action.payload;
        },
        updateLogs(state, action) {
            state.logs = action.payload;
            state.loading_state.logs = false;
        },
        updateLogsPaginator(state, action) {
            state.logs_paginator = action.payload;
        },
        updateLogsFilters(state, action) {
            state.logs_filters = action.payload;
        },
        updateLogsForm(state, action) {
            if (action.payload.action) {
                if (action.payload.action === "add") {
                    state.logs_form[action.payload.name] = [
                        ...state.logs_form[action.payload.name],
                        action.payload.value,
                    ];
                    state.logs_form[action.payload.name].sort();
                } else {
                    const index = state.logs_form[action.payload.name].indexOf(action.payload.value);
                    if (index > -1) {
                        state.logs_form[action.payload.name].splice(index, 1);
                    }
                }
            } else {
                state.logs_form[action.payload.name] = action.payload.value;
            }
        },
        updateSettingsForm(state, action) {
            state.settings_form[action.payload.name] = action.payload.value;
        },
        updateSettings(state, action) {
            state.settings = action.payload;
            state.settings_form.project_name = action.payload.project_name;
        },
        updateLoadingState(state, action) {
            state.loading_state[action.payload.name] = action.payload.value;
        },
    },
});

const { actions, reducer } = dashboardSlice;
export const {
    updateSummary,
    updateJobsSummary,
    updateLogs,
    updateLogsPaginator,
    updateLogsFilters,
    updateLogsForm,
    updateSettings,
    updateSettingsForm,
    updateLoadingState,
} = actions;
export default reducer;
