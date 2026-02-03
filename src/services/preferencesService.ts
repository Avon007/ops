/**
 * User Preferences Service
 * 用户个性化配置服务
 */

import type {
  UserPreferences,
  LayoutConfig,
  DisplayConfig,
  FontConfig,
  LayoutMode,
  CardSize
} from '@/types'

const STORAGE_KEY = 'ops-assistant-preferences'

// 默认配置
const defaultPreferences: UserPreferences = {
  layout: {
    mode: 'sidebar-left',
    sidebarWidth: 260,
    sidebarCollapsed: false,
    showHeader: true,
    showFooter: false,
    cardSize: 'medium',
    cardsPerRow: 3,
    gapSize: 'medium'
  },
  display: {
    animationsEnabled: true,
    transitionsEnabled: true,
    reduceMotion: false
  },
  font: {
    size: 'medium',
    family: "'Inter', 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', sans-serif",
    lineHeight: 1.5
  },
  language: 'zh-CN',
  timezone: 'Asia/Shanghai',
  dateFormat: 'YYYY-MM-DD',
  timeFormat: '24h',
  notifications: {
    enabled: true,
    sound: false,
    desktop: true,
    position: 'top-right'
  },
  dataRefresh: {
    interval: 30,
    autoRefresh: true
  }
}

// 配置状态（使用普通对象，通过订阅模式实现响应式）
let currentPreferences: UserPreferences = { ...defaultPreferences }
let listeners: Set<(prefs: UserPreferences) => void> = new Set()

/**
 * 初始化配置服务
 */
export function initPreferencesService(): void {
  if (typeof window === 'undefined') return

  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      // 合并配置，确保新增字段使用默认值
      currentPreferences = mergePreferences(defaultPreferences, parsed)
    }
  } catch (error) {
    console.error('Failed to load preferences:', error)
    currentPreferences = defaultPreferences
  }
}

/**
 * 合并配置（深度合并）
 */
function mergePreferences(
  defaults: UserPreferences,
  stored: Partial<UserPreferences>
): UserPreferences {
  return {
    layout: { ...defaults.layout, ...stored.layout },
    display: { ...defaults.display, ...stored.display },
    font: { ...defaults.font, ...stored.font },
    language: stored.language || defaults.language,
    timezone: stored.timezone || defaults.timezone,
    dateFormat: stored.dateFormat || defaults.dateFormat,
    timeFormat: stored.timeFormat || defaults.timeFormat,
    notifications: { ...defaults.notifications, ...stored.notifications },
    dataRefresh: { ...defaults.dataRefresh, ...stored.dataRefresh }
  }
}

/**
 * 获取当前配置
 */
export function getPreferences(): UserPreferences {
  return { ...currentPreferences }
}

/**
 * 获取布局配置
 */
export function getLayout(): LayoutConfig {
  return { ...currentPreferences.layout }
}

/**
 * 获取显示配置
 */
export function getDisplay(): DisplayConfig {
  return { ...currentPreferences.display }
}

/**
 * 获取字体配置
 */
export function getFont(): FontConfig {
  return { ...currentPreferences.font }
}

/**
 * 设置布局模式
 */
export function setLayoutMode(mode: LayoutMode): void {
  currentPreferences.layout.mode = mode
  savePreferences()
  notifyListeners()
}

/**
 * 设置卡片大小
 */
export function setCardSize(size: CardSize): void {
  currentPreferences.layout.cardSize = size
  savePreferences()
  notifyListeners()
}

/**
 * 设置每行卡片数
 */
export function setCardsPerRow(count: number): void {
  currentPreferences.layout.cardsPerRow = Math.min(Math.max(count, 1), 6)
  savePreferences()
  notifyListeners()
}

/**
 * 切换侧边栏折叠
 */
export function toggleSidebar(): void {
  currentPreferences.layout.sidebarCollapsed = !currentPreferences.layout.sidebarCollapsed
  savePreferences()
  notifyListeners()
}

/**
 * 设置动画
 */
export function setAnimations(enabled: boolean): void {
  currentPreferences.display.animationsEnabled = enabled
  currentPreferences.display.transitionsEnabled = enabled
  savePreferences()
  notifyListeners()
}

/**
 * 设置字体大小
 */
export function setFontSize(size: 'small' | 'medium' | 'large' | 'extra-large'): void {
  currentPreferences.font.size = size
  savePreferences()
  notifyListeners()
  applyFontToDOM()
}

/**
 * 更新配置
 */
export function updatePreferences(updates: Partial<UserPreferences>): void {
  currentPreferences = {
    ...currentPreferences,
    ...updates,
    layout: { ...currentPreferences.layout, ...updates.layout },
    display: { ...currentPreferences.display, ...updates.display },
    font: { ...currentPreferences.font, ...updates.font },
    notifications: { ...currentPreferences.notifications, ...updates.notifications },
    dataRefresh: { ...currentPreferences.dataRefresh, ...updates.dataRefresh }
  }
  savePreferences()
  notifyListeners()
  applyFontToDOM()
}

/**
 * 重置配置
 */
export function resetPreferences(): void {
  currentPreferences = { ...defaultPreferences }
  savePreferences()
  notifyListeners()
  applyFontToDOM()
}

/**
 * 保存配置到 localStorage
 */
function savePreferences(): void {
  if (typeof window === 'undefined') return

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(currentPreferences))
  } catch (error) {
    console.error('Failed to save preferences:', error)
  }
}

/**
 * 应用字体到 DOM
 */
function applyFontToDOM(): void {
  if (typeof document === 'undefined') return

  const root = document.documentElement
  const fontSizes = {
    small: '13px',
    medium: '15px',
    large: '17px',
    'extra-large': '19px'
  }

  root.style.setProperty('--font-size-base', fontSizes[currentPreferences.font.size])
  root.style.setProperty('--font-family', currentPreferences.font.family)
  root.style.setProperty('--line-height', String(currentPreferences.font.lineHeight))

  document.body.style.fontFamily = currentPreferences.font.family
  document.body.style.fontSize = fontSizes[currentPreferences.font.size]
  document.body.style.lineHeight = String(currentPreferences.font.lineHeight)
}

/**
 * 订阅配置变化
 */
export function subscribe(callback: (prefs: UserPreferences) => void): () => void {
  listeners.add(callback)
  return () => listeners.delete(callback)
}

/**
 * 通知监听器
 */
function notifyListeners(): void {
  listeners.forEach(callback => callback(getPreferences()))
}

/**
 * 导出配置
 */
export function exportPreferences(): string {
  return JSON.stringify(currentPreferences, null, 2)
}

/**
 * 导入配置
 */
export function importPreferences(json: string): boolean {
  try {
    const parsed = JSON.parse(json)
    currentPreferences = mergePreferences(defaultPreferences, parsed)
    savePreferences()
    notifyListeners()
    applyFontToDOM()
    return true
  } catch (error) {
    console.error('Failed to import preferences:', error)
    return false
  }
}

// 初始化时应用字体
if (typeof window !== 'undefined') {
  initPreferencesService()
  applyFontToDOM()
}
