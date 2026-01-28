# ---------------------------------------------------
# Stage 1: Build Environment
# ---------------------------------------------------
FROM node:20-alpine AS builder

WORKDIR /app

# Alpine LinuxでNode.jsの依存関係に必要なライブラリを追加
# (swcなどのネイティブバイナリ動作のため推奨)
RUN apk add --no-cache libc6-compat

# pnpmを有効化
RUN corepack enable

# 依存関係のインストール（キャッシュ活用のためにファイルを先にコピー）
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# ソースコードをコピーしてビルドを実行
COPY . .
RUN pnpm run build

# ---------------------------------------------------
# Stage 2: Production Environment (Nginx)
# ---------------------------------------------------
FROM nginx:alpine AS runner

COPY nginx.conf /etc/nginx/conf.d/default.conf

# Stage 1でビルドされた 'out' ディレクトリをNginxの公開ディレクトリにコピー
COPY --from=builder /app/out /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
