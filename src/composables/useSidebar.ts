/**
 * Sidebar Composable
 * 侧边栏管理 composable
 *
 * 职责：
 * - 封装侧边栏状态逻辑
 * - 提供折叠/展开方法
 * - 计算侧边栏宽度
 */

import { computed } from 'vue'
import { useSettingsStore } from '@/stores/settings'

export function useSidebar() {
  // Store
  const settingsStore = useSettingsStore()

  // State
  const isCollapsed = computed(() => settingsStore.preferences.layout.sidebarCollapsed)

  // Computed - 侧边栏宽度
  const sidebarWidth = computed(() => (isCollapsed.value ? '70px' : '200px'))

  // Methods
  const toggle = () => {
    settingsStore.toggleSidebar()
  }

  const collapse = () => {
    if (!isCollapsed.value) {
      settingsStore.toggleSidebar()
    }
  }

  const expand = () => {
    if (isCollapsed.value) {
      settingsStore.toggleSidebar()
    }
  }

  return {
    // State
    isCollapsed,
    // Computed
    sidebarWidth,
    // Methods
    toggle,
    collapse,
    expand
  }
}
