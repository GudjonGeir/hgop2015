#!/bin/bash
if [ -z "$1" ]; then echo "Empty parameter for testenv IP Address"; exit -1; fi
if [ -z "$2" ]; then echo "Empty parameter for testenv PORT"; exit -1; fi
if [ -z "$3" ]; then echo "Empty parameter for last successful commit"; exit -1; fi

echo Executing remote...
ssh vagrant@"$1" "docker stop tictactoe;
				docker rm tictactoe;
				docker pull ggjonsson/tictactoe"$3";
				docker run -p 9000:"$2" --name tictactoe -d -e "NODE_ENV=production" ggjonsson/tictactoe"$3""
