![Cron Eye Title](/assets/croneye-title.svg)

# Welcome

CronEye is an open source tool to gain obervability into your APScheduler based jobs.

## Get started

### Build yourself

1. Add a **.env** file in [db](/db/) folder based on the [template](/db/.env.template).
2. Add a **.env** file in [api](/api/project/) folder based on the [template](/api/project/.env.template).
    - `LISTENER_TOKEN` variable needs to be used by your application as a `Token` based authentication header to call the listener APIs.
    - `ADMIN_EMAIL, ADMIN_PASSWORD` can be used to log into the **CronEye** application.
    - Ensure that postgres related variables are sames as the ones given in the previous step.

### Use docker

Run docker image

```
docker run croneye/app:latest
```

### Use kubernetes

```
kubectl apply -f https://github.com/RohithBhandaru/CronEye/croneye_app.yml
```

### Documentation

Docummentation can be accessed [here](/docs/)
