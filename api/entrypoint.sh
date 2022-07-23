#!/bin/sh
flask db upgrade

flask deploy

gunicorn -b 0.0.0.0:5000 manage:app