#!/bin/bash
echo Pushing dockerfile

docker push ggjonsson/tictactoe

echo Executing remote...
ssh vagrant@192.168.33.10 "docker pull ggjonsson/tictactoe;
							docker stop tictactoe;
							docker rm tictactoe;
							docker run -p 9000:8080 --name tictactoe -d -e "NODE_ENV=production" ggjonsson/tictactoe"
