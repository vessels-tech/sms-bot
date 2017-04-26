#!/bin/bash

echo 'backing up mongodb'
BACKUP_NAME=`date +%s%3N`

mkdir -p "$BACKUP_DIR/$BACKUP_NAME"
mongodump --host mongo --db sms-bot --out "$BACKUP_DIR/$BACKUP_NAME"
