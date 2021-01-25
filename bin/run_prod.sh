#! /bin/sh
cd app/frontend
yarn install && yarn build
env FLASK_ENV=production uwsgi uwsgi.ini
