/**
 * Log Format Composable
 * 日志格式化和显示工具
 */

import type { SystemLog } from '@/types'

const LEVEL_COLORS = {
  INFO: 'text-blue-600 bg-blue-50 border-blue-200',
  WARN: 'text-yellow-600 bg-yellow-50 border-yellow-200',
  ERROR: 'text-red-600 bg-red-50 border-red-200',
  DEBUG: 'text-gray-600 bg-gray-50 border-gray-200'
} as const

const FORMAT_LABELS = {
  json: 'JSON',
  xml: 'XML',
  csv: 'CSV',
  custom: 'CUSTOM',
  syslog: 'SYSLOG'
} as const

export function useLogFormat() {
  /**
   * 获取日志级别颜色样式
   */
  const getLevelColor = (level: string): string => {
    return LEVEL_COLORS[level as keyof typeof LEVEL_COLORS] || LEVEL_COLORS.INFO
  }

  /**
   * 获取日志格式标签
   */
  const getFormatLabel = (format: string): string => {
    return FORMAT_LABELS[format as keyof typeof FORMAT_LABELS] || format.toUpperCase()
  }

  /**
   * 格式化日志内容用于显示
   */
  const formatLogContent = (log: SystemLog): string => {
    if (log.format === 'json') {
      try {
        const parsed = JSON.parse(log.raw)
        return JSON.stringify(parsed, null, 2)
      } catch {
        return log.raw
      }
    }
    return log.raw
  }

  /**
   * 格式化时间戳
   */
  const formatTimestamp = (timestamp: string): string => {
    return new Date(timestamp).toLocaleTimeString('zh-CN')
  }

  /**
   * 判断日志是否有详情字段
   */
  const hasDetails = (log: SystemLog): boolean => {
    return !!(log.parsed && Object.keys(log.parsed).length > 1)
  }

  return {
    getLevelColor,
    getFormatLabel,
    formatLogContent,
    formatTimestamp,
    hasDetails
  }
}
