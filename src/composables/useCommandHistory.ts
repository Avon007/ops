/**
 * Command History Composable
 * 命令历史记录管理
 */

import { ref, computed } from 'vue'

export function useCommandHistory(maxSize = 100) {
  const history = ref<string[]>([])
  const index = ref(-1)

  // Computed
  const canNavigateBack = computed(() => index.value > 0)
  const canNavigateForward = computed(() => index.value < history.value.length - 1)
  const currentCommand = computed(() => {
    if (index.value >= 0 && index.value < history.value.length) {
      return history.value[index.value]
    }
    return ''
  })

  // Methods
  const add = (command: string) => {
    if (!command.trim()) return

    history.value.push(command.trim())

    // 限制历史记录大小
    if (history.value.length > maxSize) {
      history.value.shift()
    }

    // 重置索引到最后
    index.value = history.value.length
  }

  const navigateBack = () => {
    if (canNavigateBack.value) {
      index.value--
    }
    return currentCommand.value
  }

  const navigateForward = () => {
    if (index.value < history.value.length - 1) {
      index.value++
      return currentCommand.value
    }
    // 到达末尾，返回空字符串
    index.value = history.value.length
    return ''
  }

  const reset = () => {
    history.value = []
    index.value = -1
  }

  const resetIndex = () => {
    index.value = history.value.length
  }

  return {
    // State
    history,
    index,
    // Computed
    canNavigateBack,
    canNavigateForward,
    currentCommand,
    // Methods
    add,
    navigateBack,
    navigateForward,
    reset,
    resetIndex
  }
}
