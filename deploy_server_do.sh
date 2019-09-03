#! /bin/bash
yarn build:server
yarn build:extras
docker build -t lilmakijr/d-auth-ms:latest .
docker push lilmakijr/d-a-ms
ssh root@162.243.166.172 "docker pull lilmakijr/d-auth-ms:latest && docker tag lilmakijr/d-auth-ms:latest dokku/driveroo-auth-ms:latest && dokku tags:deploy driveroo-auth-ms latest"