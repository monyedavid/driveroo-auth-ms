FROM node

WORKDIR /driveroo-auth-ms

COPY ./package.json .

RUN npm i -g yarn
RUN npm i -g reflect-metadata
RUN yarn install

COPY ./build  ./build
COPY ./.env  ./.env

WORKDIR ./build

ENV NODE_ENV production

EXPOSE 4000

CMD ["node", "index.js"]