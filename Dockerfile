# 使用 Node.js 官方镜像作为构建阶段的基础镜像
FROM node:22.13.0-slim as build-stage

# 更新系统依赖
RUN apt-get update && apt-get install -y \
    curl \
    wget \
    unzip \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# 声明构建参数，这些值将在构建时通过 --build-arg 传入
ARG VITE_API_BASE_URL

# 复制项目文件（建议先复制 package.json 以提高构建缓存利用率）
COPY package*.json ./
RUN npm install

# 将源代码复制到容器中
COPY . .

# 创建目标目录，下载并解压 PDF.js 到 public/pdfjs
RUN mkdir -p public/pdfjs && \
    wget -O pdfjs.zip https://github.com/mozilla/pdf.js/releases/download/v5.4.149/pdfjs-5.4.149-dist.zip && \
    unzip pdfjs.zip -d public/pdfjs/ && \
    rm pdfjs.zip

# 执行构建命令，Vite 会读取已被修改的 .env.production 文件
RUN npm run build

# 第二阶段, 生产阶段，使用 Nginx 服务静态文件
FROM nginx:alpine as production-stage

# 创建应用用户和组（在安装系统依赖之前）
ARG USER_ID=1000
ARG GROUP_ID=1000
RUN groupadd -g $GROUP_ID syncduo-portal && \
    useradd -u $USER_ID -g $GROUP_ID -m syncduo-portal

# 设置时区
ENV TZ=Asia/Shanghai
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

# 删除默认的 nginx 配置
RUN rm /etc/nginx/conf.d/default.conf
# 复制自定义的 nginx 配置
COPY nginx.conf /etc/nginx/conf.d/

COPY --from=build-stage --chown=syncduo-portal:syncduo-portal /app/dist /usr/share/nginx/html

# 切换到非 root 用户
USER syncduo-portal

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]