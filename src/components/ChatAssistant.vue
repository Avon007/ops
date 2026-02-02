<script setup lang="ts">
import { ref, nextTick } from 'vue'
import { Bot, X, Send, Terminal, Activity, Package } from 'lucide-vue-next'
import type { ChatMessage, QuickCommand } from '@/types'
import { parseCommand, generateResponse } from '@/services/aiEngine'
import { quickCommands } from '@/mock/data'

const isOpen = ref(true)
const inputMessage = ref('')
const messages = ref<ChatMessage[]>([
  {
    id: 'msg-welcome',
    role: 'assistant',
    content: '你好！我是你的智能信息系统运维助手。我可以帮你：\n\n📊 数据分析\n• 全链路性能分析\n• 容量规划和预测\n• 性能瓶颈识别\n• 智能洞察生成\n\n🔍 故障诊断\n• 系统集成故障分析\n• 根因分析（CoT方法）\n• 依赖拓扑可视化\n• SLA监控报告\n\n点击下方快速命令或直接告诉我你需要什么帮助：',
    timestamp: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
  }
])
const messagesContainer = ref<HTMLElement>()

const toggleChat = () => {
  isOpen.value = !isOpen.value
}

const sendMessage = async () => {
  if (!inputMessage.value.trim()) return

  // Add user message
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

  // Parse command and generate response
  const command = parseCommand(userInput)
  const response = generateResponse(command, userInput)

  // Simulate typing delay
  setTimeout(() => {
    messages.value.push(response)
    nextTick(() => scrollToBottom())
  }, 500)
}

const handleQuickCommand = (command: QuickCommand) => {
  inputMessage.value = command.label
  sendMessage()
}

const scrollToBottom = () => {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

const getCommandIcon = (iconName: string) => {
  const icons: Record<string, any> = {
    terminal: Terminal,
    activity: Activity,
    package: Package
  }
  return icons[iconName] || Terminal
}
</script>

<template>
  <div v-if="isOpen" class="chat-panel">
    <!-- Header -->
    <div class="chat-header">
      <div class="chat-header-left">
        <div class="chat-avatar">
          <Bot :size="20" :stroke-width="2" />
        </div>
        <div class="chat-title-group">
          <div class="chat-title">AI Assistant</div>
          <div class="chat-status">Online · Ready to help</div>
        </div>
      </div>
      <button class="chat-close" @click="toggleChat">
        <X :size="16" />
      </button>
    </div>

    <!-- Messages -->
    <div ref="messagesContainer" class="chat-messages">
      <!-- Welcome message with quick commands -->
      <div v-if="messages.length === 1" class="message assistant">
        <div class="msg-avatar">
          <Bot :size="16" :stroke-width="2" />
        </div>
        <div class="msg-content">
          <div class="msg-bubble">
            {{ messages[0].content }}
          </div>
          <div class="quick-commands">
            <div
              v-for="cmd in quickCommands"
              :key="cmd.id"
              class="quick-command"
              @click="handleQuickCommand(cmd)"
            >
              <component :is="getCommandIcon(cmd.icon)" :size="16" />
              <span>{{ cmd.label }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Other messages -->
      <div
        v-for="msg in messages.slice(1)"
        :key="msg.id"
        class="message"
        :class="msg.role"
      >
        <div v-if="msg.role === 'assistant'" class="msg-avatar">
          <Bot :size="16" :stroke-width="2" />
        </div>
        <div class="msg-content">
          <div class="msg-bubble" :class="msg.role">
            <div class="msg-text">{{ msg.content }}</div>
            <div v-if="msg.role === 'user'" class="msg-time">{{ msg.timestamp }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Input Area -->
    <div class="chat-input-area">
      <input
        v-model="inputMessage"
        type="text"
        class="chat-input"
        placeholder="输入命令或问题..."
        @keyup.enter="sendMessage"
      />
      <button class="send-button" @click="sendMessage">
        <Send :size="20" />
      </button>
    </div>
  </div>

  <!-- Toggle Button (when closed) -->
  <div v-else class="chat-toggle" @click="toggleChat">
    <Bot :size="24" />
  </div>
</template>

<style scoped>
.chat-panel {
  position: absolute;
  right: 20px;
  bottom: 20px;
  width: 380px;
  height: 600px;
  background-color: var(--bg-white);
  border: 1px solid var(--border-light);
  border-radius: var(--border-radius-lg);
  display: flex;
  flex-direction: column;
  box-shadow: var(--shadow-elevated);
  overflow: hidden;
  z-index: 100;
}

.chat-header {
  padding: var(--spacing-xl);
  border-bottom: 1px solid var(--border-light);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.chat-header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.chat-avatar {
  width: 40px;
  height: 40px;
  background-color: var(--primary-green);
  border-radius: var(100px);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--bg-white);
}

.chat-title-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.chat-title {
  font-size: var(--font-size-title-3);
  font-weight: 600;
  color: var(--text-main);
  font-family: var(--font-family);
}

.chat-status {
  font-size: var(--font-size-footnote);
  font-weight: 500;
  color: var(--primary-green);
  font-family: var(--font-family);
}

.chat-close {
  width: 32px;
  height: 32px;
  border: 1px solid var(--border-light);
  border-radius: var(100px);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  background: transparent;
  color: var(--text-gray);
  transition: all 0.2s ease;
}

.chat-close:hover {
  background-color: var(--bg-muted);
}

.chat-messages {
  flex: 1;
  padding: var(--spacing-xl);
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-base);
}

.message {
  display: flex;
  gap: var(--spacing-md);
}

.message.user {
  justify-content: flex-end;
}

.msg-avatar {
  width: 32px;
  height: 32px;
  background-color: var(--primary-green);
  border-radius: var(100px);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--bg-white);
  flex-shrink: 0;
}

.msg-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
  max-width: 260px;
}

.msg-bubble {
  padding: 12px 16px;
  border-radius: var(--border-radius-lg);
  position: relative;
}

.message.assistant .msg-bubble {
  background-color: var(--bg-body);
  color: var(--text-main);
}

.message.user .msg-bubble {
  background-color: var(--primary-green);
  color: var(--bg-white);
}

.msg-text {
  font-size: var(--font-size-body);
  font-weight: 400;
  line-height: 1.5;
  white-space: pre-wrap;
  font-family: var(--font-family);
}

.msg-time {
  font-size: var(--font-size-caption-2);
  color: var(--text-light);
  margin-top: 4px;
  font-family: var(--font-family);
}

.quick-commands {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 6px;
}

.quick-command {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  background-color: var(--accent-light);
  border-radius: var(--border-radius);
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: var(--font-size-subhead);
  font-weight: 500;
  color: var(--text-main);
  font-family: var(--font-family);
}

.quick-command:hover {
  background-color: var(--primary-green);
  color: var(--bg-white);
  transform: translateX(2px);
}

.chat-input-area {
  padding: var(--spacing-base) var(--spacing-xl);
  border-top: 1px solid var(--border-light);
  display: flex;
  gap: var(--spacing-md);
  align-items: center;
}

.chat-input {
  flex: 1;
  height: 48px;
  padding: 0 var(--spacing-base);
  background-color: var(--bg-body);
  border: 1px solid var(--border-light);
  border-radius: var(--border-radius);
  font-size: var(--font-size-body);
  font-family: var(--font-family);
  color: var(--text-main);
  transition: all 0.2s ease;
}

.chat-input::placeholder {
  color: var(--text-light);
}

.chat-input:focus {
  outline: none;
  border-color: var(--primary-green);
  box-shadow: 0 0 0 3px rgba(61, 138, 90, 0.1);
}

.send-button {
  width: 48px;
  height: 48px;
  background-color: var(--primary-green);
  border-radius: var(100px);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
  color: var(--bg-white);
}

.send-button:hover {
  background-color: var(--status-success);
  transform: scale(1.05);
}

.send-button:active {
  transform: scale(0.95);
}

.chat-toggle {
  position: fixed;
  right: 20px;
  bottom: 20px;
  width: 56px;
  height: 56px;
  background-color: var(--primary-green);
  border-radius: var(100px);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: var(--shadow-elevated);
  transition: all 0.2s ease;
  z-index: 100;
  color: var(--bg-white);
}

.chat-toggle:hover {
  transform: scale(1.1);
  background-color: var(--status-success);
}
</style>
