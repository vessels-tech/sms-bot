#!/bin/bash

green='\033[0;32m'
yellow='\033[33m'
bold='\033[1m'
endColor='\033[0m'

# Display welcome message
echo -e "${green}Configuring Environment Variables\n${endColor}"

if [ -s .env ]; then
  echo -e "${bold}Loading super secret variables from `pwd`/.env${endColor}"
  source .env
else
  echo -e "${yellow}No .env file found. Creating one. Please fill it out.${endColor}"
  echo -e 'export TOKEN=<INSERT_TOKEN_HERE>\n' > .env
fi


if [ -z $TOKEN ]
then
  echo -e "${yellow}Warning: TOKEN not set. Cannot set default.${endColor}"
fi

if [ -z $DISABLE_REDIS ]
then
  echo -e "${yellow}DISABLE_REDIS not set. Setting to false.${endColor}"
  DISABLE_REDIS=false
fi

if [ -z $MESSENGER_VALIDATION_TOKEN ]
then
  echo -e "${yellow}Warning: MESSENGER_VALIDATION_TOKEN not set. Cannot set default.${endColor}"
fi

echo -e "${bold}Configured Environment Variables:${endColor}"
echo "  - TOKEN:                          $TOKEN"
echo "  - DISABLE_REDIS:                  $DISABLE_REDIS"
echo "  - MESSENGER_VALIDATION_TOKEN      $MESSENGER_VALIDATION_TOKEN"

export TOKEN
export DISABLE_REDIS
export MESSENGER_VALIDATION_TOKEN
