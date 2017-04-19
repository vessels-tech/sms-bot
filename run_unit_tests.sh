#!/bin/bash

#setup envs
#docker-compose up - maybe with test variant docker-compose later on
#Override CMD!
#run test script

LAST_STAGE=$STAGE
STAGE=testlocal
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

docker-compose -f docker-compose.yml -f docker-compose.test.yml up -d sms-bot

docker exec -it sms-bot bash -c "/usr/src/app/test/test.sh"

STAGE=$LAST_STAGE
