# `@wipi/server`

後台服務。配置文件在 `../../.env`。

## swagger 文件

啟動項目後，訪問 `http://localhost:3003/api` 即可預覽 swagger 文件。

## 模組

### 用戶

- `POST /user/register`：用戶註冊（`name`、`password`）
- `POST /auth/login`：用戶登錄（`name`、`password`）
- `POST /user/update`：更新用戶訊息
- `POST /user/password`：更新用戶密碼（`oldPassword`、`newPassword`）

### 文章

- `POST /article`：創建文章
- `GET /article`：獲取所有文章
- `GET /article/category/:categoryId`：獲取指定分類下所有文章
- `GET /article/tag/:tagId`：獲取指定標籤下所有文章
- `GET /article/archives`：獲取所有文章歸檔
- `GET /article/:articleId`：獲取指定文章
- `GET /article/all/recommend`：獲取所有推薦文章
- `GET /article/recommend/:articleId`：獲取指定文章的推薦文章
- `POST /article/:articleId/checkPassword`：校驗指定文章的密碼
- `POST /article/:articleId/views`：指定文章訪問量 +1
- `POST /article/:articleId/`：更新指定文章
- `DELETE /article/:articleId/`：刪除指定文章

### 文章分類

- `POST /category`：創建文章分類
- `GET /category`：獲取所有文章分類
- `GET /category/:id`：獲取指定文章分類
- `POST /category/:id`：更新指定文章分類
- `DELETE /category/:id`：刪除指定文章分類

### 文章標籤

- `POST /tag`：創建文章標籤
- `GET /tag`：獲取所有文章標籤
- `GET /tag/:id`：獲取指定文章標籤
- `POST /tag/:id`：更新指定文章標籤
- `DELETE /tag/:id`：刪除指定文章標籤

### 文章評論

- `POST /commengt`：創建評論
- `GET /commengt`：獲取所有評論
- `GET /commengt/host/:hostId`：獲取指定文章（或頁面）評論
- `POST /commengt/:id`：更新指定評論
- `DELETE /commengt/:id`：刪除指定評論

### 頁面

- `POST /page`：創建頁面
- `GET /page`：獲取所有頁面
- `GET /page/:id`：獲取指定頁面
- `POST /page/:id`：更新指定頁面
- `POST /page/:id/views`：指定頁面訪問量 +1
- `DELETE /page/:id`：刪除指定頁面

### 文件

- `POST /file/`：上傳文件
- `GET /file/:id`：獲取指定文件記錄
- `DELETE /file/:id`：刪除指定文件記錄

### 搜索

- `POST /search/article`：搜尋文章
- `GET /search`：獲取所有搜索記錄
- `DELETE /search/:id`：刪除指定搜索記錄

### 設置

- `POST /setting`：更新設置
- `POST /setting/get`：獲取設置

### 郵件

- `POST /smtp`：發送郵件
- `GET /smtp`：獲取郵件記錄
- `DELETE /smtp/:id`：刪除指定郵件記錄
