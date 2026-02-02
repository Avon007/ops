<script setup lang="ts">
import { Terminal as TerminalIcon } from 'lucide-vue-next'

interface Props {
  title?: string
  showHeader?: boolean
  isProcessing?: boolean
}

withDefaults(defineProps<Props>(), {
  title: '运维终端',
  showHeader: true,
  isProcessing: false
})
</script>

<template>
  <div v-if="showHeader" class="terminal-header">
    <div class="header-left">
      <TerminalIcon :size="18" />
      <span class="header-title">{{ title }}</span>
    </div>
    <div class="header-right">
      <div class="status-indicator" :class="{ active: !isProcessing }">
        <span class="status-dot"></span>
        <span class="status-text">{{ isProcessing ? '处理中...' : '就绪' }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.terminal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-md) var(--spacing-lg);
  background-color: #2d2d2d;
  border-bottom: 1px solid #3e3e3e;
}

.header-left {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  color: #cccccc;
}

.header-title {
  font-size: 14px;
  font-weight: 600;
  color: #ffffff;
}

.header-right {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.status-indicator {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: 4px 12px;
  background-color: #3e3e3e;
  border-radius: var(--border-radius-sm);
  font-size: 12px;
  color: #888888;
}

.status-indicator.active {
  color: #8BC34A;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #888888;
}

.status-indicator.active .status-dot {
  background-color: #8BC34A;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}
</style>
