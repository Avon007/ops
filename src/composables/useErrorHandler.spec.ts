/**
 * useErrorHandler Composable Tests
 * 错误处理 composable 测试
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { useErrorHandler } from './useErrorHandler'

describe('useErrorHandler', () => {
  beforeEach(() => {
    // Clear error history before each test
    const { clearErrorHistory } = useErrorHandler()
    clearErrorHistory()
  })

  describe('handleError', () => {
    it('should create an error from string', () => {
      const { handleError, errors } = useErrorHandler()
      const error = handleError('Test error')

      expect(error).toBeDefined()
      expect(error.message).toBe('Test error')
      expect(error.severity).toBe('error')
      expect(errors.value).toHaveLength(1)
    })

    it('should create an error from Error object', () => {
      const { handleError, errors } = useErrorHandler()
      const originalError = new Error('Original error')
      const error = handleError(originalError)

      expect(error.message).toBe('Original error')
      expect(error.stack).toBe(originalError.stack)
      expect(errors.value).toHaveLength(1)
    })

    it('should create error with custom severity', () => {
      const { handleError } = useErrorHandler()
      const error = handleError('Warning message', {}, 'warning')

      expect(error.severity).toBe('warning')
    })

    it('should create error with context', () => {
      const { handleError } = useErrorHandler()
      const context = {
        component: 'TestComponent',
        action: 'testAction',
        details: { key: 'value' }
      }
      const error = handleError('Test error', context)

      expect(error.context).toEqual(context)
    })
  })

  describe('error history', () => {
    it('should track error count', () => {
      const { handleError, errorCount, hasErrors } = useErrorHandler()

      expect(errorCount.value).toBe(0)
      expect(hasErrors.value).toBe(false)

      handleError('Error 1')
      expect(errorCount.value).toBe(1)
      expect(hasErrors.value).toBe(true)

      handleError('Error 2')
      expect(errorCount.value).toBe(2)
    })

    it('should limit error history to MAX_ERROR_HISTORY', () => {
      const { handleError, errors } = useErrorHandler()

      // Add more errors than MAX_ERROR_HISTORY (100)
      for (let i = 0; i < 150; i++) {
        handleError(`Error ${i}`)
      }

      expect(errors.value.length).toBeLessThanOrEqual(100)
    })
  })

  describe('specialized error handlers', () => {
    it('should handle validation errors', () => {
      const { handleValidationError } = useErrorHandler()
      const error = handleValidationError('email', 'invalid', 'required')

      expect(error.message).toContain('email')
      expect(error.severity).toBe('warning')
    })

    it('should handle network errors', () => {
      const { handleNetworkError } = useErrorHandler()
      const error = handleNetworkError('/api/test', 'GET')

      expect(error.message).toContain('Network request failed')
      expect(error.context?.details).toEqual({
        url: '/api/test',
        method: 'GET'
      })
    })

    it('should handle API errors', () => {
      const { handleApiError } = useErrorHandler()
      const error = handleApiError('/api/test', 500, 'Internal Server Error')

      expect(error.message).toBe('Internal Server Error')
      expect(error.severity).toBe('critical')
    })

    it('should handle auth errors', () => {
      const { handleAuthError } = useErrorHandler()
      const error = handleAuthError('deleteUser', 'admin')

      expect(error.message).toContain('Permission denied')
      expect(error.context?.details).toEqual({
        requiredPermission: 'admin'
      })
    })
  })

  describe('async error handling', () => {
    it('should handle successful async operations', async () => {
      const { withErrorHandling } = useErrorHandler()
      const asyncFn = async () => 'success'

      const result = await withErrorHandling(asyncFn)

      expect(result).toBe('success')
    })

    it('should handle failed async operations', async () => {
      const { withErrorHandling, errors } = useErrorHandler()
      const asyncFn = async () => {
        throw new Error('Async error')
      }

      const result = await withErrorHandling(asyncFn)

      expect(result).toBeUndefined()
      expect(errors.value).toHaveLength(1)
      expect(errors.value[0].message).toBe('Async error')
    })

    it('should return fallback value on error', async () => {
      const { withErrorHandling } = useErrorHandler()
      const asyncFn = async () => {
        throw new Error('Error')
      }

      const result = await withErrorHandling(asyncFn, {}, 'fallback')

      expect(result).toBe('fallback')
    })
  })

  describe('error dialog', () => {
    it('should show error dialog for critical errors', () => {
      const { handleError, isErrorDialogOpen } = useErrorHandler()

      handleError('Critical error', {}, 'critical')

      expect(isErrorDialogOpen.value).toBe(true)
    })

    it('should show error dialog for errors', () => {
      const { handleError, isErrorDialogOpen } = useErrorHandler()

      handleError('Regular error')

      expect(isErrorDialogOpen.value).toBe(true)
    })

    it('should not show dialog for warnings', () => {
      const { handleError, isErrorDialogOpen } = useErrorHandler()

      handleError('Warning message', {}, 'warning')

      expect(isErrorDialogOpen.value).toBe(false)
    })

    it('should close error dialog', () => {
      const { handleError, closeErrorDialog, isErrorDialogOpen } = useErrorHandler()

      handleError('Error')
      expect(isErrorDialogOpen.value).toBe(true)

      closeErrorDialog()
      expect(isErrorDialogOpen.value).toBe(false)
    })
  })
})
