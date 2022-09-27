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
        logs_filters: {},
        logs_form: {
            search: null,
            schedulers: [],
            jobs: [],
            events: [],
            event_dates: [],
            page_number: null,
            page_size: null
        }
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
            state.jobs_summary = action.payload
        },
        updateLogs(state, action) {
            state.logs = action.payload
        },
        updateLogsFilters(state, action) {
            state.logs_filters = action.payload
        },
    },
});

const { actions, reducer } = dashboardSlice;
export const { updateSummary, updateJobsSummary, updateLogs, updateLogsFilters } = actions;
export default reducer;
