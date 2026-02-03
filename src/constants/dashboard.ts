/**
 * Dashboard Constants
 * 仪表盘相关常量
 *
 * 职责：
 * - 定义仪表盘组件选项
 * - 定义默认值
 * - 提供类型安全的常量
 */

import type { DashboardConfig } from '@/types'

// ==================== Dashboard Components ====================

/**
 * 仪表盘组件类型
 */
export type DashboardComponent =
  | 'bannerAlert'
  | 'metricCards'
  | 'activityPanel'
  | 'terminal'
  | 'pageHeader'

/**
 * 仪表盘组件常量
 */
export const DASHBOARD_COMPONENTS = {
  BANNER_ALERT: 'bannerAlert' as DashboardComponent,
  METRIC_CARDS: 'metricCards' as DashboardComponent,
  ACTIVITY_PANEL: 'activityPanel' as DashboardComponent,
  TERMINAL: 'terminal' as DashboardComponent,
  PAGE_HEADER: 'pageHeader' as DashboardComponent
} as const

/**
 * 仪表盘组件列表
 */
export const DASHBOARD_COMPONENT_LIST: readonly DashboardComponent[] = [
  DASHBOARD_COMPONENTS.BANNER_ALERT,
  DASHBOARD_COMPONENTS.METRIC_CARDS,
  DASHBOARD_COMPONENTS.ACTIVITY_PANEL,
  DASHBOARD_COMPONENTS.TERMINAL,
  DASHBOARD_COMPONENTS.PAGE_HEADER
] as const

/**
 * 仪表盘组件显示名称（中文）
 */
export const DASHBOARD_COMPONENT_NAMES: Record<DashboardComponent, string> = {
  bannerAlert: '横幅告警',
  metricCards: '指标卡片',
  activityPanel: '活动面板',
  terminal: '终端',
  pageHeader: '页面头部'
} as const

/**
 * 仪表盘组件描述
 */
export const DASHBOARD_COMPONENT_DESCRIPTIONS: Record<DashboardComponent, string> = {
  bannerAlert: '显示系统重要通知和告警信息',
  metricCards: '显示系统性能指标卡片',
  activityPanel: '显示系统活动日志',
  terminal: '显示命令行终端',
  pageHeader: '显示页面标题和操作按钮'
} as const

// ==================== Interactive Features ====================

/**
 * 交互功能类型
 */
export type InteractiveFeature = 'draggable' | 'resizable'

/**
 * 交互功能常量
 */
export const INTERACTIVE_FEATURES = {
  DRAGGABLE: 'draggable' as InteractiveFeature,
  RESIZABLE: 'resizable' as InteractiveFeature
} as const

/**
 * 交互功能显示名称（中文）
 */
export const INTERACTIVE_FEATURE_NAMES: Record<InteractiveFeature, string> = {
  draggable: '可拖拽',
  resizable: '可调整大小'
} as const

/**
 * 交互功能描述
 */
export const INTERACTIVE_FEATURE_DESCRIPTIONS: Record<InteractiveFeature, string> = {
  draggable: '允许拖拽组件重新排列',
  resizable: '允许调整组件大小'
} as const

// ==================== Default Configuration ====================

/**
 * 默认仪表盘配置
 */
export const DEFAULT_DASHBOARD_CONFIG: DashboardConfig = {
  showBannerAlert: true,
  showMetricCards: true,
  showActivityPanel: true,
  showTerminal: true,
  showPageHeader: true,
  enableDraggable: true,
  enableResizable: true
} as const

// ==================== Helper Functions ====================

/**
 * 判断组件是否可见
 */
export const isComponentVisible = (
  config: DashboardConfig,
  component: DashboardComponent
): boolean => {
  switch (component) {
    case DASHBOARD_COMPONENTS.BANNER_ALERT:
      return config.showBannerAlert
    case DASHBOARD_COMPONENTS.METRIC_CARDS:
      return config.showMetricCards
    case DASHBOARD_COMPONENTS.ACTIVITY_PANEL:
      return config.showActivityPanel
    case DASHBOARD_COMPONENTS.TERMINAL:
      return config.showTerminal
    case DASHBOARD_COMPONENTS.PAGE_HEADER:
      return config.showPageHeader
    default:
      return true
  }
}

/**
 * 切换组件可见性
 */
export const toggleComponentVisibility = (
  config: DashboardConfig,
  component: DashboardComponent
): DashboardConfig => {
  const newConfig = { ...config }

  switch (component) {
    case DASHBOARD_COMPONENTS.BANNER_ALERT:
      newConfig.showBannerAlert = !config.showBannerAlert
      break
    case DASHBOARD_COMPONENTS.METRIC_CARDS:
      newConfig.showMetricCards = !config.showMetricCards
      break
    case DASHBOARD_COMPONENTS.ACTIVITY_PANEL:
      newConfig.showActivityPanel = !config.showActivityPanel
      break
    case DASHBOARD_COMPONENTS.TERMINAL:
      newConfig.showTerminal = !config.showTerminal
      break
    case DASHBOARD_COMPONENTS.PAGE_HEADER:
      newConfig.showPageHeader = !config.showPageHeader
      break
  }

  return newConfig
}

/**
 * 获取可见组件列表
 */
export const getVisibleComponents = (config: DashboardConfig): DashboardComponent[] => {
  return DASHBOARD_COMPONENT_LIST.filter((component) =>
    isComponentVisible(config, component)
  )
}
