FROM node:20-alpine AS builder

RUN apk add --no-cache bash curl git

WORKDIR /app

COPY . .

RUN npm install

RUN cd client && npm install

RUN node node_modules/puppeteer/install.js
RUN cd client && npm run build-bypass-errors
RUN npm run build

FROM node:20-alpine

RUN apk add --no-cache bash

WORKDIR /app

COPY --from=builder /app/build ./
COPY --from=builder /app/public/collectibles ./public/collectibles
COPY --from=builder /app/client/dist ./public/client
COPY --from=builder /app/.env ./.env
RUN mkdir -p ./storage
RUN mkdir -p ./config

RUN npm install --omit=dev

EXPOSE 3000

CMD ["node", "index.js"]
