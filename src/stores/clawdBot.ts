/**
 * ClawdBot Store
 * AI 聊天机器人状态管理
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { getGeminiResponse, checkGeminiAvailability } from '@/services/geminiService'

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string
  groundingMetadata?: any
}

const WELCOME_MESSAGE: ChatMessage = {
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

const DEFAULT_SUGGESTIONS = [
  '分析系统日志错误',
  '优化数据库性能',
  '编写监控脚本',
  '排查网络问题'
]

export const useClawdBotStore = defineStore('clawdBot', () => {
  // State
  const messages = ref<ChatMessage[]>([WELCOME_MESSAGE])
  const suggestions = ref<string[]>([...DEFAULT_SUGGESTIONS])
  const isLoading = ref(false)
  const isApiAvailable = ref(false)

  // Getters
  const messageCount = computed(() => messages.value.length)
  const hasMessages = computed(() => messages.value.length > 1)
  const showSuggestions = computed(() => suggestions.value.length > 0 && messages.value.length < 3)

  // Actions
  const checkAvailability = async () => {
    isApiAvailable.value = await checkGeminiAvailability()
  }

  const addMessage = (message: ChatMessage) => {
    messages.value.push(message)
  }

  const addUserMessage = (content: string): ChatMessage => {
    const message: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content,
      timestamp: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
    }
    addMessage(message)
    return message
  }

  const addAssistantMessage = (content: string, metadata?: any): ChatMessage => {
    const message: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'assistant',
      content,
      timestamp: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
      groundingMetadata: metadata
    }
    addMessage(message)
    return message
  }

  const addErrorMessage = (content: string = '抱歉，处理你的请求时出现了错误。请稍后再试。') => {
    addAssistantMessage(content)
  }

  const sendMessage = async (userInput: string): Promise<void> => {
    if (isLoading.value) return

    // Add user message
    addUserMessage(userInput)

    // Prepare history (last 10 messages)
    const history = messages.value
      .slice(-10)
      .map(msg => ({ role: msg.role, content: msg.content }))

    // Show loading
    isLoading.value = true

    try {
      // Get AI response
      const response = await getGeminiResponse(userInput, history)
      addAssistantMessage(response.text, response.groundingMetadata)

      // Hide suggestions after first message
      if (messages.value.length > 2) {
        suggestions.value = []
      }
    } catch (error) {
      console.error('Error sending message:', error)
      addErrorMessage()
    } finally {
      isLoading.value = false
    }
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
    suggestions.value = [...DEFAULT_SUGGESTIONS]
  }

  // Initialize
  const init = async () => {
    await checkAvailability()
  }

  return {
    // State
    messages,
    suggestions,
    isLoading,
    isApiAvailable,
    // Getters
    messageCount,
    hasMessages,
    showSuggestions,
    // Actions
    init,
    checkAvailability,
    addMessage,
    addUserMessage,
    addAssistantMessage,
    addErrorMessage,
    sendMessage,
    clearChat
  }
})
