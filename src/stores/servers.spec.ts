/**
 * Servers Store Tests
 * 服务器 store 测试
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useServersStore } from './servers'

describe('useServersStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('should have initial state with servers', () => {
    const store = useServersStore()
    expect(store.servers.length).toBeGreaterThan(0)
    expect(store.selectedServerId).toBeNull()
  })

  it('should compute stats correctly', () => {
    const store = useServersStore()
    expect(store.stats.total).toBe(store.servers.length)
    expect(store.stats.online).toBeGreaterThan(0)
    expect(store.stats.warning).toBeGreaterThanOrEqual(0)
    expect(store.stats.offline).toBeGreaterThanOrEqual(0)
  })

  it('should get unique environments', () => {
    const store = useServersStore()
    expect(store.environments).toContain('Production')
    expect(store.environments.length).toBeGreaterThan(0)
  })

  it('should set selected server', () => {
    const store = useServersStore()
    const server = store.servers[0]
    store.setSelectedServer(server)
    expect(store.selectedServerId).toBe(server.id)
    expect(store.selectedServer).toEqual(server)
  })

  it('should get server by id', () => {
    const store = useServersStore()
    const server = store.getServerById(1)
    expect(server).toBeDefined()
    expect(server?.id).toBe(1)
  })

  it('should update server status', () => {
    const store = useServersStore()
    store.updateServerStatus(1, 'offline')
    const server = store.getServerById(1)
    expect(server?.status).toBe('offline')
    expect(server?.cpu).toBe(0)
    expect(server?.memory).toBe(0)
  })

  it('should restart server asynchronously', async () => {
    const store = useServersStore()
    const result = await store.restartServer(1)
    expect(result).toBe(true)
  })

  it('should stop server asynchronously', async () => {
    const store = useServersStore()
    const result = await store.stopServer(1)
    expect(result).toBe(true)
  })
})
