FROM node:alpine as ts-compiler
WORKDIR /home/container

COPY . .

RUN yarn install
RUN yarn run build

FROM node:alpine as ts-remover
WORKDIR /home/container

COPY --from=ts-compiler /home/container/package*.json ./
COPY --from=ts-compiler /home/container/dist ./
RUN yarn install --production

FROM gcr.io/distroless/nodejs:16
WORKDIR /home/container
COPY --from=ts-remover /home/conatiner ./
USER 1000
CMD ["dist/main"]