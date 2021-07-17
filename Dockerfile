FROM python:3.8-slim

ENV FLASK_ENV=production
ENV PYTHONUNBUFFERED=1
ENV PIP_NO_CACHE_DIR=1

COPY requirements.txt /app/requirements.txt

WORKDIR /app

RUN pip install -r requirements.txt

COPY app/ /app

CMD ["gunicorn", "--bind=0.0.0.0:5000", "--workers=1", "--worker-class", "eventlet", "app:app"]
