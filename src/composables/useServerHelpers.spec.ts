/**
 * useServerHelpers Composable Tests
 * 服务器辅助函数 composable 测试
 */

import { describe, it, expect } from 'vitest'
import { useServerHelpers } from './useServerHelpers'
import { CheckCircle, XCircle, AlertTriangle, Activity } from 'lucide-vue-next'

describe('useServerHelpers', () => {
  it('should return correct icon for each status', () => {
    const { getStatusIcon } = useServerHelpers()
    expect(getStatusIcon('online')).toBe(CheckCircle)
    expect(getStatusIcon('offline')).toBe(XCircle)
    expect(getStatusIcon('warning')).toBe(AlertTriangle)
    expect(getStatusIcon('unknown')).toBe(Activity)
  })

  it('should return correct status class', () => {
    const { getStatusClass } = useServerHelpers()
    expect(getStatusClass('online')).toBe('server-status-online')
    expect(getStatusClass('offline')).toBe('server-status-offline')
  })

  it('should return correct resource class', () => {
    const { getResourceClass } = useServerHelpers()
    expect(getResourceClass(95)).toBe('resource-critical')
    expect(getResourceClass(75)).toBe('resource-warning')
    expect(getResourceClass(50)).toBe('resource-normal')
  })

  it('should format server name correctly', () => {
    const { formatServerName } = useServerHelpers()
    expect(formatServerName('app-server-01')).toBe('App Server 01')
    expect(formatServerName('db-server')).toBe('Db Server')
  })

  it('should check if server is offline', () => {
    const { isServerOffline } = useServerHelpers()
    expect(isServerOffline('offline')).toBe(true)
    expect(isServerOffline('online')).toBe(false)
  })
})
