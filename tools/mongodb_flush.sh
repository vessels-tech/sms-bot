#!/bin/bash

docker exec -it vesselssmsbot_sms-utils_1 bash -c "/usr/src/app/flush_mongodb_local.sh"
