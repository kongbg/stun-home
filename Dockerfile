FROM node:16-slim as build-stage

# 设置工作目录
WORKDIR /app

# 拷贝代码
COPY . /app

# 打包vue
RUN cd ./web \
    && npm run build \
    && rm -rf ./node_modules 

# 暴露端口
EXPOSE 3006

# 设置apiKey变量
ENV APIKEY = 

# 暴露config目录
VOLUME /app/config

# 启动node
CMD ["node", "./server/app.js"]

