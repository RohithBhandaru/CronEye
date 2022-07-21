from flask import Blueprint

listener = Blueprint("listener", __name__)

from . import routes
