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