/**
 * Terminal State Composable
 * 终端状态管理
 */

import { ref, computed, watch, nextTick } from 'vue'

export interface TerminalMessage {
  id: string
  type: 'command' | 'response' | 'system' | 'error'
  content: string
  timestamp: string
  metadata?: {
    command?: string
    duration?: number
    analysisResult?: any
  }
}

const MAX_MESSAGES = 100

export function useTerminalState() {
  // State
  const messages = ref<TerminalMessage[]>([])
  const isProcessing = ref(false)
  const terminalRef = ref<HTMLElement>()
  const inputRef = ref<HTMLInputElement>()

  // Computed
  const messageCount = computed(() => messages.value.length)
  const hasMessages = computed(() => messages.value.length > 0)
  const lastMessage = computed(() => messages.value[messages.value.length - 1])
  const canProcess = computed(() => !isProcessing.value)

  // Methods
  const addMessage = (message: TerminalMessage) => {
    messages.value.push(message)

    // 限制消息数量
    if (messages.value.length > MAX_MESSAGES) {
      const removeCount = messages.value.length - MAX_MESSAGES
      messages.value = messages.value.slice(removeCount)
    }

    // 自动滚动到底部
    nextTick(() => scrollToBottom())
  }

  const addCommand = (command: string) => {
    const message: TerminalMessage = {
      id: `msg-${Date.now()}`,
      type: 'command',
      content: command,
      timestamp: new Date().toLocaleTimeString('zh-CN', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      })
    }
    addMessage(message)
  }

  const addResponse = (content: string, duration?: number) => {
    if (!content) return

    const message: TerminalMessage = {
      id: `msg-${Date.now()}`,
      type: 'response',
      content,
      timestamp: new Date().toLocaleTimeString('zh-CN', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      }),
      metadata: { duration }
    }
    addMessage(message)
  }

  const addSystemMessage = (content: string) => {
    const message: TerminalMessage = {
      id: `msg-${Date.now()}`,
      type: 'system',
      content,
      timestamp: new Date().toLocaleTimeString('zh-CN', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      })
    }
    addMessage(message)
  }

  const addError = (error: Error | string) => {
    const errorMessage = typeof error === 'string' ? error : error.message
    const message: TerminalMessage = {
      id: `msg-${Date.now()}`,
      type: 'error',
      content: `错误: ${errorMessage}`,
      timestamp: new Date().toLocaleTimeString('zh-CN', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      })
    }
    addMessage(message)
  }

  const clearMessages = () => {
    messages.value = []
  }

  const scrollToBottom = () => {
    if (terminalRef.value) {
      terminalRef.value.scrollTop = terminalRef.value.scrollHeight
    }
  }

  const focusInput = () => {
    inputRef.value?.focus()
  }

  const setProcessing = (processing: boolean) => {
    isProcessing.value = processing
    if (!processing) {
      nextTick(() => scrollToBottom())
    }
  }

  // Auto-scroll when messages change
  watch(
    () => messages.value.length,
    () => {
      nextTick(() => scrollToBottom())
    }
  )

  return {
    // State
    messages,
    isProcessing,
    terminalRef,
    inputRef,
    // Computed
    messageCount,
    hasMessages,
    lastMessage,
    canProcess,
    // Methods
    addMessage,
    addCommand,
    addResponse,
    addSystemMessage,
    addError,
    clearMessages,
    scrollToBottom,
    focusInput,
    setProcessing
  }
}
