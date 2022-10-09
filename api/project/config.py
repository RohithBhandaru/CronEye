import os
from dotenv import load_dotenv

basedir = os.path.abspath(os.path.dirname(__file__))
dotenv_path = os.path.join(os.path.dirname(__file__), ".env")
if os.path.exists(dotenv_path):
    load_dotenv(dotenv_path)


class BaseConfig:
    """Base configuration"""

    FLASK_ENV = os.environ.get("FLASK_ENV", "qa")
    JSON_SORT_KEYS = False
    SECRET_KEY = os.environ.get("SECRET_KEY", "cr0neye-s3cret-Key")

    TOKEN_EXPIRY_DAYS = 5
    TOKEN_EXPIRY_SECONDS = 0

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

    BCRYPT_LOG_ROUNDS = 4

    ADMIN_USERNAME = os.environ.get("ADMIN_USERNAME")
    ADMIN_EMAIL = os.environ.get("ADMIN_EMAIL")
    ADMIN_PASSWORD = os.environ.get("ADMIN_PASSWORD")

    DATABASE_HOST = os.environ.get("DATABASE_HOST", "")
    DATABASE_NAME = os.environ.get("DATABASE_NAME", "")
    DATABASE_USER = os.environ.get("DATABASE_USER", "")
    DATABASE_PASSWORD = os.environ.get("PROD_DATABASE_PASSWORD", "")

    SQLALCHEMY_DATABASE_URI = os.environ.get("PROD_DATABASE_URL", "")


class QaConfig(BaseConfig):
    """Testing configuration"""

    DEBUG = True
    TESTING = True

    BCRYPT_LOG_ROUNDS = 10

    DATABASE_HOST = os.environ.get("DATABASE_HOST", "")
    DATABASE_NAME = os.environ.get("DATABASE_NAME", "")
    DATABASE_USER = os.environ.get("DATABASE_USER", "")
    DATABASE_PASSWORD = os.environ.get("QA_DATABASE_PASSWORD", "")

    SQLALCHEMY_DATABASE_URI = os.environ.get("QA_DATABASE_URL", "")


env_mapper = {"production": ProductionConfig, "qa": QaConfig}
