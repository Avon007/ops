/**
 * Log Filter Composable
 * 日志过滤逻辑
 */

import { ref, computed } from 'vue'
import type { SystemLog } from '@/types'

export type LogLevel = 'ALL' | 'INFO' | 'WARN' | 'ERROR' | 'DEBUG'

export function useLogFilter(logs: () => SystemLog[]) {
  // State
  const searchText = ref('')
  const selectedLevel = ref<LogLevel>('ALL')
  const selectedSystem = ref<string>('ALL')

  // Computed
  const filteredLogs = computed(() => {
    return logs().filter(log => {
      const matchesSearch = !searchText.value ||
        log.raw.toLowerCase().includes(searchText.value.toLowerCase()) ||
        log.parsed?.message?.toLowerCase().includes(searchText.value.toLowerCase())

      const matchesLevel = selectedLevel.value === 'ALL' || log.level === selectedLevel.value
      const matchesSystem = selectedSystem.value === 'ALL' || log.systemId === selectedSystem.value

      return matchesSearch && matchesLevel && matchesSystem
    })
  })

  const systems = computed(() => {
    const uniqueSystems = [...new Set(logs().map(log => log.systemId))]
    return uniqueSystems.sort()
  })

  const logStats = computed(() => {
    const allLogs = logs()
    return {
      total: allLogs.length,
      info: allLogs.filter(l => l.level === 'INFO').length,
      warn: allLogs.filter(l => l.level === 'WARN').length,
      error: allLogs.filter(l => l.level === 'ERROR').length,
      debug: allLogs.filter(l => l.level === 'DEBUG').length
    }
  })

  // Methods
  const clearFilters = () => {
    searchText.value = ''
    selectedLevel.value = 'ALL'
    selectedSystem.value = 'ALL'
  }

  return {
    // State
    searchText,
    selectedLevel,
    selectedSystem,
    // Computed
    filteredLogs,
    systems,
    logStats,
    // Methods
    clearFilters
  }
}
