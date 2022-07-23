import jwt, os
from datetime import datetime, timedelta
from flask import current_app

from . import db, bcrypt


class UserGroups(db.Model):
    __tablename__ = "user_groups"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(128), unique=True, nullable=False)

    def __init__(self, name):
        self.name = name


class Users(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    username = db.Column(db.String(128), unique=True, nullable=False)
    email = db.Column(db.String(128), unique=True, nullable=False)
    password = db.Column(db.String(256), nullable=False)
    first_name = db.Column(db.String(128), nullable=True)
    last_name = db.Column(db.String(128), nullable=True)
    active = db.Column(db.Boolean(), default=True, nullable=False)
    created_date = db.Column(db.DateTime, default=datetime.now(), nullable=False)
    group_id = db.Column(db.Integer, db.ForeignKey("user_groups.id"))
    group = db.relationship("UserGroups", backref=db.backref("user_groups", uselist=True))
    token = db.Column(db.String, nullable=True)

    def __init__(
        self,
        username,
        email,
        password,
        first_name=None,
        last_name=None,
        group_id=None,
    ):
        self.username = username
        self.email = email
        self.password = bcrypt.generate_password_hash(password, current_app.config.get("BCRYPT_LOG_ROUNDS")).decode()
        self.first_name = first_name
        self.last_name = last_name
        self.group_id = group_id

    def to_json(self):
        return {
            "id": self.id,
            "username": self.username,
            "first_name": self.first_name,
            "last_name": self.last_name,
            "email": self.email,
            "active": self.active,
            "user_group": self.group.name,
            "client_code": self.client.client_code if self.client else None,
        }

    def encode_auth_token(self, user_id):
        try:
            payload = {
                "exp": datetime.utcnow()
                + timedelta(
                    days=current_app.config.get("TOKEN_EXPIRY_DAYS"),
                    seconds=current_app.config.get("TOKEN_EXPIRY_SECONDS"),
                ),
                "iat": datetime.utcnow(),
                "id": user_id,
            }

            return jwt.encode(payload, current_app.config.get("SECRET_KEY"), algorithm="HS256")
        except Exception as e:
            return e

    @staticmethod
    def decode_auth_token(auth_token):
        try:
            payload = jwt.decode(auth_token, current_app.config.get("SECRET_KEY"), algorithms=["HS256"])
            return payload.get("id")
        except jwt.ExpiredSignatureError:
            return "Signature expired. Please login again."
        except jwt.InvalidTokenError:
            return "Invalid token. Please login again."

    def initiate_admin_user():
        if len(UserGroups.query.all()) == 0:
            user_group_admin = UserGroups(name="admin")
            db.session.add(user_group_admin)
            db.session.commit()

        if Users.query.filter_by(email=os.environ.get("ADMIN_EMAIL")).first() is None:
            admin = Users(
                username=os.environ.get("ADMIN_USERNAME"),
                email=os.environ.get("ADMIN_EMAIL"),
                password=os.environ.get("ADMIN_PASSWORD"),
                group_id=1,
            )
            db.session.add(admin)
            db.session.commit()

        return True


class Jobs(db.Model):
    __tablename__ = "jobs"
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    job_id = db.Column(db.String, nullable=False)
    task = db.Column(db.String, nullable=False)
    is_active = db.Column(db.BOOLEAN, nullable=False, default=True)
    next_scheduled_run = db.Column(db.DateTime, default=datetime.now)

    def __init__(self, job_id, task, is_active=True):
        self.job_id = job_id
        self.task = task
        self.is_active = is_active


class ExecutionEvents(db.Model):
    __tablename__ = "execution_events"
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    job_id = db.Column(db.Integer, db.ForeignKey("jobs.id"))
    job = db.relationship("Jobs", backref=db.backref("execution_events", uselist=True))
    status = db.Column(db.String, nullable=False)
    time = db.Column(db.DateTime, default=datetime.now)
    return_value = db.Column(db.Text, nullable=True)
    exception = db.Column(db.String, nullable=True)
    traceback = db.Column(db.Text, nullable=True)

    def __init__(self, job_id, status, start_time, return_value="", exception="", traceback=""):
        self.job_id = job_id
        self.status = status
        self.time = start_time
        self.return_value = return_value
        self.exception = exception
        self.traceback = traceback

    def to_json(self):
        return {
            "job_id": self.job_id,
            "task": self.job.task,
            "status": self.status,
            "time": self.time,
            "return_value": self.return_value,
            "exception": self.exception,
            "traceback": self.traceback,
        }
