/**
 * Layout Constants
 * 布局相关常量
 *
 * 职责：
 * - 定义布局模式
 * - 定义卡片大小
 * - 定义间距大小
 * - 提供类型安全的常量
 */

import type { LayoutMode, CardSize } from '@/types'

// ==================== Layout Modes ====================

/**
 * 布局模式常量
 */
export const LAYOUT_MODES = {
  SIDEBAR_LEFT: 'sidebar-left' as LayoutMode,
  SIDEBAR_RIGHT: 'sidebar-right' as LayoutMode,
  NO_SIDEBAR: 'no-sidebar' as LayoutMode
} as const

/**
 * 所有布局模式列表
 */
export const LAYOUT_MODE_LIST: readonly LayoutMode[] = [
  LAYOUT_MODES.SIDEBAR_LEFT,
  LAYOUT_MODES.SIDEBAR_RIGHT,
  LAYOUT_MODES.NO_SIDEBAR
] as const

/**
 * 默认布局模式
 */
export const DEFAULT_LAYOUT_MODE = LAYOUT_MODES.SIDEBAR_LEFT

// ==================== Card Sizes ====================

/**
 * 卡片大小常量
 */
export const CARD_SIZES = {
  SMALL: 'small' as CardSize,
  MEDIUM: 'medium' as CardSize,
  LARGE: 'large' as CardSize,
  AUTO: 'auto' as CardSize
} as const

/**
 * 默认卡片大小
 */
export const DEFAULT_CARD_SIZE = CARD_SIZES.MEDIUM

// ==================== Gap Sizes ====================

/**
 * 间距大小常量
 */
export const GAP_SIZES = {
  SMALL: 'small' as const,
  MEDIUM: 'medium' as const,
  LARGE: 'large' as const
} as const

/**
 * 默认间距大小
 */
export const DEFAULT_GAP_SIZE = GAP_SIZES.MEDIUM

// ==================== Sidebar Position ====================

/**
 * 侧边栏位置类型
 */
export type SidebarPosition = 'left' | 'right' | 'none'

/**
 * 侧边栏位置映射
 */
export const SIDEBAR_POSITION_MAP: Record<LayoutMode, SidebarPosition> = {
  'sidebar-left': 'left',
  'sidebar-right': 'right',
  'no-sidebar': 'none'
} as const

/**
 * 获取侧边栏位置
 */
export const getSidebarPosition = (mode: LayoutMode): SidebarPosition =>
  SIDEBAR_POSITION_MAP[mode] ?? 'left'

/**
 * 判断是否显示侧边栏
 */
export const shouldShowSidebar = (mode: LayoutMode): boolean =>
  mode !== LAYOUT_MODES.NO_SIDEBAR
