from datetime import datetime

from . import db


class Jobs(db.Model):
    __tablename__ = "jobs"
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    job_id = db.Column(db.String, nullable=False)
    task = db.Column(db.String, nullable=False)


class Events(db.Model):
    __tablename__ = "events"
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    job_id = db.Column(db.Integer, db.ForeignKey("jobs.id"))
    job = db.relationship("Events", backref=db.backref("jobs", uselist=True))
    status = db.Column(db.String, nullable=False)
    time = db.Column(db.DateTime, default=datetime.now)
    message = db.Column(db.Text, nullable=True)

    def __init__(self, job_id, status, start_time, message=""):
        self.job_id = job_id
        self.status = status
        self.time = start_time
        self.message = message

    def to_json(self):
        return {
            "job_id": self.job_id,
            "task": self.job.task,
            "status": self.status,
            "time": self.time,
            "message": self.message,
        }
