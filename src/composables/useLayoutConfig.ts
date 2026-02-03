/**
 * LayoutConfig Composable
 * 布局配置管理 composable
 *
 * 职责：
 * - 封装布局模式相关逻辑
 * - 提供布局样式计算
 * - 响应设置变化
 * - 管理侧边栏位置和显示
 */

import { computed } from 'vue'
import { useSettingsStore } from '@/stores/settings'

export function useLayoutConfig() {
  // Store
  const settingsStore = useSettingsStore()

  // State (从 store 读取)
  const layoutMode = computed(() => settingsStore.layoutMode)
  const cardSize = computed(() => settingsStore.cardSize)
  const cardsPerRow = computed(() => settingsStore.preferences.layout.cardsPerRow)
  const gapSize = computed(() => settingsStore.preferences.layout.gapSize)

  // Computed - 布局类名
  const layoutClasses = computed(() => ({
    [`layout-${layoutMode.value}`]: true,
    [`gap-${gapSize.value}`]: true
  }))

  // Computed - Metrics Grid 样式
  const metricsGridStyle = computed(() => ({
    gridTemplateColumns: `repeat(${cardsPerRow.value}, 1fr)`
  }))

  // Computed - 侧边栏位置
  const sidebarPosition = computed(() => {
    if (layoutMode.value === 'sidebar-right') return 'right'
    if (layoutMode.value === 'no-sidebar') return 'none'
    return 'left' // default, compact, spacious, sidebar-left
  })

  // Computed - 是否显示侧边栏
  const showSidebar = computed(() => layoutMode.value !== 'no-sidebar')

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

  // Computed - 是否紧凑模式
  const isCompact = computed(() => layoutMode.value === 'compact')

  // Computed - 是否宽松模式
  const isSpacious = computed(() => layoutMode.value === 'spacious')

  // Computed - 是否默认模式
  const isDefault = computed(() => layoutMode.value === 'default')

  // Computed - 是否侧边栏在左
  const isSidebarLeft = computed(() => sidebarPosition.value === 'left')

  // Computed - 是否侧边栏在右
  const isSidebarRight = computed(() => sidebarPosition.value === 'right')

  // Computed - 是否无侧边栏
  const isNoSidebar = computed(() => sidebarPosition.value === 'none')

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
    isCompact,
    isSpacious,
    isDefault,
    isSidebarLeft,
    isSidebarRight,
    isNoSidebar
  }
}
