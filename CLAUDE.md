# CLAUDE.md

本文件为 Claude Code (claude.ai/code) 在此代码库中工作时提供指导。

## 开发命令


### 构建与开发
```bash
# 安装依赖
npm install

# 启动开发服务器（Vite 开发服务器，端口 5173）
npm run dev

# 生产环境构建
npm run build

# 预览生产构建
npm run preview
```

使用 vue skill, 优化整个代码架构和代码。

### 测试
```bash
# 运行所有测试
npm run test

# 使用 Vitest UI 运行测试
npm run test:ui

# 运行测试并生成覆盖率报告
npm run test:coverage

# 运行单个测试文件
npx vitest src/composables/useErrorHandler.spec.ts
```

## 架构概览

这是一个采用春天主题设计的 Vue 3 + TypeScript 运维监控仪表板。应用程序监控信息系统，提供分布式追踪，并包含由 Google Gemini API 驱动的 AI 助手 (ClawdBot)。

### 状态管理模式

代码库遵循使用 Pinia stores 和 composables 的**关注点分离**模式：

1. **Pinia Stores** (`src/stores/*.ts`)：管理全局状态和业务逻辑
   - 每个 store 单一职责（服务器、告警、追踪、部署、日志、设置、技能库、clawdBot）
   - Stores 使用 **Setup Store 模式**（函数语法的 defineStore）
   - 状态是响应式的，并在需要时持久化（设置使用 localStorage）

2. **Composables** (`src/composables/*.ts`)：提取可重用逻辑和 UI 状态
   - UI 状态管理（对话框状态、标签页、筛选器）
   - 辅助函数（格式化、图标、分类）
   - 跨组件逻辑共享
   - 每个 composable 聚焦且可测试

3. **Components** (`src/components/*.vue`, `src/views/*.vue`)：专注于展示
   - 使用 stores 管理状态
   - 使用 composables 处理逻辑
   - 保持组件精简和聚焦

### 关键架构决策

**为什么使用 Stores + Composables？**
- Stores 持有数据和业务逻辑（单一数据源）
- Composables 持有 UI 状态和辅助函数（可跨组件重用）
- 组件变得更简单且更易维护
- 更易于测试（stores 可独立测试，composables 可隔离测试）

**模式示例：**
```typescript
// Store: 管理数据和业务操作
const serversStore = useServersStore()
const { servers, stats } = store

// Composable: 提供辅助函数
const { getStatusIcon, getStatusClass } = useServerHelpers()

// Component: 专注于渲染
```

### 项目结构

```
src/
├── stores/              # Pinia stores（状态管理）
│   ├── dashboard.ts     # 仪表板指标和状态
│   ├── servers.ts       # 服务器监控状态
│   ├── alerts.ts        # 告警管理状态
│   ├── tracing.ts       # 分布式追踪状态
│   ├── deployments.ts   # 部署管理状态
│   ├── logs.ts          # 日志管理状态
│   ├── settings.ts      # 用户偏好状态
│   ├── skillLibrary.ts  # 技能库状态
│   └── clawdBot.ts      # AI 聊天助手状态
├── composables/         # 可重用逻辑
│   ├── useDeployment.ts
│   ├── useRefresh.ts
│   ├── useCommandHistory.ts
│   ├── useTerminalState.ts
│   ├── useTerminalCommand.ts
│   ├── useSkillDialog.ts
│   ├── useSkillTabs.ts
│   ├── useSkillCategories.ts
│   ├── useSettingsDialog.ts
│   ├── useSettingsOptions.ts
│   ├── useChatState.ts
│   ├── useChatFormat.ts
│   ├── useLogFilter.ts
│   ├── useLogFormat.ts
│   ├── useLogExport.ts
│   ├── useServerFilter.ts
│   ├── useServerHelpers.ts
│   ├── useAlertFilter.ts
│   ├── useAlertHelpers.ts
│   ├── useTracingHelpers.ts
│   ├── useDeploymentHelpers.ts
│   ├── useLogHelpers.ts
│   ├── useErrorHandler.ts
│   └── index.ts
├── components/          # 可重用 Vue 组件
│   ├── AppSidebar.vue
│   ├── PageHeader.vue
│   ├── MetricCard.vue
│   ├── ServerTable.vue
│   ├── ActivityPanel.vue
│   ├── ChatAssistant.vue
│   ├── ClawdBot.vue     # AI 聊天助手（浮动组件）
│   ├── SettingsPanel.vue
│   └── TerminalInput.vue
├── views/               # 页面级组件
│   ├── Dashboard.vue
│   ├── Servers.vue
│   ├── Alerts.vue
│   ├── TracingAnalysis.vue
│   ├── Deployments.vue
│   └── Logs.vue
├── router/              # Vue Router 配置
├── services/            # 业务逻辑和外部 API
│   ├── aiEngine.ts      # AI 命令解析引擎
│   └── geminiService.ts # Google Gemini API 集成
├── mock/                # 开发用模拟数据
├── types/               # TypeScript 类型定义
├── styles/              # 全局样式和设计系统
└── constants/           # 应用常量
    ├── errorCodes.ts
    ├── time.ts
    ├── validation.ts
    └── api.ts
```

### 性能优化

代码库使用了多种 Vue 3 性能优化：

1. **v-memo 指令**：应用于列表渲染以避免不必要的重新渲染
   - 跟踪特定属性（id、status 等）以判断是否需要重新渲染
   - 使用于：Alerts、Servers、Deployments、TracingAnalysis、Logs、ClawdBot、ActivityPanel

2. **计算属性**：大量使用 computed 来派生状态
   - 避免每次渲染时重新计算
   - Stores 为常见查询提供 computed getters

3. **懒加载**：路由可以使用 defineAsyncComponent 懒加载（已准备但未强制执行）

### 错误处理

代码库通过 `useErrorHandler()` composable 拥有统一的错误处理系统：
- 创建和跟踪带有严重性级别的错误
- 错误历史管理（最多 100 个错误）
- 专用处理器：`handleValidationError`、`handleNetworkError`、`handleApiError`、`handleAuthError`
- 异步包装器：`withErrorHandling(asyncFn, context, fallback)`
- 错误对话框管理

### 常量管理

`src/constants/` 中的集中式常量：
- `errorCodes.ts`：标准化错误代码和消息
- `time.ts`：时间间隔、格式、超时
- `validation.ts`：验证规则和消息
- `api.ts`：HTTP 状态码、方法、请求头

从 `@/constants` 导入以使用它们。

### 类型系统

全面的强类型：
- 所有 stores 都有导出的接口
- Composables 完全类型化
- 常量已类型化
- 类型集中在 `src/types/index.ts`

### AI 集成

**ClawdBot** - AI 聊天助手：
- 由 Google Gemini API 驱动
- API key 通过 `.env.local` 配置：`VITE_GEMINI_API_KEY=your_key`
- 如果没有 API key 则回退到演示模式
- 位于 `src/components/ClawdBot.vue`
- 状态由 `src/stores/clawdBot.ts` 管理
- 聊天状态在 `src/composables/useChatState.ts`

**AI Engine** (`src/services/aiEngine.ts`)：
- 基于规则的命令解析，用于传统聊天助手
- 支持命令：状态检查、服务器重启、部署、日志查看等

### 设计系统

**春天/夏天主题：**
- 温暖的奶油色背景 (#F5F4F1)
- 森林绿主色 (#3D8A5A)
- 赭土色强调色 (#D89575)
- 圆角（8px - 20px）
- 柔和阴影

CSS 变量定义在 `src/styles/design-system.css` 并通过 CSS 自定义属性应用。

### 测试

- **框架**：Vitest with jsdom 环境
- **测试工具**：@vue/test-utils 用于组件测试
- **设置**：`src/test/setup.ts` 包括 localStorage、IntersectionObserver、ResizeObserver 的 mock
- **覆盖率**：由 @vitest/coverage-v8 支持
- **位置**：测试文件与源文件并列（例如 `useErrorHandler.spec.ts`）

### 组件模式

添加新功能时：

1. **创建 store**，如果你需要全局状态或业务逻辑
2. **创建 composables**，用于可重用逻辑或 UI 状态
3. **保持组件精简** - 它们应该主要渲染模板和处理用户事件
4. **使用 v-memo**，在父组件变化时不需要重新渲染的列表项上
5. **使用常量**，而不是魔法数字/字符串
6. **使用错误处理器**，进行统一的错误管理

### 导入模式

- Stores: `import { useXxxStore } from '@/stores/xxx'`
- Composables: `import { useXxx } from '@/composables'` (index 重新导出所有)
- Types: `import type { Xxx } from '@/types'`
- Constants: `import { XXX } from '@/constants'`
- Icons: `import { IconName } from 'lucide-vue-next'`
