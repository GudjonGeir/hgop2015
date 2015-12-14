#!/bin/bash
if [ -z "$1" ]; then echo "Empty parameter for testenv IP Address"; exit -1; fi
export MOCHA_REPORTER=xunit
export MOCHA_REPORT=server-tests.xml
npm install
export ACCEPTANCE_URL=http://"$1":9000
grunt mochaTest:load
