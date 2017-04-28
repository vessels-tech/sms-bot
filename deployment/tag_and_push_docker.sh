#!/bin/bash

echo 'Make sure you are logged in, with docker login'
#Get the dir 1 level up
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && cd ../ && pwd )"
dirname=$(echo ${DIR##*/} | sed 's/-//g')

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

function sms-utils() {
  name=_sms-utils
  docker tag $dirname$name lewisdaly/sms-utils:latest
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
    docker-compose build sms-bot
    sms-bot
    ;;
  sms-mock-service)
    docker-compose build sms-mock-service
    sms-mock-service
    ;;
  sms-bot-ui)
    docker-compose build sms-ui
    sms-bot-ui
    ;;
  sms-utils)
    docker-compose build sms-utils
    sms-utils
    ;;
  *)
    echo "usage: $@ {all, sms-bot, sms-mock-service, sms-bot-ui, sms-utils}"
    exit 1
    ;;
esac
