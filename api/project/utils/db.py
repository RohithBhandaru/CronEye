import psycopg2
from functools import lru_cache
from flask import current_app


class DbConnection:
    def __init__(self):
        pass

    @staticmethod
    @lru_cache(maxsize=1)
    def get_db():
        return psycopg2.connect(
            host=current_app.config["DATABASE_HOST"],
            database=current_app.config["DATABASE_NAME"],
            user=current_app.config["DATABASE_USER"],
            password=current_app.config["DATABASE_PASSWORD"],
        )

    def get_db_connection_instance(self):
        conn = self.get_db()

        try:
            cur = conn.cursor()
            # Check if the connection is live
            cur.execute("SELECT 1")
        except Exception:
            self.get_db.cache_clear()
            conn = self.get_db()
            cur = conn.cursor()

        return conn, cur
