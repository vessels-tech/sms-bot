#!/bin/bash

source ./env/env$STAGE.sh

if [ "$1" == "build" ]
then
	docker-compose build
	docker-compose pull
fi

if [ "$1" == "clear" ]
then
	docker-compose rm -fv
	docker-compose build
	docker-compose pull
fi

if [ "$1" == "dev1" ]
then
  TOKEN=$TOKEN DISABLE_REDIS=$DISABLE_REDIS MESSENGER_VALIDATION_TOKEN=$MESSENGER_VALIDATION_TOKEN MESSENGER_PAGE_ACCESS_TOKEN=$MESSENGER_PAGE_ACCESS_TOKEN docker-compose -f docker-compose.dev1.yml up
  exit 0
fi

TOKEN=$TOKEN \
DISABLE_REDIS=$DISABLE_REDIS \
MESSENGER_VALIDATION_TOKEN=$MESSENGER_VALIDATION_TOKEN \
MESSENGER_PAGE_ACCESS_TOKEN=$MESSENGER_PAGE_ACCESS_TOKEN \
docker-compose up
