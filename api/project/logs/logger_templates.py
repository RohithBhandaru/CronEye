def redirect_303(logger, api_method, api_route, description):
    logger.error(
        "API redirected",
        exc_info=True,
        extra={
            "service": "core",
            "api": api_route,
            "status_code": "303",
            "method": api_method,
            "description": description,
        },
    )


def bad_request_400(logger, api_method, api_route, description):
    logger.error(
        "Bad request",
        exc_info=True,
        extra={
            "service": "core",
            "api": api_route,
            "status_code": "400",
            "method": api_method,
            "description": description,
        },
    )


def authentication_failed_401(logger, api_method, api_route, description):
    logger.error(
        "Authentication failed",
        exc_info=True,
        extra={
            "service": "core",
            "api": api_route,
            "status_code": "401",
            "method": api_method,
            "description": description,
        },
    )


def unauthorised_user_403(logger, api_method, api_route, description):
    logger.error(
        "Unauthorised user",
        exc_info=True,
        extra={
            "service": "core",
            "api": api_route,
            "status_code": "403",
            "method": api_method,
            "description": description,
        },
    )


def not_found_404(logger, api_method, api_route, description):
    logger.error(
        "Not found",
        exc_info=True,
        extra={
            "service": "core",
            "api": api_route,
            "status_code": "404",
            "method": api_method,
            "description": description,
        },
    )


def internal_server_error_500(logger, api_method, api_route, message, description):
    logger.error(
        message,
        exc_info=True,
        extra={
            "service": "core",
            "api": api_route,
            "status_code": "500",
            "method": api_method,
            "description": description,
        },
    )


def info_log(logger, api_method, api_route, message, description):
    logger.info(
        message,
        exc_info=True,
        extra={
            "service": "core",
            "api": api_route,
            "method": api_method,
            "description": description,
        },
    )


def error_log(logger, task, message, description):
    logger.error(
        message,
        exc_info=True,
        extra={
            "service": "core",
            "task": task,
            "description": description,
        },
    )
