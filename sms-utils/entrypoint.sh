#!/bin/bash
rm -rf /var/log/cron.log
touch /var/log/cron.log

#TODO: seed things conditionally etc
if [ "$SEED_FROM_S3" = true ]; then
  echo 'seeding mongo from s3'
  echo 'ERROR: lewis has not implemented this'
  exit 1
fi

if [ "$SEED_LOCAL" = true ]; then
  if [ -d /seed-data ]; then
    echo 'seeding mongodb'
    mongoimport --host mongo --db sms-bot --collection test --type json --file /seed-data/test.json --jsonArray
  else
    echo 'ERROR: seed data not found: in /seed-data'
    exit 1
  fi
fi

if [ "$SCHEDULE_S3_BACKUPS" = true ]; then
  echo "Scheduling backups or something"
  echo "ERROR: lewis has not implemented this"
  exit 1
fi

#Use this for testing
if [ "$SCHEDULE_LOCAL_BACKUPS" = true ]; then
  echo 'Scheduling Local backups'
  echo -e '* * * * * root mongodump --host mongo --db sms-bot --out /backups &>> /var/log/cron.log 2>&1' > /etc/cron.d/test-cron
  # echo '* * * * * root echo "HELLO KEVIN" >> /var/log/cron.log 2>&1' > /etc/cron.d/test-cron
  chmod 0644 /etc/cron.d/test-cron
fi

echo 'Init done. Waiting forever now.'
cron && tail -f /var/log/cron.log
