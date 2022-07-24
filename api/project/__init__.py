import os
from flask import Flask
from flask_bcrypt import Bcrypt
from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS, cross_origin

from .config import env_mapper

db = SQLAlchemy()
migrate = Migrate()
bcrypt = Bcrypt()
cors = CORS()


def create_app():
    app = Flask(__name__)

    app.config.from_object(env_mapper[os.environ.get("FLASK_ENV", "qa")])
    app.config["SQLALCHEMY_ENGINE_OPTIONS"] = {
        "pool_pre_ping": True,
        "pool_recycle": 2400,
    }

    db.init_app(app)
    migrate.init_app(app, db)
    bcrypt.init_app(app)
    cors.init_app(app, supports_credentials=True)

    from .auth import auth as auth_blueprint

    # from .listener import listener as listener_blueprint
    # from .dashboard import dashboard as dashboard_blueprint

    app.register_blueprint(auth_blueprint, url_prefix="/api/auth")
    # app.register_blueprint(listener_blueprint, url_prefix="/api/listener")
    # app.register_blueprint(dashboard_blueprint, url_prefix="/api/dashboard")

    @app.shell_context_processor
    def ctx():
        return {"app": app, "db": db}

    return app
