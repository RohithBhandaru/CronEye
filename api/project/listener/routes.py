import logging
from flask import jsonify

from . import listener
from ..utils.helper import authenticate
from ..logs import config as logger_config
from ..utils.enums import HTTPResponseCodes
from ..utils.db import DbConnection
from ..logs.logger_templates import (
    authentication_failed_401,
    bad_request_400,
    internal_server_error_500,
    unauthorised_user_403,
)

logging.config.dictConfig(logger_config)
logger = logging.getLogger(__name__)


@listener.route("/event", methods=["POST"])
@authenticate
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
        1
    except Exception:
        internal_server_error_500(logger, "POST", "/api/v1/listener/event", "")
        response["message"] = "Internal server error"
        return jsonify(response), HTTPResponseCodes.INTERNAL_SERVER_ERROR
