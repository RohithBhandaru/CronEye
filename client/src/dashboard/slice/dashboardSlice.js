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
        jobs_summary: {}
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
        }
    },
});

const { actions, reducer } = dashboardSlice;
export const { updateSummary, updateJobsSummary } = actions;
export default reducer;
