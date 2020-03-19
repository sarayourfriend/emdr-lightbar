FROM python:3-alpine

WORKDIR /emdr_lightbar

COPY requirements.txt ./

RUN apk add --virtual .build-deps gcc musl-dev libffi-dev openssl-dev
RUN pip install -r requirements.txt
RUN pip install gevent gevent-websocket uwsgi
RUN apk del --purge .build-deps

COPY . .

CMD uwsgi --http :5000 --gevent 1000 --http-websockets --master --wsgi-file app.py --callable app
