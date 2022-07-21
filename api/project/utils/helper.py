from functools import wraps
from flask import request, current_app

from ..utils.enums import HTTPResponseCodes


def authenticate(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        auth_header = request.headers.get("Authorization")
        if not auth_header:
            return f(HTTPResponseCodes.BAD_REQUEST, *args, **kwargs)

        if auth_header != current_app.config.get("LISTENER_TOKEN"):
            return f(HTTPResponseCodes.UNAUTHORISED_USER, *args, **kwargs)

        return f(HTTPResponseCodes.SUCCESS, *args, **kwargs)

    return decorated_function
