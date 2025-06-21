# 「拾光堂」前端後台頁面

## 創作緣由
我們認為，攝影器材在經過升級、汰換後，仍然具有極高的使用價值。許多保存良好的器材，卻因為缺乏合適的流通平台被閒置或低價處理。
況且購買全新器材的價格高昂，也不確定使用起來是否真正喜歡或適合自己。在摸索的過程金錢成本過高，許多人難以負擔。
因此「拾光堂」旨在打造一個專門的二手攝影器材交易平台，讓器材能夠在攝影愛好者之間流轉，延續其價值。讓舊有的器材有最有效的利用，再次看見世界。

## 技術
此為「拾光堂」後台管理者介面，由 **React + Vite** 建設

### 主要
- JS 框架：**React** 19.1.0
- 路由管理：**React Router** v7 (HashRoater)
- 狀態管理：
  - **Redux** 9.2.0
  - **Redux Toolkit** 2.8.2
  - **Redux Persist** 6.0.0
- API 管理：**RTK Query**（主要）、**axios** 1.8.4 (輔助)
- Prop 驗證：**prop-types** 15.8.1
- 表單管理：**react-hook-form** 7.56.1
- 表單驗證：**zod** 3.24.3
- JWT 應用：**jwt-decode** 4.0.0
- CSS 樣式庫：**Boostrap** 5.3.5
- CSS 預處理器：**SASS (scss)** 1.87.0
- 富文本編輯器：**Quill** 2.0.3
- Github 部屬：**gh-pages** 6.3.0

### 輔助
- **react-toastify** 11.0.5

## 功能
主要實現以下使用者功能
- [x] 管理者登入／登出
- [x] 查看商品列表
- [x] 新增／編輯／刪除商品
- [x] 查看優惠券列表
- [x] 新增／編輯／刪除優惠券
- [x] 查看訂單列表、訂單資訊
- [x] 查看用戶
- [x] 將特定用戶停權

## 測試帳密
### 帳號：
```bash
admin@gmail.com
```
### 密碼：
```bash
Admin1234
```

## 安裝
### 取得專案
```bash
git clone https://github.com/LightPickers/Manage-Dev-React.git
```

### 移動到專案內
```bash
cd Manage-Dev-React
```

### 安裝套件
```bash
npm install
```

### 運行專案
```bash
npm run dev
```
### 開啟專案
在瀏覽器網址列輸入以下即可看到畫面

```bash
http://localhost:5173/#/
```
## 專案結構

### 主要架構
- public - 靜態圖片
- src - 主要專案檔案
- assets - scss 樣式模組
- components - 共用元件、頁面元件
- features - 特定功能的模組 (含 Redux Slices)
- hooks - 自定義 Hook
- layouts - 頁面佈局元件
- pages - 路由頁面元件
- routes - 路由元件
- schemas - Zod 表單驗證放置處
- utils - 通用工具函式
- LightPickersAdminApp.jsx - 入口元件 (App)
- main.jsx - React 應用程式進入點
- store.js - Redux Toolkit 的 store 建立與整合

### 其他檔案
- vite.config.js - Vite 設定檔
- eslint.config.js - ESLint 規則設定
- .prettierrc, .prettierignore - Prettier 格式化規則
- index.html - 應用程式渲染 root 位置
- package.json - 專案依賴套件與 script 設定
- README.md - 專案說明文件
