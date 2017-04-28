#!/bin/bash

#We can probably make this it's own test thingy with mocha, but for now Curl and comments work.

#Test Messages:
## "Well 1234 has a reading of 34.44m today"
## "313603"
##
## "What is the reading of well 1234 in 321423?"


#only use for get!
# MESSAGE=`node -p "encodeURIComponent('$1')"`
MESSAGE=$1
echo $MESSAGE
# curl "localhost:3000/incoming/1/cli?number=0404404404&message=$MESSAGE"
# curl "https://dev1.kdoveton.com/incoming/1/cli?number=0404404404&message=$MESSAGE"
# curl "sms-bot.test-stack.41304d9c.svc.dockerapp.io:3000/incoming/1/cli?number=0404404404&message=$MESSAGE"

# MESSAGE=\"$1\"
# echo $MESSAGE
DATA="{\"message\":\"$MESSAGE\", \"number\":12345}"
echo $DATA
#
# curl -X POST "localhost:3000/incoming/1/facebookBot" -H 'content-type: application/json' -d "$DATA"
curl -X POST "localhost:3000/incoming/2/cli" -H 'content-type: application/json' -d "$DATA"
