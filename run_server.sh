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

TOKEN=$TOKEN DISABLE_REDIS=$DISABLE_REDIS CLEAR_REDIS_ON_RESTART=$CLEAR_REDIS_ON_RESTART docker-compose up
