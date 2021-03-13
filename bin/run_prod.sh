#! /bin/sh
cd app
env FLASK_ENV=production uwsgi uwsgi.ini
