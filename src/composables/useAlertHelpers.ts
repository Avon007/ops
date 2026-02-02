import type { Component } from 'vue'
import {
  AlertCircle,
  AlertTriangle,
  Bell,
  Info
} from 'lucide-vue-next'

/**
 * Composable for alert helper functions
 */
export function useAlertHelpers() {
  /**
   * Get the icon component for a given alert level
   */
  const getLevelIcon = (level: string): Component => {
    switch (level) {
      case 'critical':
        return AlertCircle
      case 'high':
        return AlertTriangle
      case 'medium':
        return Bell
      case 'low':
        return Info
      default:
        return Bell
    }
  }

  /**
   * Get the CSS class for a given alert level
   */
  const getLevelClass = (level: string): string => {
    return `alert-level-${level}`
  }

  /**
   * Get the CSS class for a given status
   */
  const getStatusBadgeClass = (status: string): string => {
    return status === 'active' ? 'status-active' : 'status-resolved'
  }

  /**
   * Get color for a given alert level
   */
  const getLevelColor = (level: string): string => {
    switch (level) {
      case 'critical':
        return 'var(--status-error)'
      case 'high':
        return 'var(--status-warning)'
      case 'medium':
        return 'var(--status-info)'
      case 'low':
        return 'var(--text-light)'
      default:
        return 'var(--text-gray)'
    }
  }

  /**
   * Format alert title for display
   */
  const formatAlertTitle = (alert: { title: string; service: string }): string => {
    return `${alert.title} (${alert.service})`
  }

  /**
   * Check if alert is critical or high priority
   */
  const isHighPriorityAlert = (level: string): boolean => {
    return level === 'critical' || level === 'high'
  }

  /**
   * Check if alert is active
   */
  const isAlertActive = (status: string): boolean => {
    return status === 'active'
  }

  /**
   * Format timestamp for display
   */
  const formatTimestamp = (timestamp: string): string => {
    // Already formatted, but can be enhanced if needed
    return timestamp
  }

  return {
    getLevelIcon,
    getLevelClass,
    getStatusBadgeClass,
    getLevelColor,
    formatAlertTitle,
    isHighPriorityAlert,
    isAlertActive,
    formatTimestamp
  }
}
