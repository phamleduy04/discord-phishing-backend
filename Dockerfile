FROM node:alpine

# WORKDIR create the directory and then execute cd
WORKDIR /home/container

COPY ./package.json ./yarn.lock ./
RUN npm ci

COPY . .