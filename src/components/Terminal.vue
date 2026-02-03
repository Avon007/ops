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
 * 6. 支持调整大小
 */

import { computed, onMounted, ref, watch, nextTick } from 'vue'

// Composables
import {
  useCommandHistory,
  useTerminalState,
  useTerminalCommand,
  useResizable
} from '@/composables'

// 子组件
import { TerminalHeader, TerminalOutput, TerminalInput } from './terminal'

// Props
interface Props {
  title?: string
  showHeader?: boolean
  resizable?: boolean
  initialHeight?: number
  minHeight?: number
  maxHeight?: number
  onResizeStart?: () => void
  onResizeEnd?: () => void
}

withDefaults(defineProps<Props>(), {
  title: '运维终端',
  showHeader: true,
  resizable: false,
  initialHeight: 400,
  minHeight: 200,
  maxHeight: 800
})

// Emits
const emit = defineEmits<{
  (e: 'resize', size: { width: number; height: number }): void
}>()

// State
const terminalHeight = ref(400)
const terminalContainerRef = ref<HTMLElement | null>(null)

// Composables
const commandHistory = useCommandHistory()
const terminalState = useTerminalState()
const terminalCommand = useTerminalCommand()

const { isResizing, elementRef, startResize } = useResizable({
  minHeight: 200,
  maxHeight: 800,
  onResizeStart: () => {
    // Callback handled in template
  },
  onResize: (size) => {
    terminalHeight.value = size.height
    emit('resize', size)
  },
  onResizeEnd: () => {
    // Callback handled in template
  }
})

// 同步 elementRef
watch(terminalContainerRef, (newRef) => {
  if (newRef) {
    elementRef.value = newRef
  }
})

// Computed
const containerStyle = computed(() => ({
  height: `${terminalHeight.value}px`
}))

const containerClass = computed(() => ({
  'is-resizable': false,
  'is-resizing': isResizing.value
}))

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

const handleResizeStart = (event: MouseEvent) => {
  startResize('s', event)
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
  <div
    ref="terminalContainerRef"
    class="terminal-container"
    :class="containerClass"
    :style="containerStyle"
    @click="handleFocusInput"
  >
    <!-- 调整大小手柄 -->
    <div
      v-if="resizable"
      class="resize-handle resize-handle-bottom"
      title="拖拽调整高度"
      @mousedown="handleResizeStart"
    ></div>

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
  background-color: #1e1e1e;
  border-radius: var(--border-radius-lg);
  overflow: hidden;
  position: relative;
  transition: box-shadow 0.2s ease;
}

.terminal-container.is-resizable {
  cursor: default;
}

.terminal-container.is-resizing {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
}

.resize-handle {
  position: absolute;
  left: 0;
  right: 0;
  height: 6px;
  cursor: row-resize;
  background-color: transparent;
  transition: background-color 0.2s ease;
  z-index: 10;
}

.resize-handle-bottom {
  bottom: 0;
  border-radius: 0 0 var(--border-radius-lg) var(--border-radius-lg);
}

.terminal-container.is-resizable:hover .resize-handle-bottom {
  background-color: rgba(255, 255, 255, 0.1);
}

.resize-handle-bottom:hover {
  background-color: var(--primary-green) !important;
}

/* Responsive */
@media (max-width: 768px) {
  .terminal-container {
    font-size: 12px;
  }
}
</style>
