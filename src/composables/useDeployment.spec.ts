/**
 * useDeployment Composable Tests
 * 部署 composable 测试
 */

import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { useDeployment } from './useDeployment'
import type { Activity } from '@/types'

describe('useDeployment', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.runOnlyPendingTimers()
    vi.useRealTimers()
  })

  it('should have correct initial state', () => {
    const { showDeployModal, deployStatus, isDeploying, canExecuteDeploy } = useDeployment()
    expect(showDeployModal.value).toBe(false)
    expect(deployStatus.value).toBe('idle')
    expect(isDeploying.value).toBe(false)
    expect(canExecuteDeploy.value).toBe(true)
  })

  it('should open and close modal', () => {
    const { showDeployModal, openDeployModal, closeDeployModal } = useDeployment()
    openDeployModal()
    expect(showDeployModal.value).toBe(true)
    closeDeployModal()
    expect(showDeployModal.value).toBe(false)
  })

  it('should complete successful deployment', async () => {
    const addActivity = vi.fn()
    const onSuccess = vi.fn()
    const { deployStatus, deployMessage, executeDeploy } = useDeployment({ onSuccess })
    const deployPromise = executeDeploy(addActivity)
    expect(deployStatus.value).toBe('deploying')

    await vi.advanceTimersByTimeAsync(6500)
    await deployPromise

    expect(deployStatus.value).toBe('success')
    expect(addActivity).toHaveBeenCalled()
    expect(onSuccess).toHaveBeenCalledWith('部署成功！应用已上线。')
  })

  it('should not execute when already deploying', async () => {
    const addActivity = vi.fn()
    const { deployStatus, executeDeploy } = useDeployment()
    deployStatus.value = 'deploying'

    await executeDeploy(addActivity)

    expect(addActivity).not.toHaveBeenCalled()
  })
})
