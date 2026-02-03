/**
 * Settings Options Composable
 * 设置选项管理
 */

import { computed } from 'vue'
import { Layout, Monitor, Type, PanelLeftClose, X } from 'lucide-vue-next'
import type { LayoutMode, CardSize } from '@/types'

export function useSettingsOptions() {
  // Layout mode options
  const layoutOptions = computed(() => [
    {
      value: 'default' as LayoutMode,
      name: '默认布局',
      icon: Layout,
      description: '标准布局，左侧边栏'
    },
    {
      value: 'compact' as LayoutMode,
      name: '紧凑布局',
      icon: Monitor,
      description: '更紧凑的间距和内边距'
    },
    {
      value: 'spacious' as LayoutMode,
      name: '宽松布局',
      icon: Layout,
      description: '更宽松的间距'
    },
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
  ])

  // Card size options
  const cardSizeOptions = computed(() => [
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
  ])

  // Font size options
  const fontSizeOptions = computed(() => [
    { value: 'small' as const, name: '小', size: '13px' },
    { value: 'medium' as const, name: '中', size: '15px' },
    { value: 'large' as const, name: '大', size: '17px' },
    { value: 'extra-large' as const, name: '特大', size: '19px' }
  ])

  // Tabs
  const tabs = computed(() => [
    { id: 'layout', name: '布局', icon: Layout },
    { id: 'display', name: '显示', icon: Monitor },
    { id: 'font', name: '字体', icon: Type }
  ])

  return {
    layoutOptions,
    cardSizeOptions,
    fontSizeOptions,
    tabs
  }
}
