#!/bin/bash
if [ -z "$1" ]; then echo "Empty parameter for IP Address"; exit -1; fi
if [ -z "$2" ]; then echo "Empty parameter for PORT"; exit -1; fi
if [ -z "$3" ]; then echo "Empty parameter for last successful commit"; exit -1; fi

echo Executing remote...
ssh vagrant@"$1" "docker stop tictactoe-"$2";
				docker rm tictactoe-"$2";
				docker pull ggjonsson/tictactoe:"$3";
				docker run -p "$2":8080 --name tictactoe-"$2" -d -e "NODE_ENV=production" ggjonsson/tictactoe:"$3""
