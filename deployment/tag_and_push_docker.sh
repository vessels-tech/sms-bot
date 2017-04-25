#!/bin/bash

echo 'Make sure you are logged in, with docker login'

dirname=$(echo ${PWD##*/} | sed 's/-//g')

function sms-bot() {
  name=_sms-bot
  docker tag $dirname$name lewisdaly/sms-bot:latest
  docker push lewisdaly/sms-bot:latest
}

function sms-mock-service() {
  name=_mock-service
  docker tag $dirname$name lewisdaly/sms-mock-service:latest
  docker push lewisdaly/sms-mock-service:latest
}

function sms-bot-ui() {
  name=_sms-ui
  docker tag $dirname$name lewisdaly/sms-bot-ui:latest
  docker push lewisdaly/sms-bot-ui:latest
}

case $1 in
  all)
    docker-compose build
    sms-bot
    sms-mock-service
    sms-bot-ui
    ;;
  sms-bot)
    docker-compose build sms-bot
    sms-bot
    ;;
  sms-mock-service)
    docker-compose build sms-mock-service
    sms-mock-service
    ;;
  sms-bot-ui)
    docker-compose build sms-bot-ui
    sms-bot-ui
    ;;
  *)
    echo "usage: $@ {all, sms-bot, sms-mock-service, sms-bot-ui}"
    exit 1
esac
