/**
 * Error Handler Composable
 * 统一错误处理工具
 *
 * 提供统一的错误处理、日志记录和用户通知功能
 */

import { ref, computed } from 'vue'

export interface ErrorContext {
  component?: string
  action?: string
  details?: Record<string, any>
}

export interface AppError {
  id: string
  message: string
  code?: string
  severity: 'info' | 'warning' | 'error' | 'critical'
  context?: ErrorContext
  timestamp: Date
  stack?: string
  userNotified: boolean
}

const errorHistory = ref<AppError[]>([])
const currentError = ref<AppError | null>(null)
const isErrorDialogOpen = ref(false)

const MAX_ERROR_HISTORY = 100

export function useErrorHandler() {
  /**
   * 创建新的错误对象
   */
  const createError = (
    message: string,
    severity: AppError['severity'] = 'error',
    code?: string,
    context?: ErrorContext,
    error?: Error
  ): AppError => {
    return {
      id: `err-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      message,
      code,
      severity,
      context,
      timestamp: new Date(),
      stack: error?.stack,
      userNotified: false
    }
  }

  /**
   * 处理错误
   */
  const handleError = (
    error: Error | string,
    context?: ErrorContext,
    severity: AppError['severity'] = 'error'
  ): AppError => {
    const message = typeof error === 'string' ? error : error.message
    const code = typeof error === 'string' ? undefined : (error as any).code

    const appError = createError(message, severity, code, context, typeof error === 'string' ? undefined : error)

    // 添加到历史记录
    addToHistory(appError)

    // 根据严重程度决定是否显示对话框
    if (severity === 'error' || severity === 'critical') {
      showErrorDialog(appError)
    }

    // 记录到控制台
    logError(appError)

    return appError
  }

  /**
   * 添加到错误历史
   */
  const addToHistory = (error: AppError) => {
    errorHistory.value.unshift(error)

    // 限制历史记录数量
    if (errorHistory.value.length > MAX_ERROR_HISTORY) {
      errorHistory.value = errorHistory.value.slice(0, MAX_ERROR_HISTORY)
    }
  }

  /**
   * 显示错误对话框
   */
  const showErrorDialog = (error: AppError) => {
    currentError.value = error
    isErrorDialogOpen.value = true
    error.userNotified = true
  }

  /**
   * 关闭错误对话框
   */
  const closeErrorDialog = () => {
    isErrorDialogOpen.value = false
    currentError.value = null
  }

  /**
   * 记录错误到控制台
   */
  const logError = (error: AppError) => {
    const logMessage = `[${error.severity.toUpperCase()}] ${error.message}`
    const context = error.context ? ` | Context: ${JSON.stringify(error.context)}` : ''

    switch (error.severity) {
      case 'critical':
      case 'error':
        console.error(logMessage + context, error.stack || '')
        break
      case 'warning':
        console.warn(logMessage + context)
        break
      case 'info':
      default:
        console.info(logMessage + context)
        break
    }
  }

  /**
   * 异步操作包装器
   * 自动处理异步操作中的错误
   */
  const withErrorHandling = async <T>(
    asyncFn: () => Promise<T>,
    context?: ErrorContext,
    fallback?: T
  ): Promise<T | undefined> => {
    try {
      return await asyncFn()
    } catch (error) {
      handleError(error as Error, context)
      return fallback
    }
  }

  /**
   * 验证错误处理
   */
  const handleValidationError = (field: string, value: any, rule: string, context?: ErrorContext) => {
    const message = `Validation failed for field "${field}": ${rule}`
    return handleError(message, { ...context, field, value }, 'warning')
  }

  /**
   * 网络错误处理
   */
  const handleNetworkError = (url: string, method: string, error?: Error) => {
    const message = `Network request failed: ${method} ${url}`
    return handleError(message, { action: 'network_request', details: { url, method } }, 'error', error)
  }

  /**
   * API 错误处理
   */
  const handleApiError = (endpoint: string, statusCode: number, message: string) => {
    const severity: AppError['severity'] = statusCode >= 500 ? 'critical' : 'error'
    return handleError(
      message,
      { action: 'api_call', details: { endpoint, statusCode } },
      severity
    )
  }

  /**
   * 权限错误处理
   */
  const handleAuthError = (action: string, requiredPermission: string) => {
    const message = `Permission denied: "${action}" requires "${requiredPermission}"`
    return handleError(message, { action, details: { requiredPermission } }, 'warning')
  }

  /**
   * 清除错误历史
   */
  const clearErrorHistory = () => {
    errorHistory.value = []
  }

  /**
   * 清除当前错误
   */
  const clearCurrentError = () => {
    currentError.value = null
    isErrorDialogOpen.value = false
  }

  // Computed
  const errors = computed(() => errorHistory.value)
  const hasErrors = computed(() => errorHistory.value.length > 0)
  const errorCount = computed(() => errorHistory.value.length)
  const criticalErrors = computed(() =>
    errorHistory.value.filter(e => e.severity === 'critical')
  )
  const hasCriticalErrors = computed(() => criticalErrors.value.length > 0)

  return {
    // State
    currentError,
    errors,
    hasErrors,
    errorCount,
    criticalErrors,
    hasCriticalErrors,
    isErrorDialogOpen,

    // Methods
    handleError,
    createError,
    closeErrorDialog,
    clearErrorHistory,
    clearCurrentError,
    withErrorHandling,
    handleValidationError,
    handleNetworkError,
    handleApiError,
    handleAuthError
  }
}
