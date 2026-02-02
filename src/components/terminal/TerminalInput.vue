<script setup lang="ts">
import { ref } from 'vue'
import { ChevronRight, Send } from 'lucide-vue-next'

interface Props {
  modelValue: string
  isProcessing: boolean
  canSubmit?: boolean
}

defineProps<Props>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
  submit: []
  focus: []
}>()

const inputElement = ref<HTMLInputElement>()

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Enter') {
    event.preventDefault()
    emit('submit')
  }
}

const handleFocus = () => {
  emit('focus')
}

const focus = () => {
  inputElement.value?.focus()
}

// Expose focus method to parent
defineExpose({
  focus
})
</script>

<template>
  <div class="terminal-input-area" @click="handleFocus">
    <div class="input-prompt">
      <ChevronRight :size="18" class="prompt-icon" />
    </div>
    <input
      ref="inputElement"
      :value="modelValue"
      type="text"
      class="terminal-input"
      placeholder="输入命令或自然语言问题..."
      @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      @keydown="handleKeydown"
      :disabled="isProcessing"
    />
    <button
      class="send-button"
      @click="emit('submit')"
      :disabled="!modelValue.trim() || isProcessing"
    >
      <Send :size="16" />
    </button>
  </div>
</template>

<style scoped>
.terminal-input-area {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-md) var(--spacing-lg);
  background-color: #2d2d2d;
  border-top: 1px solid #3e3e3e;
}

.input-prompt {
  display: flex;
  align-items: center;
  color: #8BC34A;
}

.prompt-icon {
  flex-shrink: 0;
}

.terminal-input {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  color: #ffffff;
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
  font-size: 13px;
  padding: var(--spacing-sm) 0;
}

.terminal-input::placeholder {
  color: #666666;
}

.terminal-input:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.send-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  background-color: #8BC34A;
  border-radius: var(--border-radius-sm);
  color: #1e1e1e;
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.send-button:hover:not(:disabled) {
  background-color: #3db89a;
}

.send-button:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}
</style>
