import json, logging, pandas as pd, datetime as dt
from flask import jsonify, request

from . import dashboard
from .queries import summary_stats, job_stats
from ..utils.db import DbConnection
from ..utils.helper import authenticate_user
from ..logs.config import config as logger_config
from ..utils.enums import HTTPResponseCodes
from ..logs.logger_templates import info_log, internal_server_error_500

logging.config.dictConfig(logger_config)
logger = logging.getLogger(__name__)


@dashboard.route("/summary", methods=["POST"])
@authenticate_user
def summary(resp):
    response = {
        "status": "failure",
        "message": "",
        "data": {"scheduler": "inactive", "total_jobs": 0, "running_jobs": 0, "overrun_jobs": 0},
    }
    _, cur = DbConnection().get_db_connection_instance()

    try:
        # Data - Scheduler status, total jobs in the jobstore, running jobs, overruning jobs
        cur.execute(summary_stats)
        data = cur.fetchall()
        if len(data) != 0:
            # Assuming only one scheduler can be placed at a time
            response["data"]["scheduler"] = "active"
        response["data"]["total_jobs"] = len(data)
        for datum in data:
            if datum[2] not in ("EVENT_JOB_EXECUTED", "EVENT_JOB_ERROR"):
                response["data"]["running_jobs"] += 1
            if datum[2] == "EVENT_JOB_MAX_INSTANCES":
                response["data"]["overrun_jobs"] += 1

        response["status"] = "success"
        return jsonify(response), HTTPResponseCodes.SUCCESS.value
    except Exception:
        internal_server_error_500(logger, "POST", "/api/dashboard/summary", "", {})
        response["message"] = "Internal server error"
        return jsonify(response), HTTPResponseCodes.INTERNAL_SERVER_ERROR.value


@dashboard.route("/summary/jobs", methods=["POST"])
@authenticate_user
def jobs_summary(resp):
    "Assuming only one instance of a job can run at a time"
    response = {
        "status": "failure",
        "message": "",
        "data": {"jobs": [], "time_range": {"start": None, "end": None}},
    }
    conn, _ = DbConnection().get_db_connection_instance()
    try:
        start_time = dt.datetime(
            year=2022, month=7, day=26, hour=0, minute=10, second=0
        )  # dt.datetime.utcnow() + dt.timedelta(hours=-6)
        end_time = dt.datetime(
            year=2022, month=7, day=26, hour=0, minute=20, second=0
        )#dt.datetime.utcnow()
        data = pd.read_sql(job_stats % (start_time, end_time), conn)
        unique_jobs = data["job_id"].unique()
        for job in unique_jobs:
            events = []
            sub_data = data[data["job_id"] == job]
            current_event_idx = -1
            for _, datum in sub_data.iterrows():
                if datum["status"] == "EVENT_JOB_SUBMITTED":
                    current_event_idx += 1
                    events.append(
                        {
                            "start": datum["time"],
                            "end": None,
                            "return_value": None,
                            "exception": None,
                            "traceback": None,
                            "miss_flag": False,
                            "max_instance_count": [],
                        }
                    )

                if datum["status"] in ("EVENT_JOB_EXECUTED", "EVENT_JOB_ERROR", "EVENT_JOB_MAX_INSTANCES"):
                    if current_event_idx >= 0:
                        if datum["status"] != "EVENT_JOB_MAX_INSTANCES":
                            events[current_event_idx]["end"] = datum["time"]
                            events[current_event_idx]["return_value"] = datum["return_value"]
                            events[current_event_idx]["exception"] = datum["exception"]
                            events[current_event_idx]["traceback"] = datum["traceback"]
                        else:
                            events[current_event_idx]["max_instance_count"].append(datum["time"])
                    else:
                        current_event_idx += 1
                        events.append(
                            {
                                "start": None,
                                "end": datum["time"] if datum["status"] != "EVENT_JOB_MAX_INSTANCES" else None,
                                "return_value": datum["return_value"],
                                "exception": datum["exception"],
                                "traceback": datum["traceback"],
                                "miss_flag": False,
                                "max_instance_count": [datum["time"]],
                            }
                        )

                if datum["status"] == "EVENT_JOB_MISSED":
                    current_event_idx += 1
                    events.append(
                        {
                            "start": datum["time"],
                            "end": None,
                            "return_value": None,
                            "exception": None,
                            "traceback": None,
                            "miss_flag": True,
                            "max_instance_count": [],
                        }
                    )

            response["data"]["jobs"].append(
                {
                    "id": sub_data.iloc[0, 0],
                    "name": sub_data.iloc[0, 1],
                    "next_scheduled_run": sub_data.iloc[0, 2],
                    "events": events,
                }
            )

        response["data"]["time_range"] = {"start": start_time, "end": end_time}
        response["status"] = "success"
        return jsonify(response), HTTPResponseCodes.SUCCESS.value
    except Exception:
        internal_server_error_500(logger, "POST", "/api/dashboard/summary/jobs", "", {})
        response["message"] = "Internal server error"
        return jsonify(response), HTTPResponseCodes.INTERNAL_SERVER_ERROR.value