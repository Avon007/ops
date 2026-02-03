/**
 * Settings Store
 * 用户设置状态管理
 * 替代非响应式的 preferencesService
 *
 * 架构原则：
 * - 使用常量避免魔法值
 * - Setup Store 模式
 * - 类型安全
 */

import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import type { UserPreferences, LayoutMode, CardSize } from '@/types'
import { DEFAULT_LAYOUT_MODE, DEFAULT_CARD_SIZE, DEFAULT_DISPLAY_SETTINGS } from '@/constants'

const STORAGE_KEY = 'ops-assistant-preferences'

// 默认配置
const defaultPreferences: UserPreferences = {
  layout: {
    mode: DEFAULT_LAYOUT_MODE,
    sidebarWidth: 260,
    sidebarCollapsed: false,
    showHeader: true,
    showFooter: false,
    cardSize: DEFAULT_CARD_SIZE,
    cardsPerRow: 3,
    gapSize: 'medium'
  },
  display: DEFAULT_DISPLAY_SETTINGS,
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

export const useSettingsStore = defineStore('settings', () => {
  // State
  const preferences = ref<UserPreferences>({ ...defaultPreferences })

  // Getters
  const layoutMode = computed(() => preferences.value.layout.mode)
  const cardSize = computed(() => preferences.value.layout.cardSize)
  const fontSize = computed(() => preferences.value.font.size)
  const animationsEnabled = computed(() => preferences.value.display.animationsEnabled)

  // Actions
  const loadPreferences = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        preferences.value = mergePreferences(defaultPreferences, parsed)
      }
    } catch (error) {
      console.error('Failed to load preferences:', error)
      preferences.value = { ...defaultPreferences }
    }
  }

  const savePreferences = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences.value))
    } catch (error) {
      console.error('Failed to save preferences:', error)
    }
  }

  const setLayoutMode = (mode: LayoutMode) => {
    preferences.value.layout.mode = mode
    savePreferences()
  }

  const setCardSize = (size: CardSize) => {
    preferences.value.layout.cardSize = size
    savePreferences()
  }

  const setCardsPerRow = (count: number) => {
    preferences.value.layout.cardsPerRow = Math.min(Math.max(count, 1), 6)
    savePreferences()
  }

  const toggleSidebar = () => {
    preferences.value.layout.sidebarCollapsed = !preferences.value.layout.sidebarCollapsed
    savePreferences()
  }

  const setAnimations = (enabled: boolean) => {
    preferences.value.display.animationsEnabled = enabled
    preferences.value.display.transitionsEnabled = enabled
    savePreferences()
    applyFontSettings()
  }

  const setFontSize = (size: 'small' | 'medium' | 'large' | 'extra-large') => {
    preferences.value.font.size = size
    savePreferences()
    applyFontSettings()
  }

  const updatePreferences = (updates: Partial<UserPreferences>) => {
    preferences.value = {
      ...preferences.value,
      ...updates,
      layout: { ...preferences.value.layout, ...updates.layout },
      display: { ...preferences.value.display, ...updates.display },
      font: { ...preferences.value.font, ...updates.font },
      notifications: { ...preferences.value.notifications, ...updates.notifications },
      dataRefresh: { ...preferences.value.dataRefresh, ...updates.dataRefresh }
    }
    savePreferences()
    applyFontSettings()
  }

  const resetPreferences = () => {
    preferences.value = { ...defaultPreferences }
    savePreferences()
    applyFontSettings()
  }

  const exportPreferences = (): string => {
    return JSON.stringify(preferences.value, null, 2)
  }

  const importPreferences = (json: string): boolean => {
    try {
      const parsed = JSON.parse(json)
      preferences.value = mergePreferences(defaultPreferences, parsed)
      savePreferences()
      applyFontSettings()
      return true
    } catch (error) {
      console.error('Failed to import preferences:', error)
      return false
    }
  }

  // Apply font settings to DOM
  const applyFontSettings = () => {
    if (typeof document === 'undefined') return

    const root = document.documentElement
    const fontSizes = {
      small: '13px',
      medium: '15px',
      large: '17px',
      'extra-large': '19px'
    }

    root.style.setProperty('--font-size-base', fontSizes[preferences.value.font.size])
    root.style.setProperty('--font-family', preferences.value.font.family)
    root.style.setProperty('--line-height', String(preferences.value.font.lineHeight))

    document.body.style.fontFamily = preferences.value.font.family
    document.body.style.fontSize = fontSizes[preferences.value.font.size]
    document.body.style.lineHeight = String(preferences.value.font.lineHeight)
  }

  // Helper: 深度合并
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

  // Watch for changes and sync to DOM
  watch(
    () => preferences.value.font,
    () => {
      applyFontSettings()
    },
    { deep: true }
  )

  // Load preferences on store creation
  loadPreferences()

  return {
    // State
    preferences,
    // Getters
    layoutMode,
    cardSize,
    fontSize,
    animationsEnabled,
    // Actions
    loadPreferences,
    savePreferences,
    setLayoutMode,
    setCardSize,
    setCardsPerRow,
    toggleSidebar,
    setAnimations,
    setFontSize,
    updatePreferences,
    resetPreferences,
    exportPreferences,
    importPreferences,
    applyFontSettings
  }
})
