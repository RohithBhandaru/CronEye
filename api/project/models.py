from datetime import datetime

from . import db


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
