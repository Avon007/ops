/**
 * Servers Store
 * 服务器状态管理
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface Server {
  id: number
  name: string
  ip: string
  environment: 'Production' | 'Staging' | 'Development'
  status: 'online' | 'warning' | 'offline'
  cpu: number
  memory: number
  disk: number
  uptime: string
  region: string
  services: string[]
  lastCheck: string
}

const MOCK_SERVERS: Server[] = [
  {
    id: 1,
    name: 'app-server-01',
    ip: '192.168.1.100',
    environment: 'Production',
    status: 'online',
    cpu: 45,
    memory: 62,
    disk: 78,
    uptime: '45d 12h 34m',
    region: 'US-East',
    services: ['api-service', 'web-frontend'],
    lastCheck: '2026-01-29 14:32:15'
  },
  {
    id: 2,
    name: 'app-server-02',
    ip: '192.168.1.101',
    environment: 'Production',
    status: 'online',
    cpu: 92,
    memory: 88,
    disk: 85,
    uptime: '45d 11h 22m',
    region: 'US-East',
    services: ['api-service', 'worker-01'],
    lastCheck: '2026-01-29 14:32:15'
  },
  {
    id: 3,
    name: 'db-server-01',
    ip: '192.168.1.200',
    environment: 'Production',
    status: 'online',
    cpu: 34,
    memory: 71,
    disk: 92,
    uptime: '60d 8h 15m',
    region: 'US-East',
    services: ['postgresql', 'redis'],
    lastCheck: '2026-01-29 14:32:15'
  },
  {
    id: 4,
    name: 'cache-server-01',
    ip: '192.168.1.150',
    environment: 'Staging',
    status: 'warning',
    cpu: 78,
    memory: 91,
    disk: 55,
    uptime: '30d 5h 42m',
    region: 'US-West',
    services: ['redis', 'memcached'],
    lastCheck: '2026-01-29 14:31:50'
  },
  {
    id: 5,
    name: 'app-server-03',
    ip: '192.168.1.102',
    environment: 'Staging',
    status: 'online',
    cpu: 23,
    memory: 45,
    disk: 42,
    uptime: '15d 3h 28m',
    region: 'US-West',
    services: ['api-service', 'web-frontend'],
    lastCheck: '2026-01-29 14:32:15'
  },
  {
    id: 6,
    name: 'worker-server-01',
    ip: '192.168.1.103',
    environment: 'Production',
    status: 'offline',
    cpu: 0,
    memory: 0,
    disk: 67,
    uptime: '0d 0h 0m',
    region: 'EU-West',
    services: ['background-worker', 'email-service'],
    lastCheck: '2026-01-29 14:20:00'
  },
  {
    id: 7,
    name: 'cdn-node-01',
    ip: '192.168.1.104',
    environment: 'Production',
    status: 'online',
    cpu: 56,
    memory: 68,
    disk: 34,
    uptime: '20d 18h 55m',
    region: 'Asia-Pacific',
    services: ['nginx', 'cdn-cache'],
    lastCheck: '2026-01-29 14:32:15'
  },
  {
    id: 8,
    name: 'monitoring-server',
    ip: '192.168.1.105',
    environment: 'Production',
    status: 'online',
    cpu: 28,
    memory: 52,
    disk: 61,
    uptime: '90d 4h 12m',
    region: 'US-East',
    services: ['prometheus', 'grafana'],
    lastCheck: '2026-01-29 14:32:15'
  }
]

export const useServersStore = defineStore('servers', () => {
  // State
  const servers = ref<Server[]>([...MOCK_SERVERS])
  const selectedServerId = ref<number | null>(null)

  // Getters
  const selectedServer = computed(() =>
    servers.value.find(s => s.id === selectedServerId.value) || null
  )

  const stats = computed(() => {
    return {
      total: servers.value.length,
      online: servers.value.filter(s => s.status === 'online').length,
      warning: servers.value.filter(s => s.status === 'warning').length,
      offline: servers.value.filter(s => s.status === 'offline').length
    }
  })

  const environments = computed(() => {
    const envs = new Set(servers.value.map(s => s.environment))
    return Array.from(envs)
  })

  // Actions
  const setSelectedServer = (server: Server | null) => {
    selectedServerId.value = server?.id || null
  }

  const getServerById = (id: number) => {
    return servers.value.find(s => s.id === id)
  }

  const updateServerStatus = (id: number, status: Server['status']) => {
    const server = getServerById(id)
    if (server) {
      server.status = status
      server.cpu = status === 'offline' ? 0 : server.cpu
      server.memory = status === 'offline' ? 0 : server.memory
    }
  }

  const refreshServer = (id: number) => {
    console.log('Refreshing server data:', id)
    // In real app, this would fetch fresh data
  }

  const restartServer = async (id: number): Promise<boolean> => {
    const server = getServerById(id)
    if (!server) return false

    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('Restarting server:', server.name)
        resolve(true)
      }, 500)
    })
  }

  const stopServer = async (id: number): Promise<boolean> => {
    const server = getServerById(id)
    if (!server) return false

    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('Stopping server:', server.name)
        resolve(true)
      }, 500)
    })
  }

  return {
    // State
    servers,
    selectedServerId,
    // Getters
    selectedServer,
    stats,
    environments,
    // Actions
    setSelectedServer,
    getServerById,
    updateServerStatus,
    refreshServer,
    restartServer,
    stopServer
  }
})
