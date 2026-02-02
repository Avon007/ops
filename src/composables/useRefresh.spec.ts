/**
 * useRefresh Composable Tests
 * 数据刷新 composable 测试
 */

import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { useRefresh } from './useRefresh'
import type { Metric, Activity } from '@/types'

describe('useRefresh', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.runOnlyPendingTimers()
    vi.useRealTimers()
  })

  it('should have correct initial state', () => {
    const { isRefreshing, canRefresh } = useRefresh()
    expect(isRefreshing.value).toBe(false)
    expect(canRefresh.value).toBe(true)
  })

  it('should refresh data successfully', async () => {
    const onUpdate = vi.fn()
    const { isRefreshing, handleRefresh } = useRefresh()

    const metrics: Metric[] = [
      { label: 'Test', value: '100', change: 5, changeType: 'up', status: 'positive' }
    ]
    const activities: Activity[] = []

    const refreshPromise = handleRefresh(metrics, activities, onUpdate)
    expect(isRefreshing.value).toBe(true)

    await vi.advanceTimersByTimeAsync(1500)
    await refreshPromise

    expect(isRefreshing.value).toBe(false)
    expect(onUpdate).toHaveBeenCalled()
  })

  it('should not refresh when already refreshing', async () => {
    const onUpdate = vi.fn()
    const { isRefreshing, handleRefresh } = useRefresh()

    isRefreshing.value = true
    await handleRefresh([], [], onUpdate)

    expect(onUpdate).not.toHaveBeenCalled()
  })
})
