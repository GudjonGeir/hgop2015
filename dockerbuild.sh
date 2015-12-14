#!/bin/bash
export MOCHA_REPORTER=xunit
export MOCHA_REPORT=server-tests.xml
echo Cleaning...
rm -rf ./dist

echo Building app
grunt
rc=$?; if [[ $rc != 0 ]]; then exit $rc; fi

cp ./Dockerfile ./dist/

cd dist
npm install --production
rc=$?; if [[ $rc != 0 ]]; then exit $rc; fi

echo Building docker image
docker build -t ggjonsson/tictactoe .
rc=$?; if [[ $rc != 0 ]]; then exit $rc; fi

echo "Done"
