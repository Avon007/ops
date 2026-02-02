/**
 * Chat State Composable
 * 对话框状态管理
 */

import { ref, watch, nextTick } from 'vue'

export function useChatState(initialOpen = false) {
  // State
  const isOpen = ref(initialOpen)
  const isMinimized = ref(false)

  // Refs
  const messagesContainer = ref<HTMLElement>()
  const inputRef = ref<HTMLInputElement>()

  // Methods
  const toggleChat = () => {
    isOpen.value = !isOpen.value
  }

  const toggleMinimize = () => {
    isMinimized.value = !isMinimized.value
  }

  const scrollToBottom = () => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  }

  const focusInput = () => {
    inputRef.value?.focus()
  }

  // Auto-focus when opened
  const onOpen = () => {
    nextTick(() => {
      focusInput()
      scrollToBottom()
    })
  }

  // Watch for open state changes
  watch(isOpen, (newVal) => {
    if (newVal) {
      onOpen()
    }
  })

  return {
    // State
    isOpen,
    isMinimized,
    // Refs
    messagesContainer,
    inputRef,
    // Methods
    toggleChat,
    toggleMinimize,
    scrollToBottom,
    focusInput,
    onOpen
  }
}
