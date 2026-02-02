/**
 * Refresh Composable
 * 处理数据刷新逻辑
 */

import { ref, computed } from 'vue'
import type { Metric, Activity } from '@/types'

export function useRefresh() {
  // State
  const isRefreshing = ref(false)

  // Computed
  const canRefresh = computed(() => !isRefreshing.value)

  // Methods
  const handleRefresh = async (
    metrics: Metric[],
    activities: Activity[],
    onUpdate?: (newMetrics: Metric[], newActivities: Activity[]) => void
  ) => {
    if (!canRefresh.value) return

    isRefreshing.value = true

    try {
      // 模拟数据刷新
      await new Promise(resolve => setTimeout(resolve, 1500))

      // 更新指标数据（添加随机变化）
      const updatedMetrics = metrics.map(metric => ({
        ...metric,
        value: metric.value,
        change: Math.floor(Math.random() * 20) - 10
      }))

      // 更新活动列表
      const newActivity: Activity = {
        id: `act-${Date.now()}`,
        title: '数据已刷新',
        description: '系统数据更新成功',
        type: 'success' as const,
        badge: '系统',
        timestamp: '刚刚'
      }

      const updatedActivities = [newActivity, ...activities].slice(0, 5)

      // 调用更新回调
      if (onUpdate) {
        onUpdate(updatedMetrics, updatedActivities)
      }

      console.log('✅ 数据刷新成功')
    } catch (error) {
      console.error('❌ 刷新失败:', error)
      throw error
    } finally {
      isRefreshing.value = false
    }
  }

  return {
    // State
    isRefreshing,
    // Computed
    canRefresh,
    // Methods
    handleRefresh
  }
}
