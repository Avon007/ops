import type { Component } from 'vue'
import {
  AlertCircle,
  AlertTriangle,
  Info,
  CheckCircle
} from 'lucide-vue-next'
import type { Log } from '@/stores/logs'

/**
 * Composable for log helper functions
 */
export function useLogHelpers() {
  /**
   * Get the icon component for a given log level
   */
  const getLevelIcon = (level: string): Component => {
    switch (level) {
      case 'error':
        return AlertCircle
      case 'warning':
        return AlertTriangle
      case 'info':
        return Info
      case 'debug':
        return CheckCircle
      default:
        return Info
    }
  }

  /**
   * Get the CSS class for a given log level
   */
  const getLevelClass = (level: string): string => {
    return `log-level-${level}`
  }

  /**
   * Get the text color for a given log level
   */
  const getLevelColor = (level: string): string => {
    const colors = {
      error: 'var(--status-error)',
      warning: 'var(--status-warning)',
      info: 'var(--status-info)',
      debug: 'var(--status-success)'
    }
    return colors[level as keyof typeof colors] || colors.info
  }

  /**
   * Get the background color for a given log level
   */
  const getLevelBgColor = (level: string): string => {
    const colors = {
      error: 'var(--status-error-bg)',
      warning: '#FFF3E0',
      info: '#E3F2FD',
      debug: 'var(--accent-light)'
    }
    return colors[level as keyof typeof colors] || colors.info
  }

  /**
   * Format timestamp for display
   */
  const formatTimestamp = (timestamp: string): string => {
    return timestamp
  }

  /**
   * Format timestamp to short format
   */
  const formatTimeShort = (timestamp: string): string => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString('en-US', { hour12: false })
  }

  /**
   * Check if log is error level
   */
  const isError = (log: Log): boolean => {
    return log.level === 'error'
  }

  /**
   * Check if log is warning level
   */
  const isWarning = (log: Log): boolean => {
    return log.level === 'warning'
  }

  /**
   * Get log level display text
   */
  const getLevelText = (level: string): string => {
    return level.charAt(0).toUpperCase() + level.slice(1)
  }

  /**
   * Get all available log levels
   */
  const getLogLevels = (): string[] => {
    return ['全部', '错误', '警告', '信息', '调试']
  }

  /**
   * Get time range options
   */
  const getTimeRanges = (): string[] => {
    return ['最近15分钟', '最近1小时', '最近24小时', '最近7天', '自定义']
  }

  /**
   * Highlight search query in text
   */
  const highlightSearch = (text: string, query: string): string => {
    if (!query) return text
    const regex = new RegExp(`(${query})`, 'gi')
    return text.replace(regex, '<mark>$1</mark>')
  }

  return {
    getLevelIcon,
    getLevelClass,
    getLevelColor,
    getLevelBgColor,
    formatTimestamp,
    formatTimeShort,
    isError,
    isWarning,
    getLevelText,
    getLogLevels,
    getTimeRanges,
    highlightSearch
  }
}
