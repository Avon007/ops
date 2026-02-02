/**
 * Logs Store Tests
 * 日志 store 测试
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useLogsStore } from './logs'

describe('useLogsStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  describe('initial state', () => {
    it('should have logs on initialization', () => {
      const store = useLogsStore()

      expect(store.logs.length).toBeGreaterThan(0)
    })

    it('should have stats computed correctly', () => {
      const store = useLogsStore()

      expect(store.stats.total).toBe(store.logs.length)
      expect(store.stats.errors).toBe(store.logs.filter(l => l.level === 'error').length)
      expect(store.stats.warnings).toBe(store.logs.filter(l => l.level === 'warning').length)
      expect(store.stats.info).toBe(store.logs.filter(l => l.level === 'info').length)
    })

    it('should not have selected log initially', () => {
      const store = useLogsStore()

      expect(store.selectedLog).toBeNull()
    })
  })

  describe('actions', () => {
    it('should set selected log', () => {
      const store = useLogsStore()
      const logId = store.logs[0].id

      store.setSelectedLog(logId)

      expect(store.selectedLogId).toBe(logId)
      expect(store.selectedLog).toEqual(store.logs[0])
    })

    it('should get log by id', () => {
      const store = useLogsStore()
      const logId = store.logs[0].id

      const log = store.getLogById(logId)

      expect(log).toEqual(store.logs[0])
    })

    it('should return undefined for non-existent log', () => {
      const store = useLogsStore()

      const log = store.getLogById(999999)

      expect(log).toBeUndefined()
    })

    it('should add new log', () => {
      const store = useLogsStore()
      const initialCount = store.logs.length

      store.addLog({
        id: 999,
        timestamp: '2026-02-02 12:00:00',
        level: 'info',
        service: 'test-service',
        message: 'Test message',
        details: 'Test details'
      })

      expect(store.logs.length).toBe(initialCount + 1)
      expect(store.logs[0].id).toBe(999)
    })

    it('should clear all logs', () => {
      const store = useLogsStore()

      store.clearLogs()

      expect(store.logs.length).toBe(0)
    })

    it('should refresh logs asynchronously', async () => {
      const store = useLogsStore()

      const result = await store.refreshLogs()

      expect(result).toBe(true)
    })
  })

  describe('computed properties', () => {
    it('should return unique services', () => {
      const store = useLogsStore()

      expect(store.services.length).toBeGreaterThan(0)
      expect(store.services).toEqual(expect.arrayContaining(['api-service']))
    })
  })

  describe('filtering', () => {
    it('should filter logs by time range', () => {
      const store = useLogsStore()

      const recentLogs = store.filterByTimeRange('Last 24h')

      expect(recentLogs.length).toBeGreaterThan(0)
    })
  })

  describe('export', () => {
    it('should export logs as JSON', async () => {
      const store = useLogsStore()
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

      await store.exportLogs('json')

      expect(consoleSpy).toHaveBeenCalled()
      consoleSpy.mockRestore()
    })

    it('should export logs as CSV', async () => {
      const store = useLogsStore()
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

      await store.exportLogs('csv')

      expect(consoleSpy).toHaveBeenCalled()
      consoleSpy.mockRestore()
    })
  })
})
