FROM library/node:22 as base

FROM base AS dependencies

WORKDIR /usr/src/app
COPY package.json yarn.lock ./
RUN yarn install

FROM base as build

WORKDIR /usr/src/app
COPY . .
COPY --from=dependencies /usr/src/app/node_modules ./node_modules
RUN yarn run build

EXPOSE 3000

CMD ["yarn", "start:prod"]
