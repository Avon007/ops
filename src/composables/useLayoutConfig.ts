/**
 * LayoutConfig Composable
 * 布局配置管理 composable
 *
 * 职责：
 * - 封装布局模式相关逻辑
 * - 提供布局样式计算
 * - 响应设置变化
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

  // Computed - 是否紧凑模式
  const isCompact = computed(() => layoutMode.value === 'compact')

  // Computed - 是否宽松模式
  const isSpacious = computed(() => layoutMode.value === 'spacious')

  // Computed - 是否默认模式
  const isDefault = computed(() => layoutMode.value === 'default')

  return {
    // State
    layoutMode,
    cardSize,
    cardsPerRow,
    gapSize,
    // Computed
    layoutClasses,
    metricsGridStyle,
    isCompact,
    isSpacious,
    isDefault
  }
}
