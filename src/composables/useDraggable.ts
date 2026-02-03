/**
 * Draggable Composable
 * 拖拽功能 composable
 *
 * 提供 HTML5 拖拽功能，支持：
 * - 拖拽开始
 * - 拖拽结束
 * - 拖拽中
 * - 拖拽目标检测
 */

import { ref, computed } from 'vue'

export interface DragOptions {
  onDragStart?: (data: any) => void
  onDragEnd?: () => void
  onDrop?: (data: any) => void
  dragType?: string
  dragData?: any
}

export function useDraggable(options: DragOptions = {}) {
  // State
  const isDragging = ref(false)
  const dragOver = ref(false)

  // Computed
  const canDrop = computed(() => dragOver.value && !isDragging.value)

  // Methods
  const handleDragStart = (event: DragEvent) => {
    isDragging.value = true

    // 设置拖拽数据
    const data = JSON.stringify({
      type: options.dragType || 'draggable',
      data: options.dragData
    })

    if (event.dataTransfer) {
      event.dataTransfer.setData('application/json', data)
      event.dataTransfer.effectAllowed = 'move'
    }

    options.onDragStart?.(options.dragData)
  }

  const handleDragEnd = () => {
    isDragging.value = false
    dragOver.value = false
    options.onDragEnd?.()
  }

  const handleDragOver = (event: DragEvent) => {
    event.preventDefault()
    event.dataTransfer!.dropEffect = 'move'
    dragOver.value = true
  }

  const handleDragLeave = () => {
    dragOver.value = false
  }

  const handleDrop = (event: DragEvent) => {
    event.preventDefault()
    dragOver.value = false

    try {
      const data = event.dataTransfer?.getData('application/json')
      if (data) {
        const parsedData = JSON.parse(data)
        options.onDrop?.(parsedData)
      }
    } catch (error) {
      console.error('Failed to parse drop data:', error)
    }
  }

  return {
    // State
    isDragging,
    dragOver,
    canDrop,
    // Methods
    handleDragStart,
    handleDragEnd,
    handleDragOver,
    handleDragLeave,
    handleDrop
  }
}
