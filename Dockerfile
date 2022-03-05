FROM alpine:3.15
RUN apk update && apk add curl
RUN apk add nodejs npm
# WORKDIR create the directory and then execute cd
WORKDIR /home/container

RUN curl -f https://get.pnpm.io/v6.16.js | node - add --global pnpm

COPY ./package.json ./pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .

CMD [ "pnpm", "start" ]