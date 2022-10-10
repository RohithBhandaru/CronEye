const config = {
    base_url: "http://0.0.0.0:5001/api",
    auth_base_url: "http://0.0.0.0:5001/api/auth",
    dashboard_base_url: "http://0.0.0.0:5001/api/dashboard",
    colors: {
        brand_yellow: "#fc951e",
        brand_blue: "#0a64a5",
        brand_red: "#ff4d2c",
        background: "#f3f1ef",
        success_thick: "#08ac03",
        success_light: "#ccf0cd",
        failure_thick: "#ff4242",
        failure_light: "#f0cccc",
        info_thick: "#030eac",
        info_light: "#cccdf0",
        warning_thick: "#e49a29",
        warning_light: "#f8e6c9",
        grey_thick: "#919191",
        grey_light: "#f0eded",
    },
};

const event_name_map = {
    EVENT_SCHEDULER_STARTED: {
        name: "Scheduler started",
        background_color: config.colors.success_light,
        border_color: config.colors.success_thick,
    },
    EVENT_SCHEDULER_SHUTDOWN: {
        name: "Scheduler shutdown",
        background_color: config.colors.failure_light,
        border_color: config.colors.failure_thick,
    },
    EVENT_SCHEDULER_PAUSED: {
        name: "Scheduler paused",
        background_color: config.colors.warning_light,
        border_color: config.colors.warning_thick,
    },
    EVENT_SCHEDULER_RESUMED: {
        name: "Scheduler resumed",
        background_color: config.colors.success_light,
        border_color: config.colors.success_thick,
    },
    EVENT_EXECUTOR_ADDED: {
        name: "Executor added",
        background_color: config.colors.success_light,
        border_color: config.colors.success_thick,
    },
    EVENT_EXECUTOR_REMOVED: {
        name: "Executor removed",
        background_color: config.colors.failure_light,
        border_color: config.colors.failure_thick,
    },
    EVENT_JOBSTORE_ADDED: {
        name: "Jobstore added",
        background_color: config.colors.success_light,
        border_color: config.colors.success_thick,
    },
    EVENT_JOBSTORE_REMOVED: {
        name: "Jobstore removed",
        background_color: config.colors.failure_light,
        border_color: config.colors.failure_thick,
    },
    EVENT_ALL_JOBS_REMOVED: {
        name: "All jobs removed",
        background_color: config.colors.failure_light,
        border_color: config.colors.failure_thick,
    },
    EVENT_JOB_ADDED: {
        name: "Job added",
        background_color: config.colors.success_light,
        border_color: config.colors.success_thick,
    },
    EVENT_JOB_REMOVED: {
        name: "Job removed",
        background_color: config.colors.failure_light,
        border_color: config.colors.failure_thick,
    },
    EVENT_JOB_MODIFIED: {
        name: "Job modified",
        background_color: config.colors.info_light,
        border_color: config.colors.info_thick,
    },
    EVENT_JOB_EXECUTED: {
        name: "Job run completed",
        background_color: config.colors.success_light,
        border_color: config.colors.success_thick,
    },
    EVENT_JOB_ERROR: {
        name: "Job error",
        background_color: config.colors.failure_light,
        border_color: config.colors.failure_thick,
    },
    EVENT_JOB_MISSED: {
        name: "Job skipped",
        background_color: config.colors.grey_light,
        border_color: config.colors.grey_thick,
    },
    EVENT_JOB_SUBMITTED: {
        name: "Job submitted",
        background_color: config.colors.success_light,
        border_color: config.colors.success_thick,
    },
    EVENT_JOB_MAX_INSTANCES: {
        name: "Job max instances breached",
        background_color: config.colors.warning_light,
        border_color: config.colors.warning_thick,
    },
};

export {config, event_name_map};
