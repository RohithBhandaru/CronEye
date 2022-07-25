import json, logging
from flask import jsonify, request

from . import dashboard
from .queries import summary_stats
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
    conn, cur = DbConnection().get_db_connection_instance()

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
        internal_server_error_500(logger, "POST", "/api/listener/event", "", {})
        response["message"] = "Internal server error"
        return jsonify(response), HTTPResponseCodes.INTERNAL_SERVER_ERROR.value