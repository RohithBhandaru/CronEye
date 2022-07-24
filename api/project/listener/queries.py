upsert_scheduler = """
INSERT INTO schedulers (alias, status)
    VALUES (%s, %s)
ON CONFLICT (alias)
    DO UPDATE SET
        status = EXCLUDED.status
"""

upsert_job = """
INSERT INTO jobs (job_id, task)
    VALUES (%s, %s)
ON CONFLICT (job_id)
    DO UPDATE SET
        task = EXCLUDED.task
"""

update_job_activity = """
UPDATE
    jobs
SET
    is_active = %s
WHERE
    job_id = %s
"""

add_job_execution_event = """
INSERT INTO events (job_id, status, time, return_value, exception, traceback)
    VALUES (
        (
            SELECT
                id
            FROM
                jobs
            WHERE
                job_id = %s
        ), 
        %s,
        %s,
        %s,
        %s,
        %s
    )
"""

update_job_schedule = """
UPDATE
    jobs
SET
    next_scheduled_run = %s
WHERE
    job_id = %s
"""
