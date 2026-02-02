/**
 * Log Export Composable
 * 日志导出功能
 */

import type { SystemLog } from '@/types'

export function useLogExport() {
  /**
   * 导出日志为文件
   */
  const exportLogs = (logs: SystemLog[], filename?: string) => {
    const data = logs.map(log => log.raw).join('\n')
    const blob = new Blob([data], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename || `logs-${new Date().toISOString()}.log`
    a.click()
    URL.revokeObjectURL(url)
  }

  /**
   * 导出日志为 JSON
   */
  const exportLogsAsJson = (logs: SystemLog[], filename?: string) => {
    const data = JSON.stringify(logs, null, 2)
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename || `logs-${new Date().toISOString()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  /**
   * 导出过滤后的日志
   */
  const exportFilteredLogs = (
    allLogs: SystemLog[],
    filterFn: (log: SystemLog) => boolean,
    filename?: string
  ) => {
    const filtered = allLogs.filter(filterFn)
    exportLogs(filtered, filename)
  }

  return {
    exportLogs,
    exportLogsAsJson,
    exportFilteredLogs
  }
}
