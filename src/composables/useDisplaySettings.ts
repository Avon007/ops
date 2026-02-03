/**
 * DisplaySettings Composable
 * 显示设置管理 composable
 *
 * 职责：
 * - 封装显示设置相关逻辑
 * - 应用动画和过渡设置到 DOM
 * - 提供显示设置辅助函数
 * - 响应设置变化
 *
 * 架构原则：
 * - 使用 computed 缓存派生状态
 * - 单一数据源（settings store）
 * - 清晰的返回结构
 * - 使用常量避免魔法值
 */

import { computed, watch, onMounted } from 'vue'
import { useSettingsStore } from '@/stores/settings'
import {
  shouldDisableAnimations,
  shouldDisableTransitions,
  getMotionClass,
  type DisplaySettingsOption
} from '@/constants'

/**
 * 显示设置 Composable
 */
export function useDisplaySettings() {
  // Store
  const settingsStore = useSettingsStore()

  // State - 从 store 读取（单一数据源）
  const displaySettings = computed<DisplaySettingsOption>(
    () => settingsStore.preferences.display
  )

  // Computed - 设置状态
  const animationsEnabled = computed(() => displaySettings.value.animationsEnabled)
  const transitionsEnabled = computed(() => displaySettings.value.transitionsEnabled)
  const reduceMotion = computed(() => displaySettings.value.reduceMotion)

  // Computed - 辅助判断
  const isAnimationsDisabled = computed(() =>
    shouldDisableAnimations(displaySettings.value)
  )
  const isTransitionsDisabled = computed(() =>
    shouldDisableTransitions(displaySettings.value)
  )
  const isMotionReduced = computed(() => displaySettings.value.reduceMotion)

  /**
   * 应用显示设置到 DOM
   */
  const applyDisplaySettings = () => {
    if (typeof document === 'undefined') return

    const root = document.documentElement
    const body = document.body

    // 移除旧的类名
    root.classList.remove('no-animations', 'no-transitions', 'reduce-motion')
    body.classList.remove('no-animations', 'no-transitions', 'reduce-motion')

    // 应用新的类名
    const motionClass = getMotionClass(displaySettings.value)
    if (motionClass) {
      const classes = motionClass.split(' ').filter(Boolean)
      classes.forEach((cls) => {
        root.classList.add(cls)
        body.classList.add(cls)
      })
    }

    // 设置 CSS 变量
    root.style.setProperty(
      '--animations-enabled',
      animationsEnabled.value ? '1' : '0'
    )
    root.style.setProperty(
      '--transitions-enabled',
      transitionsEnabled.value ? '1' : '0'
    )
  }

  /**
   * 切换动画设置
   */
  const toggleAnimations = () => {
    settingsStore.updatePreferences({
      display: {
        ...displaySettings.value,
        animationsEnabled: !animationsEnabled.value
      }
    })
  }

  /**
   * 切换过渡设置
   */
  const toggleTransitions = () => {
    settingsStore.updatePreferences({
      display: {
        ...displaySettings.value,
        transitionsEnabled: !transitionsEnabled.value
      }
    })
  }

  /**
   * 切换减少动效设置
   */
  const toggleReduceMotion = () => {
    settingsStore.updatePreferences({
      display: {
        ...displaySettings.value,
        reduceMotion: !reduceMotion.value
      }
    })
  }

  /**
   * 设置动画
   */
  const setAnimations = (enabled: boolean) => {
    settingsStore.updatePreferences({
      display: {
        ...displaySettings.value,
        animationsEnabled: enabled
      }
    })
  }

  /**
   * 设置过渡
   */
  const setTransitions = (enabled: boolean) => {
    settingsStore.updatePreferences({
      display: {
        ...displaySettings.value,
        transitionsEnabled: enabled
      }
    })
  }

  /**
   * 设置减少动效
   */
  const setReduceMotion = (reduced: boolean) => {
    settingsStore.updatePreferences({
      display: {
        ...displaySettings.value,
        reduceMotion: reduced
      }
    })
  }

  // Watch for changes and apply to DOM
  watch(
    displaySettings,
    () => {
      applyDisplaySettings()
    },
    { deep: true }
  )

  // Apply settings on composable creation
  onMounted(() => {
    applyDisplaySettings()
  })

  return {
    // State
    displaySettings,
    // Computed - 设置状态
    animationsEnabled,
    transitionsEnabled,
    reduceMotion,
    // Computed - 辅助判断
    isAnimationsDisabled,
    isTransitionsDisabled,
    isMotionReduced,
    // Actions
    applyDisplaySettings,
    toggleAnimations,
    toggleTransitions,
    toggleReduceMotion,
    setAnimations,
    setTransitions,
    setReduceMotion
  }
}
