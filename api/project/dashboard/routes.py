import json, logging, pandas as pd, datetime as dt
from flask import jsonify, request

from . import dashboard
from .queries import summary_stats, job_stats, logs_query
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
        start_time = int(
            dt.datetime(year=2022, month=7, day=25, hour=18, minute=40, second=0, tzinfo=dt.timezone.utc).timestamp()
            * 1000
        )  # dt.datetime.utcnow() + dt.timedelta(hours=-6)
        end_time = int(
            dt.datetime(year=2022, month=7, day=25, hour=18, minute=50, second=0, tzinfo=dt.timezone.utc).timestamp()
            * 1000
        )  # dt.datetime.utcnow()
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
                            if datum["status"] == "EVENT_JOB_ERROR":
                                events[current_event_idx]["exception"] = datum["exception"] or "Not captured"
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
                                "exception": datum["exception"] or "Not captured"
                                if datum["status"] == "EVENT_JOB_ERROR"
                                else datum["exception"],
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


@dashboard.route("/logs", methods=["POST"])
@authenticate_user
def jobs_logs(resp):
    response = {
        "status": "failure",
        "message": "",
        "data": [],
        "meta": {"pagination": {"current_page": 0, "per_page": 0, "total": 0, "total_pages": 0}},
    }
    _, cur = DbConnection().get_db_connection_instance()
    try:
        data = json.loads(request.data)
        search_term = data.get("search")
        filters = data.get("filters")
        page_number = data.get("page_number", 1)
        page_size = data.get("page_size", 20)

        query = logs_query
        if search_term:
            query = query.replace("__SEARCH_FILTER__", "AND bb.task ILIKE '%_%'".replace("_", search_term))

        if "schedulers" in filters.keys() and len(filters["schedulers"]) > 0:
            filter_str = "('" + "','".join(str(filter) for filter in filters["schedulers"]) + "')"
            query = query.replace("__SCHEDULER_FILTER__", "AND aa.alias IN " + filter_str)

        if "jobs" in filters.keys() and len(filters["jobs"]) > 0:
            filter_str = "('" + "','".join(str(filter) for filter in filters["jobs"]) + "')"
            query = query.replace("__JOB_FILTER__", "AND bb.task IN " + filter_str)

        if "events" in filters.keys() and len(filters["events"]) > 0:
            filter_str = "('" + "','".join(str(filter) for filter in filters["events"]) + "')"
            query = query.replace("__EVENT_FILTER__", "AND cc.status IN " + filter_str)

        if "event_date" in filters.keys():
            from_date = (
                dt.datetime.strptime(filters["event_date"][0], "%Y-%m-%d %H:%M:%S")
                if len(filters["event_date"]) == 2
                else dt.datetime.utcnow() + dt.timedelta(hours=5.5) - dt.timedelta(days=100)
            )
            to_date = (
                dt.datetime.strptime(filters["event_date"][1], "%Y-%m-%d %H:%M:%S")
                if len(filters["event_date"]) == 2
                else dt.datetime.utcnow() + dt.timedelta(hours=5.5)
            )
            filter_str = "('" + "','".join(str(filter for filter in filters["events"])) + "')"
            query = query.replace(
                "__EVENT_DATE_FILTER__", "AND cc.time >= '%s' AND cc.time <= '%s'".format(from_date, to_date)
            )

        count_query = query.replace("__PAGINATION__", "")
        count_query = "SELECT COUNT(*) FROM (" + count_query + ") as aa"
        count_query = (
            count_query.replace("__SEARCH_FILTER__", "")
            .replace("__SCHEDULER_FILTER__", "")
            .replace("__JOB_FILTER__", "")
            .replace("__EVENT_FILTER__", "")
            .replace("__PAGINATION__", "")
        )

        query = query.replace("__PAGINATION__", "LIMIT {0} OFFSET {1}".format(page_size, (page_number - 1) * page_size))
        query = (
            query.replace("__SEARCH_FILTER__", "")
            .replace("__SCHEDULER_FILTER__", "")
            .replace("__JOB_FILTER__", "")
            .replace("__EVENT_FILTER__", "")
            .replace("__PAGINATION__", "")
        )

        cur.execute(query)
        data = cur.fetchall()
        for datum in data:
            response["data"].append(
                {
                    "scheduler_name": datum[0],
                    "scheduler_status": datum[1],
                    "job_id": datum[2],
                    "job_name": datum[3],
                    "job_next_schedule_run": datum[4],
                    "event_status": datum[5],
                    "event_time": datum[6],
                    "event_return_value": datum[7],
                    "event_exception": datum[8],
                    "event_traceback": datum[9],
                }
            )

        cur.execute(count_query)
        total_count = cur.fetchone()[0]

        response["status"] = "success"
        response["meta"]["pagination"]["current_page"] = page_number
        response["meta"]["pagination"]["per_page"] = page_size
        response["meta"]["pagination"]["total"] = total_count
        response["meta"]["pagination"]["total_pages"] = int(total_count / page_size) + 1
        return jsonify(response), HTTPResponseCodes.SUCCESS.value
    except Exception:
        internal_server_error_500(logger, "POST", "/api/dashboard/logs", "", {})
        response["message"] = "Internal server error"
        return jsonify(response), HTTPResponseCodes.INTERNAL_SERVER_ERROR.value


@dashboard.route("/logs/filters", methods=["GET"])
@authenticate_user
def jobs_logs_filters(resp):
    response = {
        "status": "failure",
        "message": "",
        "data": {},
    }
    _, cur = DbConnection().get_db_connection_instance()
    try:
        cur.execute("SELECT DISTINCT alias FROM schedulers ORDER BY alias ASC")
        data = cur.fetchall()
        response["data"]["schedulers"] = [datum[0] for datum in data]

        cur.execute("SELECT DISTINCT task FROM jobs ORDER BY task ASC")
        data = cur.fetchall()
        response["data"]["jobs"] = [datum[0] for datum in data]

        cur.execute("SELECT DISTINCT status FROM execution_events ORDER BY status ASC")
        data = cur.fetchall()
        response["data"]["events"] = [datum[0] for datum in data]

        response["status"] = "success"
        return jsonify(response), HTTPResponseCodes.SUCCESS.value
    except Exception:
        internal_server_error_500(logger, "POST", "/api/dashboard/logs/filters", "", {})
        response["message"] = "Internal server error"
        return jsonify(response), HTTPResponseCodes.INTERNAL_SERVER_ERROR.value