import json, logging
from flask import jsonify, request
from apscheduler import events

from . import listener
from .queries import upsert_job, update_job_activity, add_job_execution_event, update_job_schedule
from ..utils.db import DbConnection
from ..utils.helper import authenticate_listener
from ..logs import config as logger_config
from ..utils.enums import HTTPResponseCodes
from ..logs.logger_templates import (
    bad_request_400,
    internal_server_error_500,
    unauthorised_user_403,
)

logging.config.dictConfig(logger_config)
logger = logging.getLogger(__name__)


@listener.route("/event", methods=["POST"])
@authenticate_listener
def process_event(resp):
    response = {"status": "failure", "message": "", "data": {}}
    if resp == HTTPResponseCodes.BAD_REQUEST:
        bad_request_400(logger, "POST", "/api/v1/listener/event", "")
        response["message"] = "Bad request"
        return jsonify(response), HTTPResponseCodes.BAD_REQUEST

    if resp == HTTPResponseCodes.UNAUTHORISED_USER:
        unauthorised_user_403(logger, "POST", "/api/v1/listener/event", "")
        response["message"] = "Unauthorised user"
        return jsonify(response), HTTPResponseCodes.UNAUTHORISED_USER

    conn, cur = DbConnection().get_db_connection_instance()
    try:
        data = json.loads(request.data)
        event_code = data.get("event_code")
        job_id = data.get("job_id")
        task = data.get("task")
        status = data.get("status")
        return_value = data.get("return_value")
        exception = data.get("exception")
        traceback = data.get("traceback")
        next_scheduled_run_time = data.get("next_scheduled_run_time")
        time = data.get("time")

        if event_code == events.EVENT_JOB_ADDED:
            cur.execute(upsert_job, (job_id, task))
        if event_code == events.EVENT_JOB_REMOVED:
            cur.execute(update_job_activity, (False, job_id))
        if event_code == events.EVENT_JOB_SUBMITTED:
            cur.execute(add_job_execution_event, (job_id, status, time, return_value, exception, traceback))
            cur.execute(update_job_schedule, (next_scheduled_run_time, job_id))
        if event_code in (events.EVENT_JOB_EXECUTED, events.EVENT_JOB_ERROR, events.EVENT_JOB_MISSED):
            cur.execute(add_job_execution_event, (job_id, status, time, return_value, exception, traceback))
        if event_code == events.EVENT_JOB_MAX_INSTANCES:
            cur.execute(add_job_execution_event, (job_id, status, time, return_value, exception, traceback))
            cur.execute(update_job_schedule, (next_scheduled_run_time, job_id))

        conn.commit()
        response["status"] = "success"
        return jsonify(response), HTTPResponseCodes.SUCCESS
    except Exception:
        internal_server_error_500(logger, "POST", "/api/v1/listener/event", "")
        response["message"] = "Internal server error"
        return jsonify(response), HTTPResponseCodes.INTERNAL_SERVER_ERROR
