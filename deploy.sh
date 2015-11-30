#!/bin/bash
if [ -z "$1" ]; then echo "Empty parameter for testenv IP Address"; exit -1; fi
echo Pushing dockerfile

docker push ggjonsson/tictactoe

echo Executing remote...
ssh vagrant@"$1" "docker stop tictactoe;
							docker rm tictactoe;
							docker pull ggjonsson/tictactoe;
							docker run -p 9000:8080 --name tictactoe -d -e "NODE_ENV=production" ggjonsson/tictactoe"
