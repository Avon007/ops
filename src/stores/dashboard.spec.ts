/**
 * Dashboard Store Tests
 * 仪表板 store 测试
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useDashboardStore } from './dashboard'

describe('useDashboardStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('should have initial state', () => {
    const store = useDashboardStore()
    expect(store.metrics.length).toBeGreaterThan(0)
    expect(store.activities.length).toBeGreaterThan(0)
    expect(store.bannerVisible).toBe(true)
  })

  it('should compute latest activity', () => {
    const store = useDashboardStore()
    expect(store.latestActivity).toBeDefined()
    expect(store.latestActivity).toBe(store.activities[0])
  })

  it('should compute system status correctly', () => {
    const store = useDashboardStore()
    expect(['healthy', 'normal', 'degraded']).toContain(store.systemStatus)
  })

  it('should update metrics', () => {
    const store = useDashboardStore()
    const newMetrics = [...store.metrics]
    newMetrics[0].value = '999'
    store.updateMetrics(newMetrics)
    expect(store.metrics[0].value).toBe('999')
  })

  it('should add activity and maintain max 5', () => {
    const store = useDashboardStore()
    const initialCount = store.activities.length
    store.addActivity({
      id: 'test-act',
      title: 'Test',
      description: 'Test activity',
      type: 'info',
      badge: 'Test',
      timestamp: '刚刚'
    })
    expect(store.activities.length).toBe(Math.min(initialCount + 1, 5))
    expect(store.activities[0].id).toBe('test-act')
  })

  it('should hide and show banner', () => {
    const store = useDashboardStore()
    store.hideBanner()
    expect(store.bannerVisible).toBe(false)
    store.showBanner()
    expect(store.bannerVisible).toBe(true)
  })

  it('should refresh data asynchronously', async () => {
    const store = useDashboardStore()
    await store.refreshData()
    expect(store.metrics.length).toBeGreaterThan(0)
  })
})
