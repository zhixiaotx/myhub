# 🤖 OmniAI Studio / 智能多模型全栈 AI 助手与创作工作台

> 一个功能强大的全栈 AI 交互与多模态创作工作台（React 19 + Vite + Express + Tailwind CSS v4），支持 Google Gemini、OpenAI、DeepSeek 及自定义兼容 API，集成了文本对话、多模态附件解析、AI 图像生成、AI 视频生成及高级提示词工程管理。

---

## 🌟 核心功能特性

- **多模型服务商接入 (Multi-Provider Architecture)**: 支持 Google Gemini（原生与兼容格式）、OpenAI、DeepSeek 以及任意兼容 OpenAI 协议的自定义 API（支持灵活配置 Base URL、自定义 Model ID）。
- **多模态富媒体交互 (Rich Multimodal Support)**:
  - 📷 **图像生成 (Image Generation)**: 支持 DALL-E 3、Google Imagen 及各类开源文生图模型（Flux、Stable Diffusion 等）。
  - 🎬 **视频生成 (Video Generation)**: 支持视频生成模型（Sora、Kling、Luma、Runway、CogVideo 等）的端到端调用与状态追踪。
  - 🎙️ **语音与文件解析**: 支持音频输入、文件附件上传、代码片段与 Markdown 实时渲染。
- **全栈架构安全代理**: 采用 Express 后端服务进行 API 密钥代理，确保敏感 API Key 绝不暴露于前端浏览器。
- **精美现代 UI/UX**: 基于 Tailwind CSS v4 构建，支持响应式暗黑/明亮双模视觉，动效流畅（Motion）。

---

## 🛠️ 技术栈 (Tech Stack)

- **前端**: React 19, Vite 6, Tailwind CSS v4, Lucide React (图标库), Motion (动画引擎)
- **后端**: Express.js, TypeScript, tsx (开发环境), esbuild (生产打包)
- **开发与构建**: ESLint, TypeScript Type Checking (`tsc`)

---

## 📦 本地开发指南 (Local Development)

### 1. 环境准备
确保您的机器已安装 **Node.js (>= 18.x)**。

### 2. 克隆项目与安装依赖
```bash
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name

# 安装依赖
npm install
```

### 3. 配置环境变量
复制 `.env.example` 并重命名为 `.env`，填入您的 API 密钥：
```env
GEMINI_API_KEY=your_gemini_api_key_here
```

### 4. 启动开发服务器
```bash
npm run dev
```
项目将在 `http://localhost:3000` 启动（配合后端代理与 Vite 中间件）。

---

## 🚀 生产构建与打包 (Production Build)

```bash
# 执行全栈打包（前端 Vite 打包 + 后端 esbuild 打包至 dist/server.cjs）
npm run build

# 启动生产服务
npm start
```

---

## ☁️ GitHub Actions 持续集成与部署工作流 (CI/CD Workflow)

本项目为您配置了完整的 GitHub Actions 工作流（`.github/workflows/deploy.yml`），在您每次推送到 `main` 分支时自动执行 **代码检查（Lint）**、**TypeScript 类型检查** 以及 **全栈生产构建验证**。

### 工作流配置文件 (`.github/workflows/deploy.yml`)
您可以在项目根目录下找到 `.github/workflows/deploy.yml` 文件。内容如下：

```yaml
name: CI/CD Production Build & Deploy

on:
  push:
    branches: [ "main", "master" ]
  pull_request:
    branches: [ "main", "master" ]
  workflow_dispatch:

jobs:
  build-and-test:
    runs-on: ubuntu-latest

    strategy:
      matrix:
        node-version: [18.x, 20.x]

    steps:
      - name: 📥 Checkout Repository
        uses: actions/checkout@v4

      - name: ⚙️ Set up Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}
          cache: 'npm'

      - name: 📦 Install Dependencies
        run: npm install

      - name: 🔍 Run Type Check & Linter
        run: npm run lint

      - name: 🏗️ Build Full-Stack Application
        run: npm run build

      - name: 📂 Upload Build Artifacts
        uses: actions/upload-artifact@v4
        with:
          name: dist-artifacts-${{ matrix.node-version }}
          path: |
            dist/
            package.json
            server.ts
```

---

## 💡 如何将此项目部署到 GitHub 及云端

1. **推送到 GitHub 仓库**:
   ```bash
   git init
   git add .
   git commit -m "feat: initial full-stack AI studio application"
   git branch -M main
   git remote add origin https://github.com/<your-github-username>/<your-repo-name>.git
   git push -u origin main
   ```
2. **查看 GitHub Actions**:
   进入您的 GitHub 仓库页面 -> 点击 **Actions** 标签，即可实时查看 CI 构建与测试进度。
3. **部署至云端容器平台 (如 Cloud Run / Vercel / Render / Zeabur)**:
   - 本项目已内置完整的 `package.json` 启动脚本（`npm start` 对应 `node dist/server.cjs`），可一键容器化部署到 Google Cloud Run、Railway、Render 等支持 Node.js 的云服务商。
   - 记得在云端服务商后台配置对应的环境变量（如 `GEMINI_API_KEY` 等）。

---

## 📄 License
MIT License. 欢迎提交 Pull Request 与共建！
