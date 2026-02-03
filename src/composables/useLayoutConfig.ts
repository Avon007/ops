/**
 * LayoutConfig Composable
 * 布局配置管理 composable
 *
 * 职责：
 * - 封装侧边栏位置相关逻辑
 * - 提供布局样式计算
 * - 响应设置变化
 * - 管理侧边栏显示状态
 *
 * 架构原则：
 * - 使用 computed 缓存派生状态
 * - 单一数据源（settings store）
 * - 清晰的返回结构
 * - 使用常量避免魔法值
 */

import { computed } from 'vue'
import { useSettingsStore } from '@/stores/settings'
import { getSidebarPosition, shouldShowSidebar } from '@/constants'

export function useLayoutConfig() {
  // Store
  const settingsStore = useSettingsStore()

  // State - 从 store 读取（单一数据源）
  const layoutMode = computed(() => settingsStore.layoutMode)
  const cardSize = computed(() => settingsStore.cardSize)
  const cardsPerRow = computed(() => settingsStore.preferences.layout.cardsPerRow)
  const gapSize = computed(() => settingsStore.preferences.layout.gapSize)

  // Computed - 布局类名
  const layoutClasses = computed(() => ({
    [`gap-${gapSize.value}`]: true
  }))

  // Computed - Metrics Grid 样式
  const metricsGridStyle = computed(() => ({
    gridTemplateColumns: `repeat(${cardsPerRow.value}, 1fr)`
  }))

  // Computed - 侧边栏位置（使用常量函数）
  const sidebarPosition = computed(() => getSidebarPosition(layoutMode.value))

  // Computed - 是否显示侧边栏（使用常量函数）
  const showSidebar = computed(() => shouldShowSidebar(layoutMode.value))

  // Computed - 侧边栏样式类
  const sidebarClasses = computed(() => ({
    'sidebar-left': sidebarPosition.value === 'left',
    'sidebar-right': sidebarPosition.value === 'right'
  }))

  // Computed - 主内容样式类
  const mainContentClasses = computed(() => ({
    'with-sidebar': showSidebar.value,
    'without-sidebar': !showSidebar.value,
    'sidebar-left': sidebarPosition.value === 'left',
    'sidebar-right': sidebarPosition.value === 'right'
  }))

  // Computed - 布局模式判断（语义化命名）
  const isSidebarLeft = computed(() => layoutMode.value === 'sidebar-left')
  const isSidebarRight = computed(() => layoutMode.value === 'sidebar-right')
  const isNoSidebar = computed(() => layoutMode.value === 'no-sidebar')

  return {
    // State
    layoutMode,
    cardSize,
    cardsPerRow,
    gapSize,
    // Computed - 布局
    layoutClasses,
    metricsGridStyle,
    // Computed - 侧边栏
    sidebarPosition,
    showSidebar,
    sidebarClasses,
    mainContentClasses,
    // Computed - 模式判断
    isSidebarLeft,
    isSidebarRight,
    isNoSidebar
  }
}
