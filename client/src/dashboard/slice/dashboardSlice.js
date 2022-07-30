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
    },
});

const { actions, reducer } = dashboardSlice;
export const { updateSummary } = actions;
export default reducer;
