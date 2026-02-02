/**
 * Terminal Command Composable
 * 终端命令处理逻辑
 */

import { ref } from 'vue'
import type { TerminalMessage } from './useTerminalState'
import { parseCommand, generateResponse } from '@/services/aiEngine'
import { performFullAnalysis, performRootCauseAnalysis, formatAnalysisResult } from '@/services/dataAnalysis'
import { traces, serviceMetrics, dependencyGraph, alerts } from '@/mock/monitoringData'
import {
  executeSkillRule,
  executeAllSkillRules,
  filterRulesByCategory,
  filterRulesBySystem,
  searchSkillRules
} from '@/services/skillEngine'
import { skillRules, skillTemplates, skillExecutionHistory } from '@/mock/skillLibrary'

export function useTerminalCommand() {
  const currentInput = ref('')

  // Built-in commands registry
  const builtInCommands = {
    help: {
      description: '显示帮助信息',
      usage: 'help',
      handler: async () => getHelpText()
    },
    clear: {
      description: '清空终端',
      usage: 'clear',
      handler: async () => ''
    },
    history: {
      description: '显示命令历史',
      usage: 'history',
      handler: async (history: string[]) => getHistoryText(history)
    },
    analyze: {
      description: '执行全链路数据分析',
      usage: 'analyze',
      handler: async () => processAICommand('全链路数据分析')
    },
    status: {
      description: '查看系统状态',
      usage: 'status',
      handler: async () => processAICommand('查看系统状态')
    },
    traces: {
      description: '查看所有追踪记录',
      usage: 'traces',
      handler: async () => getTracesText()
    },
    metrics: {
      description: '查看服务性能指标',
      usage: 'metrics',
      handler: async () => getMetricsText()
    },
    alerts: {
      description: '查看活跃告警',
      usage: 'alerts',
      handler: async () => getAlertsText()
    }
  }

  // Execute command
  const executeCommand = async (input: string, commandHistory: string[]): Promise<string> => {
    const cmdParts = input.trim().split(' ')
    const cmdName = cmdParts[0].toLowerCase()
    const args = cmdParts.slice(1)
    const builtInCmd = builtInCommands[cmdName as keyof typeof builtInCommands]

    if (builtInCmd) {
      if (cmdName === 'history') {
        return await builtInCmd.handler(commandHistory)
      }
      return await builtInCmd.handler(args)
    }

    // Use AI natural language processing
    return await processAICommand(input)
  }

  // Process AI command
  const processAICommand = async (input: string): Promise<string> => {
    const command = parseCommand(input)
    if (!command) {
      return '抱歉，我没有理解您的请求。您可以输入 "help" 查看可用命令。'
    }

    const response = generateResponse(command, input)
    return response.content
  }

  // Helper functions
  const getHelpText = () => {
    return `📋 运维助手命令参考

🔍 自然语言命令:
  • 查看系统状态 - 查看所有信息系统健康状态
  • 全链路数据分析 - 完整的性能和容量分析
  • 分析系统集成故障 - 诊断系统集成问题
  • 容量规划 - 资源预测和扩容建议

💻 命令行命令:
  • analyze - 执行全链路分析
  • traces - 查看所有追踪记录
  • metrics - 查看服务性能指标
  • alerts - 查看活跃告警
  • status - 查看系统状态
  • clear - 清空终端
  • history - 显示命令历史
  • help - 显示此帮助信息

💡 提示: 可以直接输入自然语言描述问题，系统会自动识别意图`
  }

  const getHistoryText = (history: string[]) => {
    if (history.length === 0) return '暂无命令历史'

    let output = '\n📜 命令历史\n'
    output += `${'─'.repeat(60)}\n\n`
    history.forEach((cmd, idx) => {
      output += `  ${idx + 1}.  ${cmd}\n`
    })
    return output
  }

  const getTracesText = () => {
    let output = `🔗 全链路追踪记录\n`
    output += `${'═'.repeat(60)}\n`
    output += `共找到 ${traces.length} 条追踪记录\n\n`

    traces.forEach((trace, idx) => {
      const statusEmoji = trace.status === 'success' ? '✅' : trace.status === 'error' ? '❌' : '⏱️'
      output += `${idx + 1}. ${statusEmoji} ${trace.traceId}\n`
      output += `   业务流程: ${trace.businessFlow}\n`
      output += `   入口系统: ${trace.entrySystem}\n`
      output += `   总耗时: ${trace.duration}ms\n\n`
    })

    return output
  }

  const getMetricsText = () => {
    let output = `📊 服务性能指标\n`
    output += `${'═'.repeat(60)}\n\n`

    serviceMetrics.forEach((metric, idx) => {
      const healthStatus = metric.requestSuccessRate >= 99 ? '✅' : metric.requestSuccessRate >= 95 ? '⚠️' : '🔴'
      output += `${idx + 1}. ${healthStatus} ${metric.systemName}\n`
      output += `   请求量: ${metric.requestCount}\n`
      output += `   成功率: ${metric.requestSuccessRate}%\n\n`
    })

    return output
  }

  const getAlertsText = () => {
    const activeAlerts = alerts.filter(a => a.status === 'active')

    let output = `🚨 活跃告警\n`
    output += `${'═'.repeat(60)}\n`
    output += `共 ${activeAlerts.length} 个活跃告警\n\n`

    if (activeAlerts.length === 0) {
      output += `✅ 当前没有活跃告警\n`
    } else {
      activeAlerts.forEach((alert, idx) => {
        const severityEmoji = alert.severity === 'critical' ? '🔴' : alert.severity === 'warning' ? '⚠️' : 'ℹ️'
        output += `${idx + 1}. ${severityEmoji} [${alert.severity.toUpperCase()}] ${alert.title}\n`
        output += `   来源: ${alert.source}\n`
        output += `   描述: ${alert.description}\n\n`
      })
    }

    return output
  }

  return {
    currentInput,
    builtInCommands,
    executeCommand
  }
}
