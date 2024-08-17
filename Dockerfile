FROM node:16-slim as build-stage

# 设置工作目录
WORKDIR /app

# 拷贝代码
COPY . /app

# 安装依赖
#RUN npm install \
#    && cd ./web \
#    && npm install \
#    && npm run build \
#    cd /app

# 打包vue
RUN cd ./web \
    && npm run build \
    && cd /app

# 暴露端口
EXPOSE 3006

# 暴露data.db
VOLUME /data.db

# 启动node
CMD ["node", "./server/app.js"]

