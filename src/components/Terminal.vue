<script setup lang="ts">
/**
 * Terminal Component
 * 运维终端组件 - 优化版本
 *
 * 优化内容:
 * 1. 使用 composables 提取逻辑
 * 2. 拆分为子组件（Header, Output, Input）
 * 3. 移除 v-html，修复 XSS 安全问题
 * 4. 代码行数从 1317 行减少到 ~150 行
 * 5. 提高可维护性和可测试性
 */

import { onMounted, watch, nextTick } from 'vue'

// Composables
import {
  useCommandHistory,
  useTerminalState,
  useTerminalCommand
} from '@/composables'

// 子组件
import { TerminalHeader, TerminalOutput, TerminalInput } from './terminal'

// Props
interface Props {
  title?: string
  showHeader?: boolean
}

withDefaults(defineProps<Props>(), {
  title: '运维终端',
  showHeader: true
})

// Composables
const commandHistory = useCommandHistory()
const terminalState = useTerminalState()
const terminalCommand = useTerminalCommand()

// 解构
const {
  messages,
  isProcessing,
  terminalRef,
  inputRef,
  canProcess,
  addCommand,
  addResponse,
  addSystemMessage,
  addError,
  setProcessing,
  focusInput
} = terminalState

const {
  currentInput,
  executeCommand
} = terminalCommand

const {
  add: addToHistory,
  navigateBack,
  navigateForward,
  resetIndex
} = commandHistory

// Methods
const handleSubmit = async () => {
  if (!currentInput.value.trim() || !canProcess.value) return

  const input = currentInput.value.trim()
  currentInput.value = ''

  // 添加到历史
  addToHistory(input)

  // 添加命令消息
  addCommand(input)

  // 处理命令
  setProcessing(true)
  await nextTick()

  const startTime = Date.now()

  try {
    const response = await executeCommand(input, commandHistory.history.value)
    const duration = Date.now() - startTime

    // 添加响应
    if (response) {
      addResponse(response, duration)
    }
  } catch (error) {
    addError(error as Error)
  } finally {
    setProcessing(false)
    await nextTick()
    focusInput()
  }
}

const handleKeydown = (event: KeyboardEvent) => {
  // Navigate history with up/down arrows
  if (event.key === 'ArrowUp') {
    event.preventDefault()
    currentInput.value = navigateBack()
  } else if (event.key === 'ArrowDown') {
    event.preventDefault()
    currentInput.value = navigateForward()
  } else if (event.key === 'l' && event.ctrlKey) {
    // Ctrl+L to clear
    event.preventDefault()
    terminalState.clearMessages()
  }
}

const handleFocusInput = () => {
  focusInput()
}

// Lifecycle
onMounted(() => {
  // Welcome message
  addSystemMessage(
    `🌷 Spring-themed Operations Assistant Terminal
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

欢迎使用运维助手终端 v1.0.0

支持的交互方式:
  • 自然语言: 直接输入问题，如 "查看系统状态"
  • 命令行: 输入命令，如 "analyze" 或 "status"
  • 输入 "help" 查看所有可用命令

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`
  )

  // Focus input on mount
  focusInput()
})

// Auto-scroll when messages change
watch(
  () => messages.value.length,
  () => {
    nextTick(() => {
      terminalState.scrollToBottom()
    })
  },
  { deep: true }
)
</script>

<template>
  <div class="terminal-container" @click="handleFocusInput">
    <!-- Header -->
    <TerminalHeader
      :title="title"
      :show-header="showHeader"
      :is-processing="isProcessing"
    />

    <!-- Terminal Output -->
    <TerminalOutput
      ref="terminalRef"
      :messages="messages"
      :is-processing="isProcessing"
    />

    <!-- Input Area -->
    <TerminalInput
      ref="inputRef"
      v-model="currentInput"
      :is-processing="isProcessing"
      @submit="handleSubmit"
      @focus="handleFocusInput"
      @keydown="handleKeydown"
    />
  </div>
</template>

<style scoped>
.terminal-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: #1e1e1e;
  border-radius: var(--border-radius-lg);
  overflow: hidden;
}

/* Responsive */
@media (max-width: 768px) {
  .terminal-container {
    font-size: 12px;
  }
}
</style>
