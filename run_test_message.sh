#!/bin/bash

#We can probably make this it's own test thingy with mocha, but for now Curl and comments work.

MESSAGE=`node -p "encodeURIComponent('$1')"`
echo $MESSAGE
curl "localhost:3000/message?number=0404404404&message=$MESSAGE"
