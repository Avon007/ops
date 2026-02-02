import { ref, computed, type ComputedRef } from 'vue'
import type { Alert } from '@/stores/alerts'

/**
 * Composable for filtering alerts
 * @param alertsFn Function that returns the current alerts array
 */
export function useAlertFilter(alertsFn: () => Alert[]) {
  // Filter state
  const alertLevels = ['All', 'Critical', 'High', 'Medium', 'Low'] as const
  const selectedLevel = ref<typeof alertLevels[number]>('All')
  const selectedStatus = ref<'All' | 'Active' | 'Resolved'>('All')
  const searchQuery = ref('')

  // Computed
  const filteredAlerts: ComputedRef<Alert[]> = computed(() => {
    return alertsFn().filter(alert => {
      const matchesLevel = selectedLevel.value === 'All' || alert.level === selectedLevel.value.toLowerCase()
      const matchesStatus = selectedStatus.value === 'All' || alert.status === selectedStatus.value.toLowerCase()
      const matchesSearch = searchQuery.value === '' ||
        alert.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        alert.service.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        alert.message.toLowerCase().includes(searchQuery.value.toLowerCase())

      return matchesLevel && matchesStatus && matchesSearch
    })
  })

  const hasActiveFilters = computed(() => {
    return selectedLevel.value !== 'All' ||
           selectedStatus.value !== 'All' ||
           searchQuery.value !== ''
  })

  // Actions
  const clearFilters = () => {
    selectedLevel.value = 'All'
    selectedStatus.value = 'All'
    searchQuery.value = ''
  }

  return {
    // Options
    alertLevels,

    // State
    selectedLevel,
    selectedStatus,
    searchQuery,

    // Computed
    filteredAlerts,
    hasActiveFilters,

    // Actions
    clearFilters
  }
}
