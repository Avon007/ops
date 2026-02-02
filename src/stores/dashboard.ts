/**
 * Dashboard Store
 * Dashboard 状态管理
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Metric, Activity } from '@/types'
import { mockMetrics, mockActivities } from '@/mock/data'

export const useDashboardStore = defineStore('dashboard', () => {
  // State
  const metrics = ref<Metric[]>([...mockMetrics])
  const activities = ref<Activity[]>([...mockActivities])
  const bannerVisible = ref(true)

  // Getters
  const latestActivity = computed(() => activities.value[0])
  const activityCount = computed(() => activities.value.length)
  const systemStatus = computed(() => {
    const warningMetrics = metrics.value.filter(m => m.status === 'warning')
    const positiveMetrics = metrics.value.filter(m => m.status === 'positive')

    if (warningMetrics.length > 0) return 'degraded'
    if (positiveMetrics.length === metrics.value.length) return 'healthy'
    return 'normal'
  })

  // Actions
  const updateMetrics = (newMetrics: Metric[]) => {
    metrics.value = newMetrics
  }

  const updateActivities = (newActivities: Activity[]) => {
    activities.value = newActivities
  }

  const addActivity = (activity: Activity) => {
    activities.value = [activity, ...activities.value].slice(0, 5)
  }

  const hideBanner = () => {
    bannerVisible.value = false
  }

  const showBanner = () => {
    bannerVisible.value = true
  }

  const refreshData = async () => {
    // 模拟数据刷新
    await new Promise(resolve => setTimeout(resolve, 1000))

    // 更新指标
    metrics.value = metrics.value.map(metric => ({
      ...metric,
      value: metric.value,
      change: Math.floor(Math.random() * 20) - 10
    }))
  }

  const reset = () => {
    metrics.value = [...mockMetrics]
    activities.value = [...mockActivities]
    bannerVisible.value = true
  }

  return {
    // State
    metrics,
    activities,
    bannerVisible,
    // Getters
    latestActivity,
    activityCount,
    systemStatus,
    // Actions
    updateMetrics,
    updateActivities,
    addActivity,
    hideBanner,
    showBanner,
    refreshData,
    reset
  }
})
