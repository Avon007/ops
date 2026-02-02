import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

/**
 * Log entry structure
 */
export interface Log {
  id: number
  timestamp: string
  level: 'error' | 'warning' | 'info' | 'debug'
  service: string
  message: string
  details: string
}

/**
 * Mock log data
 */
const MOCK_LOGS: Log[] = [
  {
    id: 1,
    timestamp: '2026-01-29 14:32:15',
    level: 'error',
    service: 'api-service',
    message: 'Connection timeout to database server',
    details: 'Error: ETIMEDOUT at Connection.connect (net.js:123:45)'
  },
  {
    id: 2,
    timestamp: '2026-01-29 14:31:42',
    level: 'warning',
    service: 'frontend-v2',
    message: 'High memory usage detected',
    details: 'Memory usage at 85%, consider scaling up'
  },
  {
    id: 3,
    timestamp: '2026-01-29 14:30:28',
    level: 'info',
    service: 'auth-service',
    message: 'User login successful',
    details: 'User ID: 12345, IP: 192.168.1.100'
  },
  {
    id: 4,
    timestamp: '2026-01-29 14:29:15',
    level: 'error',
    service: 'payment-gateway',
    message: 'Payment processing failed',
    details: 'Transaction ID: txn_789xyz, Error: Invalid card format'
  },
  {
    id: 5,
    timestamp: '2026-01-29 14:28:33',
    level: 'debug',
    service: 'api-service',
    message: 'API request received',
    details: 'GET /api/v1/users?page=1&limit=10'
  },
  {
    id: 6,
    timestamp: '2026-01-29 14:27:21',
    level: 'info',
    service: 'deployment-service',
    message: 'Deployment completed successfully',
    details: 'frontend-v2.4.1 deployed to production'
  },
  {
    id: 7,
    timestamp: '2026-01-29 14:26:18',
    level: 'warning',
    service: 'cache-service',
    message: 'Cache miss rate increasing',
    details: 'Current miss rate: 45%, threshold: 40%'
  },
  {
    id: 8,
    timestamp: '2026-01-29 14:25:05',
    level: 'info',
    service: 'background-worker',
    message: 'Job completed',
    details: 'Report generation completed in 2.3s'
  },
  {
    id: 9,
    timestamp: '2026-01-29 14:24:12',
    level: 'error',
    service: 'email-service',
    message: 'Failed to send email',
    details: 'SMTP Error: Connection refused'
  },
  {
    id: 10,
    timestamp: '2026-01-29 14:23:45',
    level: 'debug',
    service: 'api-service',
    message: 'Database query executed',
    details: 'SELECT * FROM users WHERE active = true (23ms)'
  }
]

/**
 * Logs store - manages application logs
 */
export const useLogsStore = defineStore('logs', () => {
  // State
  const logs = ref<Log[]>([...MOCK_LOGS])
  const selectedLogId = ref<number | null>(null)
  const autoRefresh = ref(false)
  const refreshInterval = ref(30000) // 30 seconds

  // Computed
  const selectedLog = computed(() =>
    logs.value.find(l => l.id === selectedLogId.value) || null
  )

  const stats = computed(() => ({
    total: logs.value.length,
    errors: logs.value.filter(l => l.level === 'error').length,
    warnings: logs.value.filter(l => l.level === 'warning').length,
    info: logs.value.filter(l => l.level === 'info').length,
    debug: logs.value.filter(l => l.level === 'debug').length
  }))

  const services = computed(() => {
    const uniqueServices = new Set(logs.value.map(l => l.service))
    return Array.from(uniqueServices).sort()
  })

  // Actions
  const setSelectedLog = (id: number | null) => {
    selectedLogId.value = id
  }

  const getLogById = (id: number): Log | undefined => {
    return logs.value.find(l => l.id === id)
  }

  const addLog = (log: Log) => {
    logs.value.unshift(log)
  }

  const clearLogs = () => {
    logs.value = []
  }

  const refreshLogs = async (): Promise<boolean> => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('Refreshing logs...')
        resolve(true)
      }, 500)
    })
  }

  const exportLogs = async (format: 'json' | 'csv' = 'json'): Promise<void> => {
    // Simulate export
    console.log(`Exporting logs as ${format}...`)

    const data = format === 'json'
      ? JSON.stringify(logs.value, null, 2)
      : logs.value.map(l =>
          [l.timestamp, l.level, l.service, l.message, l.details].join(',')
        ).join('\n')

    // In real app, create a download link
    console.log('Export data:', data.substring(0, 100) + '...')
  }

  const filterByTimeRange = (timeRange: string): Log[] => {
    // Simulate time-based filtering
    const now = new Date()
    const cutoffMap: Record<string, number> = {
      'Last 15m': 15 * 60 * 1000,
      'Last 1h': 60 * 60 * 1000,
      'Last 24h': 24 * 60 * 60 * 1000,
      'Last 7d': 7 * 24 * 60 * 60 * 1000
    }

    const cutoff = cutoffMap[timeRange]
    if (!cutoff) return logs.value

    const cutoffDate = new Date(now.getTime() - cutoff)
    return logs.value.filter(log => new Date(log.timestamp) >= cutoffDate)
  }

  return {
    // State
    logs,
    selectedLogId,
    autoRefresh,
    refreshInterval,

    // Computed
    selectedLog,
    stats,
    services,

    // Actions
    setSelectedLog,
    getLogById,
    addLog,
    clearLogs,
    refreshLogs,
    exportLogs,
    filterByTimeRange
  }
})
