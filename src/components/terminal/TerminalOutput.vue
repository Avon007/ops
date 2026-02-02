<script setup lang="ts">
import { Clock } from 'lucide-vue-next'
import type { TerminalMessage } from '@/composables'

interface Props {
  messages: TerminalMessage[]
  isProcessing: boolean
}

defineProps<Props>()

// 获取消息类型样式
const getMessageClass = (type: string): string => {
  switch (type) {
    case 'command':
      return 'terminal-message-command'
    case 'response':
      return 'terminal-message-response'
    case 'system':
      return 'terminal-message-system'
    case 'error':
      return 'terminal-message-error'
    default:
      return ''
  }
}

// 格式化命令内容（移除 v-html，使用纯文本）
const formatCommand = (content: string): string => {
  return `$ ${content}`
}
</script>

<template>
  <div class="terminal-output">
    <!-- Messages -->
    <div
      v-for="message in messages"
      :key="message.id"
      :class="['terminal-message', getMessageClass(message.type)]"
    >
      <!-- Message metadata -->
      <div v-if="message.type !== 'system'" class="message-meta">
        <Clock :size="12" />
        <span class="message-time">{{ message.timestamp }}</span>
        <span v-if="message.metadata?.duration" class="message-duration">
          ({{ message.metadata.duration }}ms)
        </span>
      </div>

      <!-- Message content -->
      <div class="message-content">
        <span v-if="message.type === 'command'" class="terminal-prompt">
          $
        </span>
        <span v-if="message.type === 'command'" class="command-text">
          {{ message.content }}
        </span>
        <span v-else class="message-text">{{ message.content }}</span>
      </div>
    </div>

    <!-- Processing indicator -->
    <div v-if="isProcessing" class="terminal-processing">
      <span class="processing-spinner"></span>
      <span>正在处理...</span>
    </div>
  </div>
</template>

<style scoped>
.terminal-output {
  flex: 1;
  overflow-y: auto;
  padding: var(--spacing-lg);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
}

.terminal-output::-webkit-scrollbar {
  width: 8px;
}

.terminal-output::-webkit-scrollbar-track {
  background: #2d2d2d;
}

.terminal-output::-webkit-scrollbar-thumb {
  background: #4e4e4e;
  border-radius: 4px;
}

.terminal-output::-webkit-scrollbar-thumb:hover {
  background: #5e5e5e;
}

.terminal-message {
  display: flex;
  flex-direction: column;
  gap: 4px;
  line-height: 1.6;
  white-space: pre-wrap;
  word-break: break-word;
}

.message-meta {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  font-size: 11px;
  color: #888888;
}

.message-time {
  font-family: var(--font-family);
}

.message-duration {
  color: #8BC34A;
}

.message-content {
  font-size: 13px;
}

.terminal-prompt {
  color: #8BC34A;
  font-weight: 700;
  margin-right: 8px;
}

.command-text {
  color: #ffffff;
  font-weight: 600;
}

.terminal-message-response .message-text {
  color: #cccccc;
}

.terminal-message-system .message-text {
  color: #569cd6;
  font-style: italic;
}

.terminal-message-error .message-text {
  color: #f48771;
}

.terminal-processing {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  color: #cccccc;
  font-size: 13px;
  padding: var(--spacing-sm) 0;
}

.processing-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid #4e4e4e;
  border-top-color: #8BC34A;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
