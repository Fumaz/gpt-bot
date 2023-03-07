FROM node:19-bullseye

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY . /usr/src/app

RUN rm -rf node_modules/*
