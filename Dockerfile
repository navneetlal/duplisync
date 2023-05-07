FROM node:18.15-bullseye-slim

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile

COPY . .

RUN yarn build

FROM node:18.15-bullseye-slim as runtime

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install --production

COPY --from=0 /app/dist/ ./

ENV NODE_ENV=production

ENTRYPOINT [ "node", "-r", "dotenv/config", "main.js" ]