FROM node:20-alpine

RUN apk update && apk add vim

COPY . /app/

WORKDIR /app

RUN npm i

RUN npm run build

CMD ["node", "dist/src/index.js"]