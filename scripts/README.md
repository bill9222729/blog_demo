# scripts

該目錄下包含兩個腳本。

## `deploy.sh`

在服務端首次部署時使用，依賴 `nodejs`、`pnpm` 和 `pm2`。

```shell
#! /bin/bash

cd /apps/wipi
git checkout main
git pull

pnpm install
pnpm run build
pnpm run pm2

pm2 startup
pm2 save
```

## `update.sh`

項目更新時使用，配合 `webhook` 實現自動化部署。

```shell
#! /bin/bash

cd /apps/wipi
git checkout refactor/pnpm
git pull

pnpm install
pnpm run build

pm2 reload @wipi/server
pm2 reload @wipi/client
pm2 reload @wipi/admin
```

## 自動化部署

當在伺服器完成首次部署後，後續如果每次疊代都手動進行更新會很麻煩，這時候就可以利用 `github webhook` 實現自動化部署。

### 第一步：在你的伺服器配置 webhook

在你的伺服器上安裝 [webhook](https://github.com/adnanh/webhook/blob/master/docs/Hook-Examples.md#incoming-github-webhook)，然後編寫 `hooks`，然後後台運行 `webhook`。

```shell
# 第一步：編寫 hooks.json
touch hooks.json

# 第二步：創建 webhook.log
touch webhook.log

# 第三步：後台運行 webhook
nohup webhook -hooks hooks.json -hotreload -logfile webhook.log &
```

hooks 配置範例：

```json
[
  {
    "id": "wipi-auto-update",
    "execute-command": "/apps/wipi/scripts/update.sh", // 注意根據項目修改腳本路徑
    "command-working-directory": "/apps/wipi/",
    "http-methods": ["POST"],
    "pass-arguments-to-command": [
      {
        "source": "payload",
        "name": "head_commit.id"
      },
      {
        "source": "payload",
        "name": "pusher.name"
      },
      {
        "source": "payload",
        "name": "pusher.email"
      }
    ],
    "trigger-rule": {
      "and": [
        {
          "match": {
            "type": "payload-hmac-sha256",
            "secret": "please-rebuild-think",
            "parameter": {
              "source": "header",
              "name": "X-Hub-Signature-256"
            }
          }
        },
        {
          "match": {
            "type": "value",
            "value": "refs/heads/main",
            "parameter": {
              "source": "payload",
              "name": "ref"
            }
          }
        }
      ]
    }
  }
]
```

### 第二步：測試 webhook

本質上，webhook 就是在伺服器啟動一個服務，然後通過 HTTP 調用相應的 URL 觸發執行指定的腳本。

> 例如 wipi 項目的 webhook：http://124.221.147.83:9000/hooks/wipi-auto-update

以 Github 為例，在設置中找到 webhooks 配置指定 URL，注意 `Content type` 為 `application/json`。
