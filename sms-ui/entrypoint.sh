#!/bin/bash
echo "sms-ui entrypoint"
webpack -p --progress
npm run serve
