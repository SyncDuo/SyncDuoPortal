# 使用 Node.js 官方镜像作为构建阶段的基础镜像
FROM node:22.13.0-slim as build-stage

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

# 关键步骤：使用 sed 命令替换 .env.production 文件中的占位符
# 注意：-i 参数表示直接修改原文件。根据你使用的 shell，语法可能略有不同。
RUN if [ -n "$VITE_API_BASE_URL" ]; then \
        sed -i "s|@@VITE_API_BASE_URL@@|${VITE_API_BASE_URL}|g" .env.production; \
    fi

# 执行构建命令，Vite 会读取已被修改的 .env.production 文件
RUN npm run build

# 生产阶段，使用 Nginx 服务静态文件
FROM nginx:alpine as production-stage
COPY --from=build-stage /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]