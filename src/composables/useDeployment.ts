/**
 * Deployment Composable
 * 处理部署相关的逻辑
 */

import { ref, computed } from 'vue'
import type { Activity } from '@/types'

export type DeploymentStatus = 'idle' | 'deploying' | 'success' | 'error'

interface DeploymentOptions {
  onSuccess?: (message: string) => void
  onError?: (message: string) => void
}

export function useDeployment(options: DeploymentOptions = {}) {
  // State
  const showDeployModal = ref(false)
  const deployStatus = ref<DeploymentStatus>('idle')
  const deployMessage = ref('')

  // Computed
  const isDeploying = computed(() => deployStatus.value === 'deploying')
  const canExecuteDeploy = computed(() => deployStatus.value === 'idle')

  // Methods
  const openDeployModal = () => {
    showDeployModal.value = true
    deployStatus.value = 'idle'
    deployMessage.value = ''
  }

  const closeDeployModal = () => {
    showDeployModal.value = false
    deployStatus.value = 'idle'
    deployMessage.value = ''
  }

  const executeDeploy = async (addActivity?: (activity: Activity) => void) => {
    if (!canExecuteDeploy.value) return

    deployStatus.value = 'deploying'
    deployMessage.value = '正在准备部署...'

    try {
      // 模拟部署过程
      await new Promise(resolve => setTimeout(resolve, 2000))
      deployMessage.value = '正在部署应用...'

      await new Promise(resolve => setTimeout(resolve, 3000))
      deployMessage.value = '正在验证部署...'

      await new Promise(resolve => setTimeout(resolve, 1500))

      deployStatus.value = 'success'
      deployMessage.value = '部署成功！应用已上线。'

      // 添加活动记录
      if (addActivity) {
        addActivity({
          id: `act-${Date.now()}`,
          title: '部署成功',
          description: '应用新版本已成功部署到生产环境',
          type: 'success',
          badge: '部署',
          timestamp: '刚刚'
        })
      }

      // 调用成功回调
      if (options.onSuccess) {
        options.onSuccess(deployMessage.value)
      }
    } catch (error) {
      deployStatus.value = 'error'
      deployMessage.value = '部署失败，请检查日志并重试。'

      // 调用错误回调
      if (options.onError) {
        options.onError(deployMessage.value)
      }
    }
  }

  return {
    // State
    showDeployModal,
    deployStatus,
    deployMessage,
    // Computed
    isDeploying,
    canExecuteDeploy,
    // Methods
    openDeployModal,
    closeDeployModal,
    executeDeploy
  }
}
