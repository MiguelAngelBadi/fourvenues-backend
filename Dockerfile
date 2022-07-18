FROM node:16.15.1-alpine as development

WORKDIR /usr/src/app

COPY package.json ./
COPY yarn.lock ./

ARG NODE_ENV=development
ENV NODE_ENV=${NODE_ENV}

RUN yarn install --only=development

COPY . .

RUN yarn build

CMD ["node", "dist/main"]