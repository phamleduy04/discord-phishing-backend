FROM node:alpine
WORKDIR /home/container

COPY . .

RUN yarn install
RUN yarn run build

CMD ["node", "dist/src/main.js"]