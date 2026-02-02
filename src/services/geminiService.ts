/**
 * Gemini AI Service for ClawdBot
 * 基于 Google Gemini API 的 AI 对话服务
 */

import { GoogleGenAI } from '@google/genai'

const SYSTEM_INSTRUCTION = `你是一个名为 ClawdBot 的智能运维助手。你的特点包括：

1. **专业且友好**：用专业的态度回答运维问题，同时保持友好和耐心
2. **结构化输出**：使用 Markdown 格式提供清晰的回答，包括表格、代码块等
3. **主动建议**：在回答完问题后，提供 2-3 个相关的后续建议
4. **实用性优先**：提供可直接操作的命令和配置示例

当前系统环境：
- 企业级信息系统运维平台
- 支持日志分析、性能监控、故障诊断
- 集成了全链路追踪和 SLA 监控
- 配备专家技能知识库

请基于上述上下文，为用户提供专业的运维建议和解决方案。`

interface GeminiResponse {
  text: string
  groundingMetadata?: any
}

interface MessageHistory {
  role: 'user' | 'model'
  parts: { text: string }[]
}

/**
 * 获取 Gemini AI 响应
 */
export async function getGeminiResponse(
  prompt: string,
  history: { role: string; content: string }[] = []
): Promise<GeminiResponse> {
  // 从环境变量获取 API key
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY || ''

  if (!apiKey) {
    console.warn('Gemini API key not found, using fallback response')
    return getFallbackResponse(prompt)
  }

  try {
    const genAI = new GoogleGenAI(apiKey)
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.0-flash-exp',
      systemInstruction: SYSTEM_INSTRUCTION
    })

    // 构建消息历史
    const chatHistory: MessageHistory[] = history
      .slice(-10) // 只保留最近10条消息
      .map((msg) => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }]
      }))

    // 生成内容
    const chat = model.startChat({
      history: chatHistory,
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 8192
      }
    })

    const result = await chat.sendMessage(prompt)
    const response = result.response

    return {
      text: response.text() || '抱歉，我暂时无法回答这个问题。',
      groundingMetadata: response.candidates?.[0]?.groundingMetadata
    }
  } catch (error) {
    console.error('Gemini API Error:', error)
    // 如果 API 调用失败，返回备用响应
    return getFallbackResponse(prompt, error)
  }
}

/**
 * 备用响应（当 API 不可用时）
 */
function getFallbackResponse(prompt: string, error?: any): GeminiResponse {
  const fallbackResponses: Record<string, string> = {
    默认: `我理解你的问题是："${prompt}"

**注意**：AI 服务暂时不可用。以下是建议的操作：

🔧 **可能的原因**：
- API Key 未配置或已过期
- 网络连接问题
- API 服务暂时不可用

📋 **建议步骤**：
1. 检查环境变量 \`VITE_GEMINI_API_KEY\` 是否正确配置
2. 确认网络连接正常
3. 查看 API 使用配额是否超限

💡 **需要帮助？**
请联系系统管理员获取 API Key 配置支持。`
  }

  return {
    text: fallbackResponses.默认
  }
}

/**
 * 检查 API 可用性
 */
export async function checkGeminiAvailability(): Promise<boolean> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY
  return !!apiKey
}
