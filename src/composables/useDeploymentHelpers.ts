import type { Deployment } from '@/stores/deployments'

/**
 * Composable for deployment helper functions
 */
export function useDeploymentHelpers() {
  /**
   * Get the CSS class for a given deployment status
   */
  const getStatusClass = (status: string): string => {
    switch (status) {
      case 'success':
        return 'status-success'
      case 'deploying':
        return 'status-deploying'
      case 'failed':
        return 'status-failed'
      default:
        return ''
    }
  }

  /**
   * Get the display text for a given status
   */
  const getStatusText = (status: string): string => {
    switch (status) {
      case 'success':
        return 'Success'
      case 'deploying':
        return 'Deploying'
      case 'failed':
        return 'Failed'
      default:
        return status
    }
  }

  /**
   * Get the color for a given status
   */
  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'success':
        return 'var(--status-success)'
      case 'deploying':
        return 'var(--text-main)'
      case 'failed':
        return 'var(--status-error)'
      default:
        return 'var(--text-gray)'
    }
  }

  /**
   * Check if deployment can be retried
   */
  const canRetry = (status: string): boolean => {
    return status === 'failed'
  }

  /**
   * Check if deployment can be rolled back
   */
  const canRollback = (status: string): boolean => {
    return status === 'success'
  }

  /**
   * Check if deployment is currently deploying
   */
  const isDeploying = (status: string): boolean => {
    return status === 'deploying'
  }

  /**
   * Format deployment duration for display
   */
  const formatDuration = (duration: string): string => {
    return duration
  }

  /**
   * Get environment badge color
   */
  const getEnvironmentColor = (environment: string): string => {
    switch (environment) {
      case 'Production':
        return 'var(--status-error)'
      case 'Staging':
        return 'var(--status-warning)'
      case 'Development':
        return 'var(--status-info)'
      default:
        return 'var(--text-gray)'
    }
  }

  /**
   * Get deployment name with version highlighted
   */
  const formatDeploymentName = (name: string): { name: string; version: string } => {
    const parts = name.split('-v')
    if (parts.length === 2) {
      return {
        name: parts[0],
        version: 'v' + parts[1]
      }
    }
    return {
      name: name,
      version: ''
    }
  }

  /**
   * Sort deployments by date (newest first)
   */
  const sortDeploymentsByDate = (deployments: Deployment[]): Deployment[] => {
    return [...deployments].sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime()
    })
  }

  /**
   * Filter deployments by status
   */
  const filterDeploymentsByStatus = (
    deployments: Deployment[],
    status: string
  ): Deployment[] => {
    if (status === 'All') return deployments
    return deployments.filter(d => d.status === status)
  }

  return {
    getStatusClass,
    getStatusText,
    getStatusColor,
    canRetry,
    canRollback,
    isDeploying,
    formatDuration,
    getEnvironmentColor,
    formatDeploymentName,
    sortDeploymentsByDate,
    filterDeploymentsByStatus
  }
}
