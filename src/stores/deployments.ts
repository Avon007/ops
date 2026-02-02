import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

/**
 * Deployment data structure
 */
export interface Deployment {
  id: number
  name: string
  environment: 'Production' | 'Staging' | 'Development'
  status: 'success' | 'deploying' | 'failed'
  date: string
  duration: string
}

/**
 * Deployment metric structure
 */
export interface DeploymentMetric {
  label: string
  value: string
  change?: string
  status?: string
  trend?: 'up' | 'down'
}

/**
 * Mock deployment metrics data
 */
const MOCK_METRICS: DeploymentMetric[] = [
  {
    label: 'Total Deployments',
    value: '1,284',
    change: '+12% this month',
    trend: 'up'
  },
  {
    label: 'Active Deployments',
    value: '47',
    status: 'All systems operational'
  },
  {
    label: 'Success Rate',
    value: '98.5%',
    change: '+2.3% improvement',
    trend: 'up'
  },
  {
    label: 'Failed Deployments',
    value: '3',
    change: '-5 from last week',
    trend: 'down'
  }
]

/**
 * Mock deployment data
 */
const MOCK_DEPLOYMENTS: Deployment[] = [
  {
    id: 1,
    name: 'frontend-v2.4.1',
    environment: 'Production',
    status: 'success',
    date: 'Jan 29, 2026',
    duration: '2m 34s'
  },
  {
    id: 2,
    name: 'api-service-v3.1.0',
    environment: 'Staging',
    status: 'deploying',
    date: 'Jan 29, 2026',
    duration: '1m 12s'
  },
  {
    id: 3,
    name: 'backend-v1.8.5',
    environment: 'Production',
    status: 'success',
    date: 'Jan 28, 2026',
    duration: '3m 45s'
  },
  {
    id: 4,
    name: 'mobile-app-v2.0.3',
    environment: 'Development',
    status: 'failed',
    date: 'Jan 28, 2026',
    duration: '0m 45s'
  },
  {
    id: 5,
    name: 'auth-service-v4.2.1',
    environment: 'Production',
    status: 'success',
    date: 'Jan 27, 2026',
    duration: '1m 56s'
  }
]

/**
 * Deployments store - manages deployment data
 */
export const useDeploymentsStore = defineStore('deployments', () => {
  // State
  const metrics = ref<DeploymentMetric[]>([...MOCK_METRICS])
  const deployments = ref<Deployment[]>([...MOCK_DEPLOYMENTS])
  const currentPage = ref(1)
  const totalPages = 3

  // Computed
  const stats = computed(() => ({
    total: deployments.value.length,
    success: deployments.value.filter(d => d.status === 'success').length,
    deploying: deployments.value.filter(d => d.status === 'deploying').length,
    failed: deployments.value.filter(d => d.status === 'failed').length
  }))

  // Actions
  const getDeploymentById = (id: number): Deployment | undefined => {
    return deployments.value.find(d => d.id === id)
  }

  const createDeployment = async (deployment: Omit<Deployment, 'id'>): Promise<Deployment> => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const newDeployment: Deployment = {
          ...deployment,
          id: Date.now()
        }
        deployments.value.unshift(newDeployment)
        console.log('Creating deployment:', newDeployment.name)
        resolve(newDeployment)
      }, 500)
    })
  }

  const retryDeployment = async (id: number): Promise<boolean> => {
    const deployment = deployments.value.find(d => d.id === id)
    if (deployment) {
      // Simulate API call
      return new Promise((resolve) => {
        setTimeout(() => {
          console.log('Retrying deployment:', deployment.name)
          resolve(true)
        }, 300)
      })
    }
    return false
  }

  const rollbackDeployment = async (id: number): Promise<boolean> => {
    const deployment = deployments.value.find(d => d.id === id)
    if (deployment) {
      // Simulate API call
      return new Promise((resolve) => {
        setTimeout(() => {
          console.log('Rolling back deployment:', deployment.name)
          resolve(true)
        }, 300)
      })
    }
    return false
  }

  const updateDeploymentStatus = (id: number, status: Deployment['status']) => {
    const index = deployments.value.findIndex(d => d.id === id)
    if (index !== -1) {
      deployments.value[index].status = status
    }
  }

  const setCurrentPage = (page: number) => {
    currentPage.value = page
  }

  return {
    // State
    metrics,
    deployments,
    currentPage,
    totalPages,

    // Computed
    stats,

    // Actions
    getDeploymentById,
    createDeployment,
    retryDeployment,
    rollbackDeployment,
    updateDeploymentStatus,
    setCurrentPage
  }
})
