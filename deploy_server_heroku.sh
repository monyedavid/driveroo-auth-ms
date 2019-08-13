#! /bin/bash
yarn build:server
docker build -t lilmakijr/d-auth-ms:latest .
docker push lilmakijr/d-auth-ms
git add . 
git commit -m "new deploy | Docker Script | latest"
heroku container:push web
heroku container:release web