# MyBlog

## 簡介

MyBlog是一個面向個人的開源的集成文章發表、頁面創建、知識小冊等功能的 CMS 系統。涉及到的技術如下：

- `MySQL`：數據儲存
- `next.js`：前端頁面框架
- `nest.js`：服務端框架
- `AliyunOSS`：對象儲存

## 功能點

- 文章管理
- 頁面管理
- 知識小冊
- 評論管理
- 郵件管理
- 訪問統計
- 文件管理
- 系統設置

## 項目運行

### 資料庫

首先安裝 `MySQL`，推薦使用 docker 進行安裝。

```bash
docker image pull mysql:5.7
docker run -d --restart=always --name wipi -p 3306:3306 -e MYSQL_ROOT_PASSWORD=root mysql:5.7
```

然後在 `MySQL` 中創建資料庫。

```bash
docker container exec -it wipi bash;
mysql -u root -p;
CREATE DATABASE  `wipi` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 本地運行

安裝項目依賴

```bash
# 全局安裝 pnpm
npm i -g pnpm

pnpm install
```

- 啟動項目

```bash
pnpm run dev
```

前台頁面地址：`http://localhost:3001`。
後台管理地址：`http://localhost:3002`。
服務介面地址：`http://localhost:3003`。

首次啟動，默認創建管理員用戶：admin，密碼：admin（可在 `.env` 文件中進行修改）。
[PS] 如服務端配置啟動失敗，請先確認 MySQL 的配置是否正確，配置文件在 `.env`。

項目初次啟動時，需要在後台進行系統設置。隨著內容的豐富，頁面內容也會豐富起來。

### 配置文件

默認載入 `.env` 文件，生產環境會嘗試載入 `.env.prod` 文件。

```bash
# 用戶端運行埠
CLIENT_PORT=3001
# 用戶端站點地址（假設部署到 https://xx.com, 就將 CLIENT_SITE_URL 設置為 https://xx.com）
CLIENT_SITE_URL=http://localhost:3001
# 用戶端資源地址（假設部署到 https://xx.com，就將 CLIENT_ASSET_PREFIX 設置為 https://xx.com，如果將資源上傳到 cdn ，那就改為 cdn 地址）
CLIENT_ASSET_PREFIX=/

# 管理後台運行埠
ADMIN_PORT=3002
# 管理後台資源地址（假設部署到 https://xx.com，就將 CLIENT_ASSET_PREFIX 設置為 https://xx.com，如果將資源上傳到 cdn ，那就改為 cdn 地址）
ADMIN_ASSET_PREFIX=/

# 服務端運行埠
SERVER_PORT=3003
# 服務端完整訪問路徑
SERVER_API_URL=http://localhost:3003/api
# 服務端介面前綴（假設將希望通過 http://xx:com/api 來訪問，那就設置為 /api；如果 http://xx:com，那就設置為 / ）
SERVER_API_PREFIX=/api
# 默認管理員帳戶名
ADMIN_USER=admin
# 默認管理員帳密碼
ADMIN_PASSWD=admin
# 以下為資料庫配置，請先創建好表
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWD=root
DB_DATABASE=wipi

# Github 第三方登錄配置
# 關於 Github OAuth 可參考 https://www.ruanyifeng.com/blog/2019/04/github-oauth.html
GITHUB_CLIENT_ID=0 # Github OAuth 登錄 Id
GITHUB_CLIENT_SECRET=0 # Github OAuth 登錄 Secret
```

### 項目部署

生產環境部署的腳本如下：

```bash

node -v
npm -v

npm config set registry http://registry.npmjs.org

npm i -g pm2 @nestjs/cli pnpm

pnpm install
pnpm run build
pnpm run pm2

pm2 startup
pm2 save
```

### nginx 配置

採用反向代理進行 `nginx` 配置，**同時設置 `proxy_set_header X-Real-IP $remote_addr;` 以便服務端獲取到真實 ip 地址**。

```bash
upstream wipi_client {
  server 127.0.0.1:3000;
  keepalive 64;
}

# http -> https 重定向
server {
  listen  80;
  server_name 域名;
  rewrite ^(.*)$  https://$host$1 permanent;
}

server {
  listen 443 ssl;
  server_name 域名;
  ssl_certificate      證書存放路徑;
  ssl_certificate_key  證書存放路徑;

  location / {
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
    proxy_set_header Host $host;
    proxy_set_header X-Nginx-Proxy true;
    proxy_cache_bypass $http_upgrade;
    proxy_pass http://wipi_client; #反向代理
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
  }
}
```
