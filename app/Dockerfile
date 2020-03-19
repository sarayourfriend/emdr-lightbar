FROM python:3-alpine

WORKDIR /emdr_lightbar

COPY requirements.txt ./

RUN apk add --virtual .build-deps gcc musl-dev libffi-dev openssl-dev
RUN pip install -r requirements.txt
RUN apk del --purge .build-deps

COPY . .

EXPOSE 5000
CMD ["uwsgi", "uwsgi.ini"]
