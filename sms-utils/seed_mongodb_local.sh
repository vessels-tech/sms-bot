#!/bin/bash
echo "seeding mongodb"
mongoimport --host mongo --db sms-bot --collection Reading --type json --file /seed-data/Reading.json --jsonArray
mongoimport --host mongo --db sms-bot --collection IntegrationType --type json --file /seed-data/IntegrationType.json --jsonArray
mongoimport --host mongo --db sms-bot --collection Service --type json --file /seed-data/Service.json --jsonArray
