export const DEFAULT_MARKDOWN = `
# 歡迎使用 Markdown 編輯器

> * 整理知識，學習筆記
> * 發布日記，雜文，所見所想
> * 撰寫發布技術文稿（代碼支持）

## 什麼是 Markdown

Markdown 是一種方便記憶、書寫的純文本標記語言，用戶可以使用這些標記符號以最小的輸入代價生成極富表現力的文件：譬如您正在閱讀的這份文件。它使用簡單的符號標記不同的標題，分割不同的段落，**粗體** 或者 *斜體* 某些文字。

### 1. 待辦事宜 Todo 列表

- [ ] 支持以 PDF 格式導出文稿
- [x] 新增 Todo 列表功能

### 2. 高亮一段代碼[^code]

\`\`\`python
@requires_authorization
class SomeClass:
    pass

if __name__ == '__main__':
    # A comment
    print 'hello world'
\`\`\`

### 3. 繪製表格

| 項目        | 價格   |  數量  |
| --------   | -----:  | :----:  |
| 計算機     | 1600 |   5     |
| 手機        |   12   |   12   |
| 管線        |    10    |  234  |
`;
