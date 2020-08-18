FROM node:10-alpine as server

WORKDIR /opt/node_app

COPY package.json yarn.lock ./
RUN yarn

COPY . .

RUN yarn uglify

# 生成最终镜像
FROM node:10-alpine

WORKDIR /opt/node_app

# 复制构建结果到当前镜像
COPY --from=server /opt/node_app .

EXPOSE 7001

CMD MIGRATION_ENV=prod yarn migrations up && yarn start
