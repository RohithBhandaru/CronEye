FROM python:3.8-slim-buster

RUN apt-get update \
    && apt-get -y install libpq-dev gcc

WORKDIR /usr/src/app

RUN pip install --upgrade pip
COPY ./requirements.txt /usr/src/app/requirements.txt
RUN pip install -r requirements.txt

COPY . /usr/src/app
RUN chmod +x ./entrypoint.sh

CMD ["/bin/bash", "./entrypoint.sh"]