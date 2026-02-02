<script setup lang="ts">
import { ref, nextTick, onMounted, watch } from 'vue'
import { Bot, X, Send, Minimize2, Maximize2, Sparkles, AlertCircle } from 'lucide-vue-next'
import { getGeminiResponse, checkGeminiAvailability } from '@/services/geminiService'

interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string
  groundingMetadata?: any
}

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

// State
const isOpen = ref(props.modelValue)
const isMinimized = ref(false)
const inputMessage = ref('')
const isLoading = ref(false)
const isApiAvailable = ref(false)
const messages = ref<ChatMessage[]>([
  {
    id: 'msg-welcome',
    role: 'assistant',
    content: `👋 你好！我是 **ClawdBot**，你的智能运维助手！

我可以帮你：

🔍 **故障诊断**
• 日志分析与根因定位
• 性能瓶颈识别
• 系统集成问题排查

📊 **性能优化**
• 容量规划建议
• SQL 查询优化
• 缓存策略配置

🛠️ **自动化脚本**
• Shell 脚本生成
• 监控配置编写
• 部署自动化

💡 **快速开始**
试着问我：
- "如何分析 Nginx 日志中的 5xx 错误？"
- "帮我写一个 Redis 性能监控脚本"
- "数据库连接数过高怎么排查？"`,
    timestamp: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
  }
])

const messagesContainer = ref<HTMLElement>()
const inputRef = ref<HTMLInputElement>()

// Suggestions
const suggestions = ref<string[]>([
  '分析系统日志错误',
  '优化数据库性能',
  '编写监控脚本',
  '排查网络问题'
])

// Watch for prop changes
watch(() => props.modelValue, (newVal) => {
  isOpen.value = newVal
})

watch(isOpen, (newVal) => {
  emit('update:modelValue', newVal)
  if (newVal) {
    nextTick(() => {
      inputRef.value?.focus()
      scrollToBottom()
    })
  }
})

// Methods
const toggleChat = () => {
  isOpen.value = !isOpen.value
}

const toggleMinimize = () => {
  isMinimized.value = !isMinimized.value
}

const sendMessage = async () => {
  if (!inputMessage.value.trim() || isLoading.value) return

  const userMessage: ChatMessage = {
    id: `msg-${Date.now()}`,
    role: 'user',
    content: inputMessage.value,
    timestamp: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
  }

  messages.value.push(userMessage)
  const userInput = inputMessage.value
  inputMessage.value = ''

  // Scroll to bottom
  await nextTick()
  scrollToBottom()

  // Show loading
  isLoading.value = true

  try {
    // Prepare history
    const history = messages.value
      .slice(-10)
      .map(msg => ({ role: msg.role, content: msg.content }))

    // Get AI response
    const response = await getGeminiResponse(userInput, history)

    const assistantMessage: ChatMessage = {
      id: `msg-${Date.now() + 1}`,
      role: 'assistant',
      content: response.text,
      timestamp: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
      groundingMetadata: response.groundingMetadata
    }

    messages.value.push(assistantMessage)

    // Hide suggestions after first message
    if (messages.value.length > 2) {
      suggestions.value = []
    }
  } catch (error) {
    console.error('Error sending message:', error)
    const errorMessage: ChatMessage = {
      id: `msg-${Date.now() + 1}`,
      role: 'assistant',
      content: '抱歉，处理你的请求时出现了错误。请稍后再试。',
      timestamp: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
    }
    messages.value.push(errorMessage)
  } finally {
    isLoading.value = false
    await nextTick()
    scrollToBottom()
  }
}

const handleSuggestion = (suggestion: string) => {
  inputMessage.value = suggestion
  sendMessage()
}

const scrollToBottom = () => {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

const formatMessage = (content: string) => {
  // Simple markdown-like formatting
  return content
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`(.*?)`/g, '<code>$1</code>')
    .replace(/\n/g, '<br>')
}

const clearChat = () => {
  messages.value = [
    {
      id: 'msg-welcome',
      role: 'assistant',
      content: '对话已清空。有什么我可以帮你的吗？',
      timestamp: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
    }
  ]
  suggestions.value = [
    '分析系统日志错误',
    '优化数据库性能',
    '编写监控脚本',
    '排查网络问题'
  ]
}

// Lifecycle
onMounted(async () => {
  isApiAvailable.value = await checkGeminiAvailability()
  if (isOpen.value) {
    nextTick(() => {
      inputRef.value?.focus()
    })
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
          <div class="header-status" :class="{ available: isApiAvailable }">
            <span class="status-dot"></span>
            {{ isApiAvailable ? 'AI 在线' : '演示模式' }}
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
        v-for="msg in messages"
        :key="msg.id"
        class="message"
        :class="msg.role"
      >
        <div v-if="msg.role === 'assistant'" class="msg-avatar">
          <Bot :size="16" :stroke-width="2.5" />
        </div>
        <div class="msg-content">
          <div class="msg-bubble" :class="msg.role">
            <div class="msg-text" v-html="formatMessage(msg.content)"></div>
            <div class="msg-time">{{ msg.timestamp }}</div>
          </div>
        </div>
      </div>

      <!-- Loading Indicator -->
      <div v-if="isLoading" class="message assistant">
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
      <div v-if="suggestions.length > 0 && messages.length < 3" class="suggestions">
        <button
          v-for="suggestion in suggestions"
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
        :disabled="isLoading || !inputMessage.trim()"
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

.msg-text :deep(strong) {
  font-weight: 600;
}

.msg-text :deep(code) {
  background: rgba(0, 0, 0, 0.05);
  padding: 2px 6px;
  border-radius: 4px;
  font-family: 'Courier New', monospace;
  font-size: 13px;
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
