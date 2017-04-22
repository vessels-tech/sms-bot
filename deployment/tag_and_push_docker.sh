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

case $1 in
  all)
    docker-compose build
    sms-bot
    sms-mock-service
    sms-bot-ui
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
  *)
    echo "usage: $@ {all, sms-bot, sms-mock-service, sms-bot-ui}"
    exit 1
esac
