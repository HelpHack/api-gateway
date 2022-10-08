FROM node:16.17-alpine

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm i

CMD ["node", "index.js"]