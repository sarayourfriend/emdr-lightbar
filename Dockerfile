FROM python:3.9-slim

ENV QUART_ENV=production
ENV PYTHONUNBUFFERED=1
ENV PIP_NO_CACHE_DIR=1

RUN apt update && apt upgrade -y && apt install nodejs npm -y
RUN npm install -g yarn

COPY package.json /app/package.json
COPY yarn.lock /app/yarn.lock
COPY requirements.txt /app/requirements.txt

WORKDIR /app

RUN yarn install --pure-lockfile --prod && yarn cache clean
RUN pip install -r requirements.txt

COPY app/ /app/app

RUN yarn run build

CMD ["hypercorn", "--bind=0.0.0.0:5000", "--workers=4", "app.app:app", "--access-log", "-"]
