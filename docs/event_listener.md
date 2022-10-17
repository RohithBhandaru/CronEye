# Event Listener API

Push APScheduler events to CronEye.

**URL**: `/event`

**Method**: `POST`

**Auth required**: YES

**Headers**:

```
{
    "Authorization": "Token xxxxxxxxx"
}
```

**Payload**:

1. Scheduler related events (`EVENT_SCHEDULER_STARTED, EVENT_SCHEDULER_SHUTDOWN, EVENT_SCHEDULER_PAUSED, EVENT_SCHEDULER_RESUMED`)

```
{
    "event_code": 1,    # Number corresponding to the code
    "alias": "abc"      # Scheduler name
}
```

2. Job addition event (`EVENT_JOB_ADDED`)

```
{
    "event_code": 1,    # Number corresponding to the code
    "job_store": "abc", # Job store name
    "job_id": 1,        # Job ID
    "task": "abc        # Job name
}
```

3. Job deletion event (`EVENT_JOB_REMOVED`)

```
{
    "event_code": 1,    # Number corresponding to the code
    "job_id": 1,        # Job ID
}
```

4. Job submission event (`EVENT_JOB_SUBMITTED, EVENT_JOB_MAX_INSTANCES`)

```
{
    "event_code": 1,                        # Number corresponding to the code
    "job_id": 1,                            # Job ID
    "time": 1234567890,                     # Timestamp in UTC
    "next_scheduled_run_time": 1234567890   # Timestamp in UTC
}
```

5. Job error event (`EVENT_JOB_ERROR, EVENT_JOB_MISSED`)

```
{
    "event_code": 1,    # Number corresponding to the code
    "job_id": 1,        # Job ID
    "time": 1234567890, # Timestamp in UTC
    "exception": "",    # Exception thrown by the job
    "traceback": ""     # Traceback for the error
}
```

6. Successful job run (`EVENT_JOB_EXECUTED`)

```
{
    "event_code": 1,    # Number corresponding to the code
    "job_id": 1,        # Job ID
    "time": 1234567890, # Timestamp in UTC
    "return_value": ""  # Return value of the job (if any)
}
```

## Success response

Description:

Code: `200`

Response:

```
{
    "status": "success",
    "message": "",
    "data": {}
}
```

## Error responses

### Bad request

Description:

Code: `400`

Response:

```
{
    "status": "failure",
    "message": "Bad request",
    "data": {}
}
```

### Unauthorised user

Description:

Code: `401`

Response:

```
{
    "status": "failure",
    "message": "Unauthorised user",
    "data": {}
}
```

### Internal server error

Description:

Code: `500`

Response:

```
{
    "status": "failure",
    "message": "Internal server error",
    "data": {}
}
```
