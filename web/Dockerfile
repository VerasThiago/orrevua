FROM node:18.12.1-alpine AS build
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile
COPY . ./
RUN yarn build


FROM node:18.12.1-alpine
COPY --from=build /app/build /app/
WORKDIR /app
ENV NODE_ENV production
RUN npm install -g serve
EXPOSE 3000
CMD [ "serve", "-s", "." ]
