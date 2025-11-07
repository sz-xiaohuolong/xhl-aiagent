# XHL AI Agent Frontend

Vue3 前端项目，提供 AI 应用界面。

## 功能特性

1. **主页**：用于切换不同的 AI 应用
2. **AI 恋爱大师**：聊天室风格的界面，通过 SSE 实时显示对话内容
3. **AI 超级智能体**：聊天室风格的界面，通过 SSE 实时显示对话内容

## 技术栈

- Vue 3
- Vue Router 4
- Axios
- Vite

## 安装依赖

```bash
npm install
```

## 开发运行

```bash
npm run dev
```

项目将在 `http://localhost:3000` 启动

## 构建生产版本

```bash
npm run build
```

## 项目结构

```
src/
├── api/           # API 请求配置
├── router/        # 路由配置
├── utils/         # 工具函数（SSE 连接等）
├── views/         # 页面组件
│   ├── Home.vue          # 主页
│   ├── LoveApp.vue       # AI 恋爱大师
│   └── ManusApp.vue      # AI 超级智能体
├── App.vue        # 根组件
├── main.js        # 入口文件
└── style.css      # 全局样式
```

## 后端接口

- 接口地址前缀：`http://localhost:8123/api`
- AI 恋爱大师 SSE 接口：`GET /api/ai/love_app/chat/sse?message={message}&chatId={chatId}`
- AI 超级智能体 SSE 接口：`GET /api/ai/manus/chat?message={message}`

## 注意事项

1. 确保后端服务运行在 `http://localhost:8123`
2. 确保后端已配置 CORS，允许前端跨域请求
3. AI 恋爱大师会自动生成聊天室 ID，用于区分不同会话

