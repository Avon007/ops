<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { Bot, X, Send, Minimize2, Maximize2, Sparkles, AlertCircle } from 'lucide-vue-next'
import { useClawdBotStore } from '@/stores/clawdBot'
import { useChatState, useChatFormat } from '@/composables'

// Props
interface Props {
  modelValue?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

// Store & Composables
const clawdBotStore = useClawdBotStore()
const { isOpen, isMinimized, messagesContainer, inputRef, toggleChat, toggleMinimize, scrollToBottom, focusInput } = useChatState(props.modelValue)
const { splitParagraphs } = useChatFormat()

// Local state
const inputMessage = ref('')

// Watch for prop changes
watch(() => props.modelValue, (newVal) => {
  isOpen.value = newVal
})

watch(isOpen, (newVal) => {
  emit('update:modelValue', newVal)
})

// Methods
const sendMessage = async () => {
  if (!inputMessage.value.trim() || clawdBotStore.isLoading) return

  const userInput = inputMessage.value
  inputMessage.value = ''

  // Send message via store
  await clawdBotStore.sendMessage(userInput)

  // Scroll to bottom
  scrollToBottom()
}

const handleSuggestion = (suggestion: string) => {
  inputMessage.value = suggestion
  sendMessage()
}

const clearChat = () => {
  clawdBotStore.clearChat()
}

// Lifecycle
onMounted(async () => {
  await clawdBotStore.init()
  if (isOpen.value) {
    focusInput()
  }
})
</script>

<template>
  <!-- Floating Button (when closed) -->
  <div v-if="!isOpen" class="clawdbot-fab" @click="toggleChat" title="打开 ClawdBot">
    <Bot :size="28" :stroke-width="2" />
    <span class="fab-badge">AI</span>
  </div>

  <!-- Chat Panel -->
  <div v-else class="clawdbot-panel" :class="{ minimized: isMinimized }">
    <!-- Header -->
    <div class="clawdbot-header">
      <div class="header-left">
        <div class="bot-avatar">
          <Bot :size="20" :stroke-width="2.5" />
        </div>
        <div class="header-info">
          <div class="header-title">
            <Sparkles :size="14" class="sparkle-icon" />
            ClawdBot
          </div>
          <div class="header-status" :class="{ available: clawdBotStore.isApiAvailable }">
            <span class="status-dot"></span>
            {{ clawdBotStore.isApiAvailable ? 'AI 在线' : '演示模式' }}
          </div>
        </div>
      </div>
      <div class="header-actions">
        <button class="icon-btn" @click="clearChat" title="清空对话">
          <AlertCircle :size="16" />
        </button>
        <button class="icon-btn" @click="toggleMinimize" :title="isMinimized ? '展开' : '最小化'">
          <Minimize2 v-if="!isMinimized" :size="16" />
          <Maximize2 v-else :size="16" />
        </button>
        <button class="icon-btn close-btn" @click="toggleChat" title="关闭">
          <X :size="18" />
        </button>
      </div>
    </div>

    <!-- Messages Area (hidden when minimized) -->
    <div v-show="!isMinimized" ref="messagesContainer" class="clawdbot-messages">
      <!-- Messages -->
      <div
        v-for="msg in clawdBotStore.messages"
        :key="msg.id"
        class="message"
        :class="msg.role"
      >
        <div v-if="msg.role === 'assistant'" class="msg-avatar">
          <Bot :size="16" :stroke-width="2.5" />
        </div>
        <div class="msg-content">
          <div class="msg-bubble" :class="msg.role">
            <!-- Safe message rendering without v-html -->
            <div class="msg-text">
              <p v-for="(paragraph, idx) in splitParagraphs(msg.content)" :key="idx">
                {{ paragraph }}
              </p>
            </div>
            <div class="msg-time">{{ msg.timestamp }}</div>
          </div>
        </div>
      </div>

      <!-- Loading Indicator -->
      <div v-if="clawdBotStore.isLoading" class="message assistant">
        <div class="msg-avatar">
          <Bot :size="16" :stroke-width="2.5" />
        </div>
        <div class="msg-content">
          <div class="msg-bubble assistant">
            <div class="typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>
      </div>

      <!-- Suggestions (only show at start) -->
      <div v-if="clawdBotStore.showSuggestions" class="suggestions">
        <button
          v-for="suggestion in clawdBotStore.suggestions"
          :key="suggestion"
          class="suggestion-btn"
          @click="handleSuggestion(suggestion)"
        >
          {{ suggestion }}
        </button>
      </div>
    </div>

    <!-- Input Area (hidden when minimized) -->
    <div v-show="!isMinimized" class="clawdbot-input">
      <input
        ref="inputRef"
        v-model="inputMessage"
        type="text"
        class="chat-input"
        placeholder="输入你的问题..."
        @keyup.enter="sendMessage"
      />
      <button
        class="send-btn"
        :disabled="clawdBotStore.isLoading || !inputMessage.trim()"
        @click="sendMessage"
      >
        <Send :size="18" :stroke-width="2.5" />
      </button>
    </div>
  </div>
</template>

<style scoped>
/* Floating Action Button */
.clawdbot-fab {
  position: fixed;
  right: 24px;
  bottom: 24px;
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 20px rgba(16, 185, 129, 0.4);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 1000;
  color: white;
  animation: pulse-glow 2s infinite;
}

.clawdbot-fab:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 30px rgba(16, 185, 129, 0.6);
}

.fab-badge {
  position: absolute;
  top: -2px;
  right: -2px;
  background: #f59e0b;
  color: white;
  font-size: 10px;
  font-weight: 700;
  padding: 2px 6px;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(245, 158, 11, 0.5);
}

@keyframes pulse-glow {
  0%, 100% {
    box-shadow: 0 4px 20px rgba(16, 185, 129, 0.4);
  }
  50% {
    box-shadow: 0 4px 30px rgba(16, 185, 129, 0.6);
  }
}

/* Chat Panel */
.clawdbot-panel {
  position: fixed;
  right: 24px;
  bottom: 24px;
  width: 400px;
  height: 600px;
  background: var(--bg-white);
  border: 1px solid var(--border-light);
  border-radius: 16px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  z-index: 1000;
  overflow: hidden;
  transition: all 0.3s ease;
}

.clawdbot-panel.minimized {
  height: 64px;
}

/* Header */
.clawdbot-header {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  padding: 16px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: none;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.bot-avatar {
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.header-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.header-title {
  font-size: 16px;
  font-weight: 700;
  color: white;
  display: flex;
  align-items: center;
  gap: 6px;
}

.sparkle-icon {
  color: #fbbf24;
  animation: sparkle 1.5s ease-in-out infinite;
}

@keyframes sparkle {
  0%, 100% {
    transform: scale(1) rotate(0deg);
  }
  50% {
    transform: scale(1.2) rotate(10deg);
  }
}

.header-status {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  gap: 6px;
}

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #fbbf24;
  animation: blink 2s infinite;
}

.header-status.available .status-dot {
  background: #34d399;
}

@keyframes blink {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.header-actions {
  display: flex;
  gap: 8px;
}

.icon-btn {
  width: 32px;
  height: 32px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: none;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: white;
  transition: all 0.2s ease;
}

.icon-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

.icon-btn.close-btn:hover {
  background: rgba(239, 68, 68, 0.3);
}

/* Messages */
.clawdbot-messages {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  background: var(--bg-body);
}

.message {
  display: flex;
  gap: 12px;
}

.message.user {
  flex-direction: row-reverse;
}

.msg-avatar {
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
}

.msg-content {
  max-width: 280px;
  display: flex;
  flex-direction: column;
}

.msg-bubble {
  padding: 12px 16px;
  border-radius: 16px;
  position: relative;
}

.msg-bubble.assistant {
  background: var(--bg-white);
  border: 1px solid var(--border-light);
  border-top-left-radius: 4px;
}

.msg-bubble.user {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  border-top-right-radius: 4px;
}

.msg-text {
  font-size: 14px;
  line-height: 1.6;
  word-wrap: break-word;
}

.msg-text p {
  margin: 0 0 8px 0;
}

.msg-text p:last-child {
  margin-bottom: 0;
}

.msg-time {
  font-size: 10px;
  margin-top: 6px;
  opacity: 0.6;
}

.msg-bubble.user .msg-time {
  color: rgba(255, 255, 255, 0.8);
}

/* Typing Indicator */
.typing-indicator {
  display: flex;
  gap: 4px;
  padding: 4px 0;
}

.typing-indicator span {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--text-light);
  animation: typing 1.4s infinite;
}

.typing-indicator span:nth-child(2) {
  animation-delay: 0.2s;
}

.typing-indicator span:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes typing {
  0%, 100% {
    transform: translateY(0);
    opacity: 0.5;
  }
  50% {
    transform: translateY(-4px);
    opacity: 1;
  }
}

/* Suggestions */
.suggestions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 8px;
}

.suggestion-btn {
  padding: 8px 14px;
  background: var(--bg-white);
  border: 1px solid var(--border-light);
  border-radius: 20px;
  font-size: 12px;
  color: var(--text-main);
  cursor: pointer;
  transition: all 0.2s ease;
}

.suggestion-btn:hover {
  background: var(--primary-green);
  color: white;
  border-color: var(--primary-green);
  transform: translateY(-1px);
}

/* Input Area */
.clawdbot-input {
  padding: 16px 20px;
  background: var(--bg-white);
  border-top: 1px solid var(--border-light);
  display: flex;
  gap: 12px;
  align-items: center;
}

.chat-input {
  flex: 1;
  height: 44px;
  padding: 0 16px;
  background: var(--bg-body);
  border: 1px solid var(--border-light);
  border-radius: 22px;
  font-size: 14px;
  color: var(--text-main);
  transition: all 0.2s ease;
}

.chat-input:focus {
  outline: none;
  border-color: var(--primary-green);
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
}

.send-btn {
  width: 44px;
  height: 44px;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  border: none;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: white;
  transition: all 0.2s ease;
}

.send-btn:hover:not(:disabled) {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);
}

.send-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Scrollbar */
.clawdbot-messages::-webkit-scrollbar {
  width: 6px;
}

.clawdbot-messages::-webkit-scrollbar-track {
  background: transparent;
}

.clawdbot-messages::-webkit-scrollbar-thumb {
  background: var(--border-light);
  border-radius: 3px;
}

.clawdbot-messages::-webkit-scrollbar-thumb:hover {
  background: var(--text-light);
}
</style>
