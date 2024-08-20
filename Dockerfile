FROM node:16-slim as build-stage

#FROM kongbg/node

# 设置工作目录
WORKDIR /app

# 拷贝代码
COPY . /app

RUN npm install

# 打包vue
RUN cd ./web \
    #&& npm install \
    && npm run build \
    && rm -rf ./node_modules

# 暴露端口
EXPOSE 3006

# 暴露config目录
VOLUME /app/config

# 设置apiKey变量
ENV APIKEY =

# 启动node
CMD sh startup.sh $APIKEY


