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
        jobs_summary: {},
        logs: {},
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
            state.jobs_summary = action.payload;
        },
        updateLogs(state, action) {
            state.logs = action.payload;
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
    },
});

const { actions, reducer } = dashboardSlice;
export const { updateSummary, updateJobsSummary, updateLogs, updateLogsFilters, updateLogsForm } = actions;
export default reducer;
