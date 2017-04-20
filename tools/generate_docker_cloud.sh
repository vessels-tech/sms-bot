#!/bin/bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

source $DIR/../.env

sed "s/TOKEN=/TOKEN=$TOKEN/g" $DIR/../docker-cloud.yml | pbcopy

echo 'copied to your clipboard!'
