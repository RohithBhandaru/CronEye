import os


class BaseConfig:
    """Base configuration"""

    FLASK_ENV = os.environ.get("FLASK_ENV", "qa")
    JSON_SORT_KEYS = False
    SECRET_KEY = os.environ.get("SECRET_KEY", "apseye-s3cret-Key")

    SQLALCHEMY_TRACK_MODIFICATIONS = False
    CORS_HEADERS = "Content-Type"
    PYTHONUNBUFFERED = "1"
    LC_ALL = "en_US.utf-8"
    LANG = "en_US.utf-8"

    LISTENER_TOKEN = os.environ.get("LISTENER_TOKEN", "")


class ProductionConfig(BaseConfig):
    """Production configuration"""

    DEBUG = False
    TESTING = False

    DATABASE_HOST = os.environ.get("DATABASE_HOST")
    DATABASE_NAME = os.environ.get("DATABASE_NAME")
    DATABASE_USER = os.environ.get("DATABASE_USER")
    DATABASE_PASSWORD = os.environ.get("PROD_DATABASE_PASSWORD")

    SQLALCHEMY_DATABASE_URI = os.environ.get("PROD_DATABASE_URL_CORE")


class QaConfig(BaseConfig):
    """Testing configuration"""

    DEBUG = True
    TESTING = True

    DATABASE_HOST = os.environ.get("DATABASE_HOST")
    DATABASE_NAME = os.environ.get("DATABASE_NAME")
    DATABASE_USER = os.environ.get("DATABASE_USER")
    DATABASE_PASSWORD = os.environ.get("QA_DATABASE_PASSWORD")

    SQLALCHEMY_DATABASE_URI = os.environ.get("QA_DATABASE_URL_CORE")


env_mapper = {"production": ProductionConfig, "qa": QaConfig}
