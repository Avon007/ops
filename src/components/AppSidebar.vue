<script setup lang="ts">
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
  Settings,
  Terminal
} from 'lucide-vue-next'

// Props
interface Props {
  onOpenSettings?: () => void
  onOpenTerminal?: () => void
}

defineProps<Props>()

const router = useRouter()
const route = useRoute()

const currentPath = computed(() => route.path)
const systemStatus = ref('在线')
const currentTime = ref('')

// Update time
const updateTime = () => {
  const now = new Date()
  currentTime.value = now.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  }) + ' UTC'
}

updateTime()
setInterval(updateTime, 1000)

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
  <aside class="sidebar">
    <!-- Logo Section -->
    <div class="logo-section">
      <div class="logo-mark">OPS</div>
      <div class="logo-text">运维小助理</div>
    </div>

    <!-- System Status -->
    <div class="system-status">
      <div class="status-label">系统状态</div>
      <div class="status-row">
        <div class="status-dot dot-positive"></div>
        <div class="status-text">{{ systemStatus }}</div>
      </div>
      <div class="status-time">{{ currentTime }}</div>
    </div>

    <!-- Navigation -->
    <div class="nav-section">
      <div
        v-for="item in navItems"
        :key="item.id"
        class="nav-item"
        :class="{ active: currentPath === item.path }"
        @click="navigateTo(item.path)"
      >
        <div class="nav-number">{{ item.id }}</div>
        <component :is="item.icon" class="nav-icon" :size="16" />
        <div class="nav-label-text">{{ item.label }}</div>
      </div>
    </div>

    <!-- Bottom Actions -->
    <div class="sidebar-actions">
      <button class="action-button" @click="onOpenSettings" title="设置">
        <Settings :size="18" />
        <span>设置</span>
      </button>
    </div>
  </aside>
</template>

<style scoped>
.sidebar {
  width: 200px;
  min-height: 100vh;
  background-color: var(--bg-white);
  border-right: 1px solid var(--border-light);
  padding: var(--spacing-2xl) var(--spacing-lg);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2xl);
}

.logo-section {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding-bottom: var(--spacing-2xl);
  border-bottom: 1px solid var(--border-light);
}

.logo-mark {
  width: 32px;
  height: 32px;
  background-color: var(--primary-green);
  border-radius: var(--border-radius);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--bg-white);
  font-weight: 700;
  font-size: var(--font-size-footnote);
}

.logo-text {
  font-size: var(--font-size-body);
  font-weight: 600;
  color: var(--text-main);
  letter-spacing: 2px;
  font-family: var(--font-family);
}

.system-status {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding-bottom: var(--spacing-2xl);
  border-bottom: 1px solid var(--border-light);
}

.status-label {
  font-size: 9px;
  font-weight: 600;
  color: var(--text-light);
  letter-spacing: 1px;
  text-transform: uppercase;
  font-family: var(--font-family);
}

.status-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.status-text {
  font-size: var(--font-size-caption-1);
  font-weight: 600;
  color: var(--status-success);
  letter-spacing: 1px;
  font-family: var(--font-family);
}

.status-time {
  font-size: 18px;
  font-weight: 500;
  color: var(--text-main);
  font-family: var(--font-family);
}

.nav-section {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.nav-label {
  font-size: 9px;
  font-weight: 600;
  color: var(--text-light);
  letter-spacing: 1px;
  text-transform: uppercase;
  margin-bottom: var(--spacing-md);
  font-family: var(--font-family);
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  cursor: pointer;
  border-radius: var(--border-radius);
  transition: all 0.2s ease;
}

.nav-item:hover {
  background-color: var(--bg-elevated);
}

.nav-item.active {
  background-color: var(--accent-light);
  border-left: 2px solid var(--primary-green);
}

.nav-number {
  font-size: 15px;
  font-weight: 600;
  color: var(--text-light);
  font-family: var(--font-family);
}

.nav-item.active .nav-number {
  color: var(--primary-green);
}

.nav-icon {
  color: var(--text-light);
}

.nav-item.active .nav-icon {
  color: var(--primary-green);
}

.nav-label-text {
  font-size: var(--font-size-caption-2);
  font-weight: 500;
  color: var(--text-gray);
  letter-spacing: 1px;
  font-family: var(--font-family);
}

.nav-item.active .nav-label-text {
  color: var(--text-main);
  font-weight: 600;
}

.sidebar-actions {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  margin-top: auto;
  padding-top: var(--spacing-lg);
  border-top: 1px solid var(--border-light);
}

.action-button {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm) var(--spacing-md);
  background-color: transparent;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  cursor: pointer;
  font-size: var(--font-size-caption-2);
  font-weight: 500;
  color: var(--text-gray);
  letter-spacing: 0.5px;
  transition: all 0.2s ease;
  font-family: var(--font-family);
}

.action-button:hover {
  background-color: var(--bg-elevated);
  border-color: var(--primary-green);
  color: var(--text-main);
}

.action-button:active {
  transform: scale(0.98);
}
</style>
