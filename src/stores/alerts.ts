import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

/**
 * Alert data structure
 */
export interface Alert {
  id: number
  timestamp: string
  level: 'critical' | 'high' | 'medium' | 'low'
  service: string
  title: string
  message: string
  source: string
  status: 'active' | 'resolved'
  acknowledged: boolean
  affectedUsers: number
}

/**
 * Mock alert data
 */
const MOCK_ALERTS: Alert[] = [
  {
    id: 1,
    timestamp: '2026-01-29 14:32:15',
    level: 'critical',
    service: 'api-service',
    title: '数据库连接失败',
    message: '无法连接到主数据库服务器',
    source: 'app-server-01',
    status: 'active',
    acknowledged: false,
    affectedUsers: 1250
  },
  {
    id: 2,
    timestamp: '2026-01-29 14:28:42',
    level: 'high',
    service: 'payment-gateway',
    title: '支付处理延迟',
    message: '支付交易处理时间超过 5 秒',
    source: 'payment-worker-02',
    status: 'active',
    acknowledged: true,
    affectedUsers: 45
  },
  {
    id: 3,
    timestamp: '2026-01-29 14:25:18',
    level: 'medium',
    service: 'cache-service',
    title: '缓存内存过高',
    message: 'Redis 内存使用率达到 85%',
    source: 'redis-01',
    status: 'active',
    acknowledged: false,
    affectedUsers: 0
  },
  {
    id: 4,
    timestamp: '2026-01-29 14:20:33',
    level: 'low',
    service: 'background-worker',
    title: '任务队列积压',
    message: '后台任务队列有 150 个待处理任务',
    source: 'worker-03',
    status: 'active',
    acknowledged: true,
    affectedUsers: 0
  },
  {
    id: 5,
    timestamp: '2026-01-29 14:15:21',
    level: 'critical',
    service: 'auth-service',
    title: '认证失败率过高',
    message: '认证失败率超过 10%',
    source: 'auth-01',
    status: 'resolved',
    acknowledged: true,
    affectedUsers: 89
  },
  {
    id: 6,
    timestamp: '2026-01-29 14:10:05',
    level: 'high',
    service: 'frontend-v2',
    title: '响应时间过长',
    message: '/api/users 接口响应时间超过 2 秒',
    source: 'cdn-node-03',
    status: 'resolved',
    acknowledged: true,
    affectedUsers: 320
  },
  {
    id: 7,
    timestamp: '2026-01-29 14:05:18',
    level: 'medium',
    service: 'email-service',
    title: '邮件发送延迟',
    message: '邮件队列处理延迟 2 分钟',
    source: 'email-worker-01',
    status: 'active',
    acknowledged: false,
    affectedUsers: 12
  },
  {
    id: 8,
    timestamp: '2026-01-29 14:00:12',
    level: 'low',
    service: 'monitoring-service',
    title: '磁盘空间警告',
    message: '服务器磁盘使用率达到 75%',
    source: 'app-server-02',
    status: 'active',
    acknowledged: false,
    affectedUsers: 0
  }
]

export const useAlertsStore = defineStore('alerts', () => {
  // State
  const alerts = ref<Alert[]>([...MOCK_ALERTS])
  const selectedAlertId = ref<number | null>(null)

  // Computed
  const selectedAlert = computed(() =>
    alerts.value.find(a => a.id === selectedAlertId.value) || null
  )

  const stats = computed(() => ({
    total: alerts.value.filter(a => a.status === 'active').length,
    critical: alerts.value.filter(a => a.level === 'critical' && a.status === 'active').length,
    high: alerts.value.filter(a => a.level === 'high' && a.status === 'active').length,
    resolved: alerts.value.filter(a => a.status === 'resolved').length
  }))

  // Actions
  const setSelectedAlert = (id: number | null) => {
    selectedAlertId.value = id
  }

  const getAlertById = (id: number): Alert | undefined => {
    return alerts.value.find(a => a.id === id)
  }

  const acknowledgeAlert = (id: number): boolean => {
    const alert = alerts.value.find(a => a.id === id)
    if (alert) {
      alert.acknowledged = true
      console.log(`Alert acknowledged: ${alert.title}`)
      return true
    }
    return false
  }

  const resolveAlert = async (id: number): Promise<boolean> => {
    const alert = alerts.value.find(a => a.id === id)
    if (alert) {
      // Simulate API call
      return new Promise((resolve) => {
        setTimeout(() => {
          alert.status = 'resolved'
          console.log(`Alert resolved: ${alert.title}`)
          resolve(true)
        }, 300)
      })
    }
    return false
  }

  const addAlert = (alert: Alert) => {
    alerts.value.unshift(alert)
  }

  const updateAlert = (id: number, updates: Partial<Alert>) => {
    const index = alerts.value.findIndex(a => a.id === id)
    if (index !== -1) {
      alerts.value[index] = { ...alerts.value[index], ...updates }
    }
  }

  return {
    // State
    alerts,
    selectedAlertId,

    // Computed
    selectedAlert,
    stats,

    // Actions
    setSelectedAlert,
    getAlertById,
    acknowledgeAlert,
    resolveAlert,
    addAlert,
    updateAlert
  }
})
