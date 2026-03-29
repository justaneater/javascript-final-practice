# JavaScript 練習

## 專案架構
```text
/
├─ assets/                # 外部套件、共用靜態資源
├─ components/            # 外部html
├─ images/                # 網頁所需圖片
├─ scripts/               # 練習用JS
│  ├─ app.js
│  ├─ like-and-match.js
│  ├─ swipe-history.js
│  └─ swipe.js
├─ home.html              # 配對首頁
├─ like.html              # 喜歡列表
├─ login.html             # 登入頁面
├─ match.html             # 配對成功列表
├─ profile.html           # 個人頁面
├─ welcome.html           # 網頁入口
└─ mock-api-data.json     # 待配對用戶資料
```
## 練習範圍
#### `swipe.js`
> 可參考 `app.js` 使用範例 (`loadAndDisplayUsers()`)
- 用 `fetchUserData()` 取得使用者資料
- 用 `shuffleArray()` 隨機打亂資料順序
- 動態生成卡片HTML
- 將卡片渲染到`home.html`上

#### `login.html`
- 取得 DOM 元素
- 登入按鈕點擊事件驗證
- sessionStorage 狀態管理，暫存使用者ID和帳號
- Enter 鍵登入
- 密碼顯示/隱藏切換
