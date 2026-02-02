/**
 * Server Filter Composable
 * 服务器过滤逻辑
 */

import { ref, computed } from 'vue'
import type { Server } from '@/stores/servers'

export function useServerFilter(servers: () => Server[]) {
  // State
  const selectedStatus = ref<'All' | 'online' | 'warning' | 'offline'>('All')
  const selectedEnvironment = ref<'All' | 'Production' | 'Staging' | 'Development'>('All')
  const searchQuery = ref('')

  // Computed
  const filteredServers = computed(() => {
    return servers().filter(server => {
      const matchesStatus = selectedStatus.value === 'All' || server.status === selectedStatus.value
      const matchesEnvironment = selectedEnvironment.value === 'All' || server.environment === selectedEnvironment.value
      const matchesSearch = !searchQuery.value ||
        server.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        server.ip.includes(searchQuery.value) ||
        server.services.some(s => s.toLowerCase().includes(searchQuery.value.toLowerCase()))
      return matchesStatus && matchesEnvironment && matchesSearch
    })
  })

  const hasActiveFilters = computed(() => {
    return selectedStatus.value !== 'All' ||
           selectedEnvironment.value !== 'All' ||
           searchQuery.value !== ''
  })

  // Methods
  const clearFilters = () => {
    selectedStatus.value = 'All'
    selectedEnvironment.value = 'All'
    searchQuery.value = ''
  }

  return {
    // State
    selectedStatus,
    selectedEnvironment,
    searchQuery,
    // Computed
    filteredServers,
    hasActiveFilters,
    // Methods
    clearFilters
  }
}
