FROM node:lts-alpine3.15
# ARG GITHUB_TOKEN
ENV NODE_ENV production

WORKDIR /api

COPY /lib ./lib
COPY /static ./static
COPY /package.json ./pacakge.json
COPY /package-lock.json ./package-lock.json
COPY /static ./static
COPY /index.js ./index.js
COPY /server.js ./server.js
COPY /dev.js ./dev.js

RUN npm install

CMD ["node", "index.js"]