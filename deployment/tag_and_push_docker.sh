#!/bin/bash

echo 'Make sure you are logged in, with docker login'

function sms-bot() {
  docker tag vesselssmsbot_sms-bot lewisdaly/sms-bot:latest
  docker push lewisdaly/sms-bot:latest
}

function sms-mock-service() {
  docker tag vesselssmsbot_mock-service lewisdaly/sms-mock-service:latest
  docker push lewisdaly/sms-mock-service:latest
}

function sms-bot-ui() {
  docker tag vesselssmsbot_sms-ui lewisdaly/sms-bot-ui:latest
  docker push lewisdaly/sms-bot-ui:latest
}

function sms-utils() {
  docker tag vesselssmsbot_sms-utils lewisdaly/sms-utils:latest
  docker push lewisdaly/sms-utils:latest
}

case $1 in
  all)
    docker-compose build
    sms-bot
    sms-mock-service
    sms-bot-ui
    sms-utils
    ;;
  sms-bot)
    docker-compose build
    sms-bot
    ;;
  sms-mock-service)
    docker-compose build
    sms-mock-service
    ;;
  sms-bot-ui)
    docker-compose build
    sms-bot-ui
    ;;
  sms-utils)
    docker-compose build
    sms-utils
  *)
    echo "usage: $@ {all, sms-bot, sms-mock-service, sms-bot-ui, sms-utils}"
    exit 1
esac
