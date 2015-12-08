#!/bin/bash
if [ -z "$1" ]; then echo "Empty parameter for testenv IP Address"; exit -1; fi
npm install
export ACCEPTANCE_URL=http://"$1"
grunt mochaTest:acceptance
