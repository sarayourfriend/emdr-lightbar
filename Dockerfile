FROM python:3.9-slim

ENV QUART_ENV=production
ENV PYTHONUNBUFFERED=1
ENV PIP_NO_CACHE_DIR=1

COPY requirements.txt /app/requirements.txt

WORKDIR /app

RUN pip install -r requirements.txt

COPY app/ /app/app

CMD ["hypercorn", "--bind=0.0.0.0:5000", "--workers=4", "app.app:app", "--access-log", "-"]
