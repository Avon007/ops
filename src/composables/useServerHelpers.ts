/**
 * Server Helpers Composable
 * 服务器辅助函数
 */

import { CheckCircle, XCircle, AlertTriangle, Activity } from 'lucide-vue-next'
import type { Component } from 'vue'

export function useServerHelpers() {
  /**
   * 获取状态图标组件
   */
  const getStatusIcon = (status: string): Component => {
    switch (status) {
      case 'online':
        return CheckCircle
      case 'warning':
        return AlertTriangle
      case 'offline':
        return XCircle
      default:
        return Activity
    }
  }

  /**
   * 获取状态样式类
   */
  const getStatusClass = (status: string): string => {
    return `server-status-${status}`
  }

  /**
   * 获取资源使用率样式类
   */
  const getResourceClass = (value: number): string => {
    if (value >= 90) return 'resource-critical'
    if (value >= 70) return 'resource-warning'
    return 'resource-normal'
  }

  /**
   * 获取状态颜色
   */
  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'online':
        return 'var(--status-success)'
      case 'warning':
        return 'var(--status-warning)'
      case 'offline':
        return 'var(--status-error)'
      default:
        return 'var(--text-gray)'
    }
  }

  /**
   * 判断服务器是否离线
   */
  const isServerOffline = (status: string): boolean => {
    return status === 'offline'
  }

  /**
   * 格式化服务器名称
   */
  const formatServerName = (name: string): string => {
    return name.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
  }

  return {
    getStatusIcon,
    getStatusClass,
    getResourceClass,
    getStatusColor,
    isServerOffline,
    formatServerName
  }
}
