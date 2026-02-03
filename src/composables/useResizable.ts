/**
 * Resizable Composable
 * 调整大小功能 composable
 *
 * 提供组件调整大小功能，支持：
 * - 调整宽度和高度
 * - 最小/最大尺寸限制
 * - 调整手柄位置（8个方向）
 */

import { ref, computed, onUnmounted } from 'vue'

export interface ResizeOptions {
  minWidth?: number
  maxWidth?: number
  minHeight?: number
  maxHeight?: number
  onResize?: (size: { width: number; height: number }) => void
  onResizeStart?: () => void
  onResizeEnd?: () => void
}

export function useResizable(options: ResizeOptions = {}) {
  // State
  const isResizing = ref(false)
  const resizeDirection = ref<string | null>(null)
  const elementRef = ref<HTMLElement | null>(null)

  // 默认限制
  const minWidth = options.minWidth ?? 200
  const maxWidth = options.maxWidth ?? 1200
  const minHeight = options.minHeight ?? 200
  const maxHeight = options.maxHeight ?? 1200

  // Computed
  const showHandles = computed(() => !!elementRef.value)

  // Methods
  const startResize = (direction: string, event: MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()

    isResizing.value = true
    resizeDirection.value = direction

    const startX = event.clientX
    const startY = event.clientY
    const element = elementRef.value

    if (!element) return

    const startWidth = element.offsetWidth
    const startHeight = element.offsetHeight

    options.onResizeStart?.()

    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing.value || !element) return

      const deltaX = e.clientX - startX
      const deltaY = e.clientY - startY

      let newWidth = startWidth
      let newHeight = startHeight

      // 根据方向调整尺寸
      if (direction.includes('e')) {
        newWidth = Math.min(maxWidth, Math.max(minWidth, startWidth + deltaX))
      }
      if (direction.includes('w')) {
        newWidth = Math.min(maxWidth, Math.max(minWidth, startWidth - deltaX))
      }
      if (direction.includes('s')) {
        newHeight = Math.min(maxHeight, Math.max(minHeight, startHeight + deltaY))
      }
      if (direction.includes('n')) {
        newHeight = Math.min(maxHeight, Math.max(minHeight, startHeight - deltaY))
      }

      element.style.width = `${newWidth}px`
      element.style.height = `${newHeight}px`

      options.onResize?.({ width: newWidth, height: newHeight })
    }

    const handleMouseUp = () => {
      isResizing.value = false
      resizeDirection.value = null
      options.onResizeEnd?.()

      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }

  // 清理
  const cleanup = () => {
    isResizing.value = false
    resizeDirection.value = null
  }

  // 自动清理
  onUnmounted(() => {
    cleanup()
  })

  return {
    // State
    isResizing,
    resizeDirection,
    showHandles,
    elementRef,
    // Methods
    startResize,
    cleanup
  }
}
