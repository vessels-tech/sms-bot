#!/bin/bash

mongo sms-bot --host mongo --eval  "db.IntegrationType.drop()"
mongo sms-bot --host mongo --eval  "db.Service.drop()"
mongo sms-bot --host mongo --eval  "db.Reading.drop()"
