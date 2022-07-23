import json, logging, logging.config
from flask import jsonify, request, current_app

from . import auth
from .. import bcrypt
from ..models import Users
from ..logs.config import config as logger_config
from ..utils.enums import HTTPResponseCodes
from ..utils.helper import authenticate_user
from ..logs.logger_templates import (
    bad_request_400,
    not_found_404,
    authentication_failed_401,
    internal_server_error_500,
)


logging.config.dictConfig(logger_config)
logger = logging.getLogger(__name__)


@auth.route("/login", methods=["POST"])
def user_login():
    data = json.loads(request.data)
    response_obj = {"status": "failure", "message": ""}

    if not data:
        bad_request_400(logger, "POST", "/api/auth/users/login", "", {})
        response_obj["message"] = "Bad request"
        return jsonify(response_obj), HTTPResponseCodes.BAD_REQUEST.value

    email = data.get("email")
    password = data.get("password")

    try:
        user = Users.query.filter_by(email=email).first()
        if user:
            if bcrypt.check_password_hash(user.password, password):
                auth_token = user.encode_auth_token(user.id)
                if auth_token:
                    response_obj["status"] = "success"
                    response_obj["auth_token"] = auth_token
                    return jsonify(response_obj), HTTPResponseCodes.SUCCESS.value
            else:
                authentication_failed_401(logger, "POST", "/api/auth/users/login", "", {})
                response_obj["message"] = "Password is not matching. Login again."
                return jsonify(response_obj), HTTPResponseCodes.AUTHENTICATION_FAILED.value
        else:
            not_found_404(logger, "POST", "/api/auth/users/login", "", {})
            response_obj["message"] = "User does not exist"
            return jsonify(response_obj), HTTPResponseCodes.NOT_FOUND.value
    except Exception:
        internal_server_error_500(
            logger,
            "POST",
            "/api/auth/users/login",
            "Failed while logging in",
            "",
            {},
        )
        response_obj["message"] = "Failed while logging in"
        return jsonify(response_obj), HTTPResponseCodes.INTERNAL_SERVER_ERROR.value


@auth.route("/logout", methods=["POST"])
@authenticate_user
def user_logout(resp):
    response_obj = {"status": "success", "message": "Successfully logged out"}
    return jsonify(response_obj), HTTPResponseCodes.SUCCESS.value


@auth.route("/status", methods=["GET"])
@authenticate_user
def check_status(resp):
    response_obj = {"status": "failure", "message": "", "data": {}}
    try:
        user = Users.query.filter_by(id=resp.get("id")).first()
        response_obj["data"] = user.to_json()
        response_obj["status"] = "success"
        return jsonify(response_obj), HTTPResponseCodes.SUCCESS.value
    except Exception:
        internal_server_error_500(
            logger,
            "GET",
            "/api/auth/users/status",
            "Failed while getting user login status",
            "",
            {},
        )
        response_obj["message"] = "Failed while getting user login status"
        return jsonify(response_obj), HTTPResponseCodes.INTERNAL_SERVER_ERROR.value
