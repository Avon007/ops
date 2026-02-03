<script setup lang="ts">
/**
 * InlineNavigation Component
 * 内联导航组件
 *
 * 职责：
 * - 在无边栏模式下显示导航
 * - 水平布局的导航菜单
 * - 提供设置按钮
 * - 支持响应式设计
 */

import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import {
  LayoutDashboard,
  GitBranch,
  Server,
  AlertTriangle,
  FileText,
  Package,
  Brain,
  Terminal,
  Settings
} from 'lucide-vue-next'

// Props
interface Props {
  onOpenSettings?: () => void
}

defineProps<Props>()

// Router
const router = useRouter()
const route = useRoute()

// State
const currentPath = computed(() => route.path)

// Navigation items
const navItems = ref([
  { id: '01', label: '仪表板', path: '/', icon: LayoutDashboard },
  { id: '02', label: '链路追踪', path: '/tracing-analysis', icon: GitBranch },
  { id: '03', label: '服务器', path: '/servers', icon: Server },
  { id: '04', label: '告警', path: '/alerts', icon: AlertTriangle },
  { id: '05', label: '日志', path: '/logs', icon: FileText },
  { id: '06', label: '部署', path: '/deployments', icon: Package },
  { id: '07', label: '终端', path: '/terminal', icon: Terminal },
  { id: '08', label: '技能库', path: '/skills', icon: Brain }
])

// Methods
const navigateTo = async (path: string) => {
  try {
    console.log('Navigating to:', path)
    await router.push(path)
    console.log('Navigation successful to:', path)
  } catch (error) {
    console.error('Navigation error:', error)
  }
}
</script>

<template>
  <nav class="inline-nav">
    <div class="nav-container">
      <!-- Navigation Items -->
      <div
        v-for="item in navItems"
        :key="item.id"
        class="nav-item"
        :class="{ active: currentPath === item.path }"
        @click="navigateTo(item.path)"
      >
        <component :is="item.icon" :size="18" />
        <span class="nav-label">{{ item.label }}</span>
      </div>

      <!-- Spacer -->
      <div class="nav-spacer"></div>

      <!-- Settings Button -->
      <button class="nav-item settings-button" @click="onOpenSettings" title="设置">
        <Settings :size="18" />
        <span class="nav-label">设置</span>
      </button>
    </div>
  </nav>
</template>

<style scoped>
.inline-nav {
  width: 100%;
  background-color: var(--bg-white);
  border-bottom: 1px solid var(--border-light);
  padding: var(--spacing-md) var(--spacing-2xl);
  margin-bottom: var(--spacing-lg);
}

.nav-container {
  display: flex;
  gap: var(--spacing-sm);
  align-items: center;
  overflow-x: auto;
  scrollbar-width: none;
}

.nav-container::-webkit-scrollbar {
  display: none;
}

.nav-spacer {
  flex: 1;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--border-radius);
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s ease;
  background-color: transparent;
  color: var(--text-gray);
  font-size: var(--font-size-caption-2);
  font-weight: 500;
  font-family: var(--font-family);
  letter-spacing: 0.5px;
}

.nav-item:hover {
  background-color: var(--bg-elevated);
  color: var(--text-main);
}

.nav-item.active {
  background-color: var(--accent-light);
  color: var(--primary-green);
  font-weight: 600;
}

.nav-item svg {
  flex-shrink: 0;
}

.nav-item.settings-button {
  background-color: var(--bg-elevated);
  color: var(--text-gray);
  border: 1px solid var(--border-color);
}

.nav-item.settings-button:hover {
  background-color: var(--accent-light);
  color: var(--primary-green);
  border-color: var(--primary-green);
}

.nav-label {
  line-height: 1;
}

/* 响应式 */
@media (max-width: 768px) {
  .inline-nav {
    padding: var(--spacing-sm) var(--spacing-md);
  }

  .nav-item {
    padding: var(--spacing-xs) var(--spacing-sm);
  }

  .nav-label {
    font-size: var(--font-size-caption-2);
  }
}
</style>
