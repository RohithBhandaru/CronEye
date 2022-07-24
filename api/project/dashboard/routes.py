import json, logging
from flask import jsonify, request

from . import dashboard
from ..utils.db import DbConnection
from ..utils.helper import authenticate_user
from ..logs.config import config as logger_config
from ..utils.enums import HTTPResponseCodes

logging.config.dictConfig(logger_config)
logger = logging.getLogger(__name__)

@dashboard.route("/summary", methods=["POST"])
@authenticate_user
def summary(resp):
    response = {"status": "failure", "message": "", "data": {}}
    conn, cur = DbConnection().get_db_connection_instance()