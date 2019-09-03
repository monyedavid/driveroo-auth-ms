#! /bin/bash
yarn build:server
docker build -t lilmakijr/d-auth-ms:latest .
docker push lilmakijr/d-auth-ms
ssh root@198.199.88.94 "docker pull lilmakijr/d-auth-ms:latest && docker tag lilmakijr/d-auth-ms:latest dokku/driveroo-auth-ms:latest && dokku tags:deploy driveroo-auth-ms latest"