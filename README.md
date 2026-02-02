# 🌷 运维助手 Dashboard

一个采用**春暖花开风格**设计的现代化运维监控仪表板，基于 **Vue 3 + TypeScript** 构建，集成 **AI 自然语言助手**，让运维工作更加轻松愉悦。

## ✨ 特性

### 🎨 春日主题设计
- **温暖配色**：奶油色背景 + 森林绿主调 + 陶土色点缀
- **圆润风格**：12-20px 圆角，柔和友好的视觉体验
- **轻盈阴影**：微妙的层次感，不喧宾夺主
- **自然灵感**：色彩取自大自然，营造舒适氛围

### 🤖 AI 助手
- **ClawdBot 对话助手**：基于 Google Gemini API 的智能对话
- **自然语言交互**：用日常对话方式执行运维命令
- **规则引擎**：智能解析用户意图，提供精准响应
- **快捷操作**：预设常用命令，一键触发
- **智能建议**：主动发现问题并提供建议

### 📊 监控功能
- **实时指标**：CPU、内存、磁盘、网络等关键指标
- **服务器状态**：多服务器监控，状态一目了然
- **活动日志**：系统事件实时追踪
- **告警通知**：问题及时发现和处理

## 🛠️ 技术栈

- **前端框架**：Vue 3.4+ (Composition API)
- **语言**：TypeScript 5.4+
- **构建工具**：Vite 5.1+
- **路由**：Vue Router 4.3+
- **状态管理**：Pinia 2.1+
- **图标**：Lucide Vue
- **样式**：原生 CSS + CSS 变量

## 📦 项目结构

```
ops-assistant-v2/
├── src/
│   ├── components/         # Vue 组件
│   │   ├── AppSidebar.vue
│   │   ├── PageHeader.vue
│   │   ├── MetricCard.vue
│   │   ├── ServerTable.vue
│   │   ├── ActivityPanel.vue
│   │   ├── ChatAssistant.vue
│   │   ├── ClawdBot.vue    # AI 对话助手
│   │   └── SettingsPanel.vue
│   ├── views/              # 页面视图
│   │   └── Dashboard.vue
│   ├── router/             # 路由配置
│   │   └── index.ts
│   ├── services/           # 业务逻辑
│   │   ├── aiEngine.ts     # AI 规则引擎
│   │   └── geminiService.ts # Gemini API 服务
│   ├── mock/               # Mock 数据
│   │   ├── data.ts
│   │   └── api.ts
│   ├── types/              # TypeScript 类型
│   │   └── index.ts
│   ├── styles/             # 样式文件
│   │   ├── design-system.css
│   │   └── main.css
│   ├── App.vue
│   └── main.ts
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## 🚀 快速开始

### 安装依赖

```bash
npm install
```

### 配置 Gemini API（可选）

如果需要使用 ClawdBot AI 对话功能：

1. 获取 Google Gemini API Key：https://makersuite.google.com/app/apikey
2. 创建 `.env.local` 文件并添加：

```bash
VITE_GEMINI_API_KEY=your_actual_api_key_here
```

3. 重启开发服务器

> **注意**：如果不配置 API Key，ClawdBot 将运行在演示模式，提供基础响应。

### 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:5173

### 构建生产版本

```bash
npm run build
```

### 预览生产构建

```bash
npm run preview
```

## 💡 使用指南

### ClawdBot AI 对话助手

点击右下角的 🤖 悬浮按钮即可打开 ClawdBot AI 助手。

**功能特点：**
- 🔍 **智能问答**：基于 Google Gemini API 的自然语言理解
- 📝 **代码生成**：自动生成运维脚本和配置
- 🎯 **问题诊断**：日志分析、性能优化建议
- 💡 **最佳实践**：提供专业的运维建议

**示例问题：**
```
如何分析 Nginx 日志中的 5xx 错误？
帮我写一个 Redis 性能监控脚本
数据库连接数过高怎么排查？
如何优化 Linux 系统性能？
```

**快捷命令：**
- 分析系统日志错误
- 优化数据库性能
- 编写监控脚本
- 排查网络问题

### 传统 AI 助手命令

AI 助手也支持规则引擎模式，您可以这样使用：

**查看服务器状态**
```
查看所有服务器状态
服务器怎么样
检查健康状态
```

**重启服务器**
```
重启 app-server-02
重启服务器
```

**部署新版本**
```
部署最新版本
发布新版本
```

**查看日志**
```
查看系统日志
显示日志
```

### 快捷命令

点击 AI 助手中的快捷命令卡片可以快速执行常用操作：
- 🖥️ 查看所有服务器状态
- 🔄 重启 app-server-02
- 📦 部署最新版本

## 🎨 设计系统

### 颜色规范

```css
/* 背景色 */
--bg-primary: #F5F4F1    /* 温暖奶油色 */
--bg-surface: #FFFFFF    /* 纯白 */
--bg-elevated: #FAFAF8   /* 浅灰白 */

/* 文字色 */
--text-primary: #1A1918  /* 主文字 */
--text-secondary: #6D6C6A /* 次要文字 */
--text-tertiary: #9C9B99  /* 辅助文字 */

/* 主题色 */
--accent-primary: #3D8A5A /* 森林绿 */
--accent-light: #C8F0D8   /* 浅绿色 */
--accent-warm: #D89575    /* 陶土色 */
```

### 圆角规范

```css
--radius-sm: 8px   /* 小元素 */
--radius-md: 12px  /* 按钮、输入框 */
--radius-lg: 16px  /* 卡片 */
--radius-xl: 20px  /* 大卡片 */
```

## 🔧 自定义配置

### 修改主题色

编辑 `src/styles/design-system.css` 文件中的 CSS 变量：

```css
:root {
  --accent-primary: #YOUR_COLOR;
  /* ... 其他变量 */
}
```

### 添加新的 AI 命令规则

编辑 `src/services/aiEngine.ts` 文件，在 `parseCommand` 函数中添加新的模式匹配：

```typescript
{
  type: 'your-command',
  patterns: [/your-pattern-here/i]
}
```

## 📝 待办事项

- [x] 集成 ClawdBot AI 对话助手
- [ ] 完善 ClawdBot 功能（多轮对话、上下文记忆）
- [ ] 完善部署对话框功能
- [ ] 添加服务器详情页面
- [ ] 实现真实的后端 API 集成
- [ ] 添加数据可视化图表
- [ ] 支持暗色模式切换
- [ ] 添加更多 AI 命令规则
- [ ] 实现告警推送功能
- [ ] 添加用户认证

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可

MIT License

---

**Made with ❤️ using Vue 3 + TypeScript + Spring Colors**
