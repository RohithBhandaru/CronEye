from functools import wraps
from flask import request, current_app, jsonify

from ..models import Users
from ..utils.enums import HTTPResponseCodes


def authenticate_listener(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        auth_header = request.headers.get("Authorization")
        if not auth_header:
            return f(HTTPResponseCodes.BAD_REQUEST.value, *args, **kwargs)

        if auth_header != "Token " + current_app.config.get("LISTENER_TOKEN"):
            return f(HTTPResponseCodes.AUTHENTICATION_FAILED.value, *args, **kwargs)

        return f(HTTPResponseCodes.SUCCESS.value, *args, **kwargs)

    return decorated_function


def authenticate_user(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        response_obj = {"status": "failure", "message": ""}
        auth_header = request.headers.get("Authorization")

        if not auth_header:
            response_obj["message"] = "Provide a valid auth token"
            return jsonify(response_obj), HTTPResponseCodes.BAD_REQUEST.value

        auth_token = auth_header.split(" ")[1]
        resp = Users.decode_auth_token(auth_token)
        if isinstance(resp, str):
            response_obj["message"] = resp
            return jsonify(response_obj), HTTPResponseCodes.AUTHENTICATION_FAILED.value

        user = Users.query.filter_by(id=resp).first()
        if not user:
            return jsonify(response_obj), HTTPResponseCodes.NOT_FOUND.value
        if not user.active:
            return jsonify(response_obj), HTTPResponseCodes.UNAUTHORISED_USER.value

        resp = user.to_json()
        return f(resp, *args, **kwargs)

    return decorated_function


aps_events_map = {
    2 ** 0: "EVENT_SCHEDULER_STARTED",  # 1
    2 ** 1: "EVENT_SCHEDULER_SHUTDOWN",  # 2
    2 ** 2: "EVENT_SCHEDULER_PAUSED",  # 4
    2 ** 3: "EVENT_SCHEDULER_RESUMED",  # 8
    2 ** 4: "EVENT_EXECUTOR_ADDED",  # 16
    2 ** 5: "EVENT_EXECUTOR_REMOVED",  # 32
    2 ** 6: "EVENT_JOBSTORE_ADDED",  # 64
    2 ** 7: "EVENT_JOBSTORE_REMOVED",  # 128
    2 ** 8: "EVENT_ALL_JOBS_REMOVED",  # 256
    2 ** 9: "EVENT_JOB_ADDED",  # 512
    2 ** 10: "EVENT_JOB_REMOVED",  # 1024
    2 ** 11: "EVENT_JOB_MODIFIED",  # 2048
    2 ** 12: "EVENT_JOB_EXECUTED",  # 4096
    2 ** 13: "EVENT_JOB_ERROR",  # 8192
    2 ** 14: "EVENT_JOB_MISSED",  # 16384
    2 ** 15: "EVENT_JOB_SUBMITTED",  # 32768
    2 ** 16: "EVENT_JOB_MAX_INSTANCES",  # 65536
}