# 「拾光堂」 - 二手攝影器材交易平台（管理者介面）

[![LightPickers Logo](https://raw.githubusercontent.com/LightPickers/Frontend-Dev-React/refs/heads/feature/header/public/homepage/banner/banner-2-lg.png)](https://lightpickers.github.io/Frontend-Dev-React/#/)

> 讓舊有的器材重獲新生，在攝影愛好者之間流轉，延續其價值 ✨

## 專案概述

拾光堂是一個專為攝影愛好者打造的**二手攝影器材交易平台**。我們相信每一件攝影器材都有其獨特價值，即使經過升級汰換，仍能為其他攝影愛好者帶來創作靈感。

### 創作理念

- **延續價值**：讓保存良好的器材避免被閒置或低價處理
- **降低門檻**：以合理價格讓更多人體驗不同器材的魅力
- **永續循環**：促進攝影器材的有效流通與再利用

## 快速開始

### 安裝步驟

```bash
# 1. 複製專案
git clone https://github.com/LightPickers/Manage-Dev-React.git

# 2. 進入專案目錄
cd Manage-Dev-React

# 3. 安裝套件
npm install

# 4. 環境變數設置
cp .env.example .env
# 複製 .env.example 並依據內容設置環境變數檔案

# 5. 啟動開發服務器
npm run dev

# 6. 開啟瀏覽器
# 訪問 http://localhost:5173/#/
```

### 環境變數說明

```bash
# 後台 APP 部屬路徑（與前台區隔）
VITE_ADMIN_APP_BASE=/
# 前台 API 路徑（含版本號）
VITE_API_BASE=https://api-domain.com/api/v1
# 後台 API 路徑（含版本號及 admin）
VITE_ADMIN_API_BASE=https://admin-api-domain.com/api/v1/admin
```

### 測試帳號

為方便測試，以下提供測試資訊：

| 項目 |        測試用內容 |
| :--: | ----------------: |
| 帳號 | `admin@gmail.com` |
| 密碼 |       `Admin1234` |

## 主要功能

- [x] **管理員系統**：登入／登出
- [x] **商品管理**：商品的查看／新增／編輯／刪除
- [x] **優惠券管理**：優惠券的查看／新增／編輯／刪除
- [x] **訂單處理**：訂單的查看
- [x] **用戶管理**：查看用戶、處理用戶權限

## 技術架構

### 核心技術

|     技術類別     |       使用技術        |      版本       |
| :--------------: | :-------------------: | :-------------: |
|   **前端框架**   |         React         |     19.1.0      |
|   **建構工具**   |         Vite          |      6.3.2      |
|   **路由管理**   |     React Router      | v7 (HashRouter) |
|   **狀態管理**   |     Redux Toolkit     |      2.8.2      |
|  **狀態持久化**  |     Redux Persist     |      6.0.0      |
|   **API 管理**   |   RTK Query + Axios   |        -        |
|   **表單處理**   | React Hook Form + Zod | 7.56.1 + 3.24.3 |
|   **UI 框架**    |       Bootstrap       |      5.3.5      |
|  **樣式預處理**  |      SASS (SCSS)      |     1.87.0      |
| **富文本編輯器** |         Quill         |      2.0.3      |

### 輔助工具

- **通知系統**：SweetAlert2、React Toastify
- **安全處理**：JWT Decode
- **部署工具**：gh-pages

## 專案結構

```
src/
├── 📁 assets/          # SCSS 樣式模組
├── 📁 components/      # 可重用組件
├── 📁 features/        # Redux 功能模組
├── 📁 hooks/           # 自定義 Hooks
├── 📁 layouts/         # 頁面佈局
├── 📁 pages/           # 路由頁面
├── 📁 routes/          # 路由配置
├── 📁 schemas/         # 表單驗證規則
├── 📁 utils/           # 工具函式
├── 📄 LightPickersAdminApp.jsx  # 主應用組件
├── 📄 main.jsx         # 應用入口點
└── 📄 store.js         # Redux Store
```

## 相關專案

|     專案     |         描述         |                                                            連結                                                            |
| :----------: | :------------------: | :------------------------------------------------------------------------------------------------------------------------: |
| **前台頁面** |      用戶端介面      | [Demo](https://lightpickers.github.io/Frontend-Dev-React/#/) \| [Repo](https://github.com/LightPickers/Frontend-Dev-React) |
| **後台管理** | 管理員介面（本專案） |   [Demo](https://lightpickers.github.io/Manage-Dev-React/#/) \| [Repo](https://github.com/LightPickers/Manage-Dev-React)   |
| **前台 API** |    用戶端後端服務    |                                [Repo](https://github.com/LightPickers/Frontend-Dev-Nodejs)                                 |
| **後台 API** |    管理端後端服務    |                                 [Repo](https://github.com/LightPickers/Manage-Dev-Nodejs)                                  |

## 開發指令

```bash
npm run dev          # 啟動開發服務器
npm run build        # 建構生產版本
npm run preview      # 預覽生產版本
npm run deploy       # 部署到 GitHub Pages
npm run lint         # 執行 ESLint 檢查
```

## 專案團隊

|    成員    | 職位 |                    GitHub                    |                      Email |
| :--------: | :--: | :------------------------------------------: | -------------------------: |
| **zxlee**  | 全端 |  [@zxlee0114](https://github.com/zxlee0114)  | napoleon.lee0114@gmail.com |
| **Hsiang** | 全端 | [@Hsiang1006](https://github.com/Hsiang1006) |       fdsa201305@gmail.com |
|   **TX**   | 全端 |     [@TXWuuu](https://github.com/TXWuuu)     |           wutx24@gmail.com |
|  **Rosa**  | 全端 |  [@Rosaaachi](https://github.com/Rosaaachi)  |          ss91810@gmail.com |
|  **Tau**   | 後端 |     [@TauHsu](https://github.com/TauHsu)     |      jason850629@gmail.com |
| **Angela** | 後端 | [@Angela-Chu](https://github.com/Angela-Chu) | AngelaChu1598753@gmail.com |

---

<div align="center">

**用心拾光，傳遞每一刻的美好** 📸✨

Made with ❤️ by LightPickers Team

</div>
