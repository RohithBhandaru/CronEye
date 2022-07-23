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

        if auth_header != current_app.config.get("LISTENER_TOKEN"):
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
