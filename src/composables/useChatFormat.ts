/**
 * Chat Format Composable
 * 消息格式化工具（安全版本，不使用 v-html）
 */

export function useChatFormat() {
  /**
   * 安全地格式化消息内容
   * 不使用 v-html，而是返回结构化数据
   */
  const formatMessage = (content: string) => {
    // Split by markdown patterns and create segments
    const segments: Array<{ type: 'text' | 'bold' | 'italic' | 'code'; content: string }> = []
    let remaining = content

    // Process bold (**text**)
    remaining = remaining.replace(/\*\*(.*?)\*\*/g, (_match, p1) => {
      segments.push({ type: 'bold', content: p1 })
      return ''
    })

    // Process italic (*text*)
    remaining = remaining.replace(/\*(.*?)\*/g, (_match, p1) => {
      segments.push({ type: 'italic', content: p1 })
      return ''
    })

    // Process code (`text`)
    remaining = remaining.replace(/`(.*?)`/g, (_match, p1) => {
      segments.push({ type: 'code', content: p1 })
      return ''
    })

    // Remaining text
    if (remaining) {
      segments.push({ type: 'text', content: remaining })
    }

    return segments
  }

  /**
   * 将换行符转换为段落数组
   */
  const splitParagraphs = (content: string): string[] => {
    return content.split('\n').filter(p => p.trim())
  }

  /**
   * 安全转义 HTML
   */
  const escapeHtml = (text: string): string => {
    const div = document.createElement('div')
    div.textContent = text
    return div.innerHTML
  }

  return {
    formatMessage,
    splitParagraphs,
    escapeHtml
  }
}
