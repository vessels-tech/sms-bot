#!/bin/bash

echo 'backing up mongodb'
mongodump --host mongo --db sms-bot --out /backups
