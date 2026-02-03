/**
 * Settings Options Composable
 * 设置选项管理
 *
 * 职责：
 * - 提供设置面板的选项数据
 * - 集中管理选项常量
 * - 清晰的类型定义
 *
 * 架构原则：
 * - 使用常量避免重复创建
 * - Computed 缓存选项数据
 * - 类型安全
 */

import { computed } from 'vue'
import { Layout, Monitor, Type, PanelLeftClose, X } from 'lucide-vue-next'
import type { LayoutMode, CardSize } from '@/types'

// Constants - 布局选项配置
const LAYOUT_OPTIONS = [
  {
    value: 'sidebar-left' as LayoutMode,
    name: '左侧边栏',
    icon: PanelLeftClose,
    description: '侧边栏固定在左侧'
  },
  {
    value: 'sidebar-right' as LayoutMode,
    name: '右侧边栏',
    icon: Layout,
    description: '侧边栏固定在右侧'
  },
  {
    value: 'no-sidebar' as LayoutMode,
    name: '无边栏',
    icon: X,
    description: '隐藏侧边栏，最大化内容区'
  }
] as const

// Constants - 卡片大小选项配置
const CARD_SIZE_OPTIONS = [
  {
    value: 'small' as CardSize,
    name: '小',
    description: '显示更多内容'
  },
  {
    value: 'medium' as CardSize,
    name: '中',
    description: '平衡显示'
  },
  {
    value: 'large' as CardSize,
    name: '大',
    description: '更易阅读'
  },
  {
    value: 'auto' as CardSize,
    name: '自适应',
    description: '自动调整'
  }
] as const

// Constants - 字体大小选项配置
const FONT_SIZE_OPTIONS = [
  { value: 'small' as const, name: '小', size: '13px' },
  { value: 'medium' as const, name: '中', size: '15px' },
  { value: 'large' as const, name: '大', size: '17px' },
  { value: 'extra-large' as const, name: '特大', size: '19px' }
] as const

// Constants - 标签页配置
const TABS = [
  { id: 'layout', name: '布局', icon: Layout },
  { id: 'display', name: '显示', icon: Monitor },
  { id: 'font', name: '字体', icon: Type }
] as const

export function useSettingsOptions() {
  // Computed - 布局模式选项
  const layoutOptions = computed(() => LAYOUT_OPTIONS)

  // Computed - 卡片大小选项
  const cardSizeOptions = computed(() => CARD_SIZE_OPTIONS)

  // Computed - 字体大小选项
  const fontSizeOptions = computed(() => FONT_SIZE_OPTIONS)

  // Computed - 标签页
  const tabs = computed(() => TABS)

  return {
    layoutOptions,
    cardSizeOptions,
    fontSizeOptions,
    tabs
  }
}
