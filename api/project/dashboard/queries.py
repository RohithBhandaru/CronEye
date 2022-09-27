summary_stats = """
SELECT DISTINCT ON (aa.alias, bb.job_id)
    aa.alias,
    bb.job_id,
    cc.status,
    cc.time
FROM
    schedulers aa
    LEFT JOIN jobs bb ON aa.id = bb.scheduler_id
    LEFT JOIN execution_events cc ON bb.id = cc.job_id
WHERE
    aa.status = 'active'
    AND bb.is_active IS TRUE
ORDER BY
    aa.alias,
    bb.job_id,
    cc.time DESC
"""

job_stats = """
SELECT
    bb.job_id,
    bb.task,
    bb.next_scheduled_run,
    cc.time,
    cc.status,
    cc.return_value,
    cc.exception,
    cc.traceback
FROM
    schedulers aa
    LEFT JOIN jobs bb ON aa.id = bb.scheduler_id
    LEFT JOIN execution_events cc ON bb.id = cc.job_id
WHERE
    aa.status = 'active'
    AND bb.is_active IS TRUE
    AND cc.time >= '%s'
    AND cc.time <= '%s'
ORDER BY
    bb.job_id,
    cc.time ASC
"""

logs_query = """
SELECT
    aa.alias,
    aa.status,
    bb.job_id,
    bb.task,
    bb.next_scheduled_run,
    cc.status,
    cc.time,
    cc.return_value,
    cc.exception,
    cc.traceback
FROM
    schedulers aa
    LEFT JOIN jobs bb ON aa.id = bb.scheduler_id
    LEFT JOIN execution_events cc ON bb.id = cc.job_id
WHERE
    aa.status = 'active'
    AND bb.is_active IS TRUE
    __SEARCH_FILTER__
    __SCHEDULER_FILTER__
    __JOB_FILTER__
    __EVENT_FILTER__
ORDER BY
    cc.time DESC
__PAGINATION__
"""