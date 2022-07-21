import logging
from flask import jsonify

from . import listener
from ..utils.helper import authenticate
from ..logs import config as logger_config
from ..utils.enums import HTTPResponseCodes
from ..logs.logger_templates import authentication_failed_401

logging.config.dictConfig(logger_config)
logger = logging.getLogger(__name__)


@listener.route("/event", methods=["POST"])
@authenticate
def process_event(resp):
    response = {"status": "failure", "message": "", "data": {}}
    if resp == HTTPResponseCodes.AUTHENTICATION_FAILED:
        authentication_failed_401(logger, "POST", "/api/v1/listener/event")
        response["message"] = "Authentication failed"
        return jsonify(response), HTTPResponseCodes.AUTHENTICATION_FAILED
