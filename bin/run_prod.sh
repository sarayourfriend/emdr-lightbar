#! /bin/sh
yarn install
npx esbuild app/static/therapist-session.js --bundle --minify --sourcemap --outfile=app/static/dist/therapist-session.min.js 
npx esbuild app/static/client-session.js --bundle --minify --sourcemap --outfile=app/static/dist/client-session.min.js
pip install -r requirements.txt
cd app
env FLASK_ENV=production uwsgi uwsgi.ini