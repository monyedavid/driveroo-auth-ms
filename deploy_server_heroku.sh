#! /bin/bash
yarn build:server
docker build -t lilmakijr/d-auth-ms:latest .
docker push lilmakijr/d-auth-ms
heroku container:push web
heroku container:release web