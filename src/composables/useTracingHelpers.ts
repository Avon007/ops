import type { Component } from 'vue'
import { CheckCircle, XCircle, AlertTriangle } from 'lucide-vue-next'

/**
 * Composable for tracing helper functions
 */
export function useTracingHelpers() {
  /**
   * Get the icon component for a given status
   */
  const getStatusIcon = (status: string): Component => {
    const icons = {
      success: CheckCircle,
      error: XCircle,
      timeout: AlertTriangle
    }
    return icons[status as keyof typeof icons] || CheckCircle
  }

  /**
   * Get the CSS color class for a given status
   */
  const getStatusColor = (status: string): string => {
    const colors = {
      success: 'status-success',
      error: 'status-error',
      timeout: 'status-warning'
    }
    return colors[status as keyof typeof colors] || colors.success
  }

  /**
   * Get the CSS background class for a given status
   */
  const getStatusBg = (status: string): string => {
    const colors = {
      success: 'status-bg-success',
      error: 'status-bg-error',
      timeout: 'status-bg-warning'
    }
    return colors[status as keyof typeof colors] || colors.success
  }

  /**
   * Format duration in milliseconds to human-readable string
   */
  const formatDuration = (ms: number): string => {
    if (ms < 1000) return `${ms}ms`
    if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`
    return `${(ms / 1000).toFixed(0)}s`
  }

  /**
   * Format timestamp to localized string
   */
  const formatTime = (timestamp: string): string => {
    return new Date(timestamp).toLocaleString('zh-CN')
  }

  /**
   * Format timestamp to short time (HH:mm:ss)
   */
  const formatTimeShort = (timestamp: string): string => {
    return new Date(timestamp).toLocaleTimeString('zh-CN')
  }

  /**
   * Get trace card CSS class based on status
   */
  const getTraceCardClass = (status: string): string => {
    return `trace-${status}`
  }

  /**
   * Check if trace is successful
   */
  const isTraceSuccessful = (status: string): boolean => {
    return status === 'success'
  }

  /**
   * Check if trace has errors
   */
  const isTraceError = (status: string): boolean => {
    return status === 'error' || status === 'timeout'
  }

  /**
   * Get span indentation level based on parentSpanId
   */
  const getSpanIndent = (parentSpanId: string | null): number => {
    return parentSpanId ? 20 : 0
  }

  return {
    getStatusIcon,
    getStatusColor,
    getStatusBg,
    formatDuration,
    formatTime,
    formatTimeShort,
    getTraceCardClass,
    isTraceSuccessful,
    isTraceError,
    getSpanIndent
  }
}
