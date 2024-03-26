FROM node:20-alpine

COPY . /app/

WORKDIR /app

RUN npm i

RUN npm run build

CMD ["node", "dist/index.js"]