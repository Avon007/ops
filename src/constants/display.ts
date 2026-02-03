/**
 * Display Constants
 * 显示相关常量
 *
 * 职责：
 * - 定义动画选项
 * - 定义过渡选项
 * - 定义动效偏好选项
 * - 提供类型安全的常量
 */

// ==================== Animation Options ====================

/**
 * 动画选项类型
 */
export type AnimationOption = 'enabled' | 'disabled'

/**
 * 动画选项常量
 */
export const ANIMATION_OPTIONS = {
  ENABLED: 'enabled' as AnimationOption,
  DISABLED: 'disabled' as AnimationOption
} as const

/**
 * 默认动画选项
 */
export const DEFAULT_ANIMATION = ANIMATION_OPTIONS.ENABLED

// ==================== Transition Options ====================

/**
 * 过渡选项类型
 */
export type TransitionOption = 'enabled' | 'disabled'

/**
 * 过渡选项常量
 */
export const TRANSITION_OPTIONS = {
  ENABLED: 'enabled' as TransitionOption,
  DISABLED: 'disabled' as TransitionOption
} as const

/**
 * 默认过渡选项
 */
export const DEFAULT_TRANSITION = TRANSITION_OPTIONS.ENABLED

// ==================== Motion Preferences ====================

/**
 * 动效偏好类型
 */
export type MotionPreference = 'normal' | 'reduced'

/**
 * 动效偏好常量
 */
export const MOTION_PREFERENCES = {
  NORMAL: 'normal' as MotionPreference,
  REDUCED: 'reduced' as MotionPreference
} as const

/**
 * 默认动效偏好
 */
export const DEFAULT_MOTION = MOTION_PREFERENCES.NORMAL

// ==================== Display Settings ====================

/**
 * 显示设置选项
 */
export interface DisplaySettingsOption {
  animationsEnabled: boolean
  transitionsEnabled: boolean
  reduceMotion: boolean
}

/**
 * 默认显示设置
 */
export const DEFAULT_DISPLAY_SETTINGS: DisplaySettingsOption = {
  animationsEnabled: true,
  transitionsEnabled: true,
  reduceMotion: false
} as const

// ==================== Helper Functions ====================

/**
 * 将布尔值转换为动画选项
 */
export const toAnimationOption = (enabled: boolean): AnimationOption =>
  enabled ? ANIMATION_OPTIONS.ENABLED : ANIMATION_OPTIONS.DISABLED

/**
 * 将布尔值转换为过渡选项
 */
export const toTransitionOption = (enabled: boolean): TransitionOption =>
  enabled ? TRANSITION_OPTIONS.ENABLED : TRANSITION_OPTIONS.DISABLED

/**
 * 将布尔值转换为动效偏好
 */
export const toMotionPreference = (reduced: boolean): MotionPreference =>
  reduced ? MOTION_PREFERENCES.REDUCED : MOTION_PREFERENCES.NORMAL

/**
 * 判断是否应该禁用动画
 */
export const shouldDisableAnimations = (settings: DisplaySettingsOption): boolean =>
  !settings.animationsEnabled || settings.reduceMotion

/**
 * 判断是否应该禁用过渡
 */
export const shouldDisableTransitions = (settings: DisplaySettingsOption): boolean =>
  !settings.transitionsEnabled || settings.reduceMotion

/**
 * 获取 CSS 类名前缀（用于全局控制动画）
 */
export const getMotionClass = (settings: DisplaySettingsOption): string => {
  const classes: string[] = []

  if (shouldDisableAnimations(settings)) {
    classes.push('no-animations')
  }

  if (shouldDisableTransitions(settings)) {
    classes.push('no-transitions')
  }

  if (settings.reduceMotion) {
    classes.push('reduce-motion')
  }

  return classes.join(' ')
}
