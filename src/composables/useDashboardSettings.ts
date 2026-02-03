/**
 * DashboardSettings Composable
 * 仪表盘设置管理 composable
 *
 * 职责：
 * - 封装仪表盘组件可见性逻辑
 * - 封装交互功能设置逻辑
 * - 提供仪表盘设置辅助函数
 * - 响应设置变化
 *
 * 架构原则：
 * - 使用 computed 缓存派生状态
 * - 单一数据源（settings store）
 * - 清晰的返回结构
 * - 使用常量避免魔法值
 */

import { computed } from 'vue'
import { useSettingsStore } from '@/stores/settings'
import {
  isComponentVisible,
  toggleComponentVisibility,
  getVisibleComponents,
  type DashboardComponent,
  type DashboardConfig
} from '@/constants'

/**
 * 仪表盘设置 Composable
 */
export function useDashboardSettings() {
  // Store
  const settingsStore = useSettingsStore()

  // State - 从 store 读取（单一数据源）
  const dashboardConfig = computed<DashboardConfig>(
    () => settingsStore.preferences.dashboard
  )

  // Computed - 组件可见性
  const bannerAlertVisible = computed(() => dashboardConfig.value.showBannerAlert)
  const metricCardsVisible = computed(() => dashboardConfig.value.showMetricCards)
  const activityPanelVisible = computed(() => dashboardConfig.value.showActivityPanel)
  const terminalVisible = computed(() => dashboardConfig.value.showTerminal)
  const pageHeaderVisible = computed(() => dashboardConfig.value.showPageHeader)

  // Computed - 交互功能
  const draggableEnabled = computed(() => dashboardConfig.value.enableDraggable)
  const resizableEnabled = computed(() => dashboardConfig.value.enableResizable)

  // Computed - 可见组件列表
  const visibleComponents = computed(() => getVisibleComponents(dashboardConfig.value))

  /**
   * 判断组件是否可见
   */
  const isComponentVisibleCheck = (component: DashboardComponent): boolean => {
    return isComponentVisible(dashboardConfig.value, component)
  }

  /**
   * 切换组件可见性
   */
  const toggleComponent = (component: DashboardComponent) => {
    const newConfig = toggleComponentVisibility(dashboardConfig.value, component)
    settingsStore.updatePreferences({
      dashboard: newConfig
    })
  }

  /**
   * 设置横幅告警可见性
   */
  const setBannerAlertVisible = (visible: boolean) => {
    settingsStore.updatePreferences({
      dashboard: { ...dashboardConfig.value, showBannerAlert: visible }
    })
  }

  /**
   * 设置指标卡片可见性
   */
  const setMetricCardsVisible = (visible: boolean) => {
    settingsStore.updatePreferences({
      dashboard: { ...dashboardConfig.value, showMetricCards: visible }
    })
  }

  /**
   * 设置活动面板可见性
   */
  const setActivityPanelVisible = (visible: boolean) => {
    settingsStore.updatePreferences({
      dashboard: { ...dashboardConfig.value, showActivityPanel: visible }
    })
  }

  /**
   * 设置终端可见性
   */
  const setTerminalVisible = (visible: boolean) => {
    settingsStore.updatePreferences({
      dashboard: { ...dashboardConfig.value, showTerminal: visible }
    })
  }

  /**
   * 设置页面头部可见性
   */
  const setPageHeaderVisible = (visible: boolean) => {
    settingsStore.updatePreferences({
      dashboard: { ...dashboardConfig.value, showPageHeader: visible }
    })
  }

  /**
   * 设置可拖拽功能
   */
  const setDraggableEnabled = (enabled: boolean) => {
    settingsStore.updatePreferences({
      dashboard: { ...dashboardConfig.value, enableDraggable: enabled }
    })
  }

  /**
   * 设置可调整大小功能
   */
  const setResizableEnabled = (enabled: boolean) => {
    settingsStore.updatePreferences({
      dashboard: { ...dashboardConfig.value, enableResizable: enabled }
    })
  }

  /**
   * 切换可拖拽功能
   */
  const toggleDraggable = () => {
    setDraggableEnabled(!draggableEnabled.value)
  }

  /**
   * 切换可调整大小功能
   */
  const toggleResizable = () => {
    setResizableEnabled(!resizableEnabled.value)
  }

  return {
    // State
    dashboardConfig,
    // Computed - 组件可见性
    bannerAlertVisible,
    metricCardsVisible,
    activityPanelVisible,
    terminalVisible,
    pageHeaderVisible,
    // Computed - 交互功能
    draggableEnabled,
    resizableEnabled,
    // Computed - 可见组件列表
    visibleComponents,
    // Actions - 组件可见性
    isComponentVisible: isComponentVisibleCheck,
    toggleComponent,
    setBannerAlertVisible,
    setMetricCardsVisible,
    setActivityPanelVisible,
    setTerminalVisible,
    setPageHeaderVisible,
    // Actions - 交互功能
    setDraggableEnabled,
    setResizableEnabled,
    toggleDraggable,
    toggleResizable
  }
}
