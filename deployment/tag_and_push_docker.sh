#!/bin/bash

echo 'Make sure you are logged in, with docker login'

docker tag vesselssmsbot_sms-bot lewisdaly/sms-bot:latest
docker push lewisdaly/sms-bot:latest

docker tag vesselssmsbot_mock-service lewisdaly/sms-mock-service:latest
docker push lewisdaly/sms-mock-service:latest
