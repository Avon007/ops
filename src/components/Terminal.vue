<script setup lang="ts">
import { ref, nextTick, onMounted, watch } from 'vue'
import { Terminal as TerminalIcon, Send, Clock, ChevronRight } from 'lucide-vue-next'
import type { ChatMessage } from '@/types'
import { parseCommand, generateResponse } from '@/services/aiEngine'
import { performFullAnalysis, performRootCauseAnalysis, formatAnalysisResult } from '@/services/dataAnalysis'
import { traces, serviceMetrics, dependencyGraph, alerts } from '@/mock/monitoringData'
import {
  executeSkillRule,
  executeAllSkillRules,
  filterRulesBySystem,
  filterRulesByCategory,
  searchSkillRules
} from '@/services/skillEngine'
import { skillRules, skillTemplates, skillExecutionHistory, operatorProfiles } from '@/mock/skillLibrary'

// Props
interface Props {
  title?: string
  showHeader?: boolean
}

withDefaults(defineProps<Props>(), {
  title: '运维终端',
  showHeader: true
})

// Terminal state
const terminalRef = ref<HTMLElement>()
const inputRef = ref<HTMLInputElement>()
const messages = ref<TerminalMessage[]>([])
const currentInput = ref('')
const commandHistory = ref<string[]>([])
const historyIndex = ref(-1)
const isProcessing = ref(false)
const maxMessages = 100 // 限制最大消息数量

// 限制消息数量
const trimMessages = () => {
  if (messages.value.length > maxMessages) {
    const removeCount = messages.value.length - maxMessages
    messages.value = messages.value.slice(removeCount)
  }
}

// Terminal message type
interface TerminalMessage {
  id: string
  type: 'command' | 'response' | 'system' | 'error'
  content: string
  timestamp: string
  metadata?: {
    command?: string
    duration?: number
    analysisResult?: any
  }
}

// Built-in commands
const builtInCommands = {
  help: {
    description: '显示帮助信息',
    usage: 'help',
    handler: async () => {
      return `📋 运维助手命令参考

🔍 自然语言命令:
  • 查看系统状态 - 查看所有信息系统健康状态
  • 全链路数据分析 - 完整的性能和容量分析
  • 分析系统集成故障 - 诊断系统集成问题
  • 容量规划 - 资源预测和扩容建议
  • 技能库 - 查看专家技能库
  • 执行技能 [名称] - 执行特定技能
  • 依赖拓扑 - 查看系统依赖关系图
  • SLA查询 - 查看服务等级协议
  • 端口阻塞 - 诊断端口阻塞和网络不通
  • 安全设备 - 查看安全隔离装置状态

💻 命令行命令:
  • analyze - 执行全链路分析
  • full-analysis - 完整数据分析报告
  • root-cause [incident-id] - 根因分析
  • traces - 查看所有追踪记录
  • metrics - 查看服务性能指标
  • topology - 查看系统依赖拓扑
  • alerts - 查看活跃告警
  • status - 查看系统状态
  • diagnose - 诊断系统故障
  • capacity - 容量规划分析
  • skills - 查看技能库列表
  • skill-info [id] - 查看技能详细信息
  • skill-exec [id] - 执行指定技能
  • skill-exec-all - 执行所有启用的技能
  • skill-cat [category] - 按类别过滤技能
  • skill-sys [system-id] - 按系统过滤技能
  • skill-search [keyword] - 搜索技能
  • skill-history - 查看技能执行历史
  • skill-templates - 查看技能模板
  • sla - SLA服务报告
  • port-block - 端口阻塞诊断
  • security - 安全设备状态
  • clear - 清空终端
  • history - 显示命令历史
  • help - 显示此帮助信息

🎯 快捷键:
  • Enter - 执行命令
  • ↑/↓ - 浏览历史命令
  • Ctrl+L - 清空终端

💡 提示: 可以直接输入自然语言描述问题，系统会自动识别意图`
    }
  },
  clear: {
    description: '清空终端',
    usage: 'clear',
    handler: async () => {
      messages.value = []
      return ''
    }
  },
  history: {
    description: '显示命令历史',
    usage: 'history',
    handler: async () => {
      if (commandHistory.value.length === 0) {
        return '暂无命令历史'
      }
      let output = '\n📜 命令历史\n'
      output += `${'─'.repeat(60)}\n\n`
      commandHistory.value.forEach((cmd, idx) => {
        output += `  ${idx + 1}.  ${cmd}\n`
      })
      return output
    }
  },
  analyze: {
    description: '执行全链路数据分析',
    usage: 'analyze',
    handler: async () => {
      const command = parseCommand('全链路数据分析')
      return processAICommand(command, '全链路数据分析')
    }
  },
  status: {
    description: '查看系统状态',
    usage: 'status',
    handler: async () => {
      const command = parseCommand('查看系统状态')
      return processAICommand(command, '查看系统状态')
    }
  },
  diagnose: {
    description: '诊断系统故障',
    usage: 'diagnose',
    handler: async () => {
      const command = parseCommand('分析系统集成故障')
      return processAICommand(command, '分析系统集成故障')
    }
  },
  capacity: {
    description: '容量规划分析',
    usage: 'capacity',
    handler: async () => {
      const command = parseCommand('容量规划')
      return processAICommand(command, '容量规划')
    }
  },
  skills: {
    description: '查看技能库',
    usage: 'skills',
    handler: async () => {
      const command = parseCommand('技能库')
      return processAICommand(command, '技能库')
    }
  },
  topology: {
    description: '查看依赖拓扑',
    usage: 'topology',
    handler: async () => {
      const command = parseCommand('依赖拓扑')
      return processAICommand(command, '依赖拓扑')
    }
  },
  sla: {
    description: 'SLA服务报告',
    usage: 'sla',
    handler: async () => {
      const command = parseCommand('SLA查询')
      return processAICommand(command, 'SLA查询')
    }
  },
  'port-block': {
    description: '端口阻塞诊断',
    usage: 'port-block',
    handler: async () => {
      const command = parseCommand('端口阻塞')
      return processAICommand(command, '端口阻塞')
    }
  },
  security: {
    description: '安全设备状态',
    usage: 'security',
    handler: async () => {
      const command = parseCommand('安全设备')
      return processAICommand(command, '安全设备')
    }
  },
  'full-analysis': {
    description: '完整数据分析报告',
    usage: 'full-analysis',
    handler: async () => {
      const analysisResult = performFullAnalysis()
      return formatAnalysisResult(analysisResult)
    }
  },
  'root-cause': {
    description: '根因分析',
    usage: 'root-cause [incident-id]',
    handler: async (args?: string[]) => {
      const incidentId = args?.[0] || 'ALERT-001'
      const rootCauseResult = performRootCauseAnalysis(incidentId)

      let output = `🔍 根因分析报告\n`
      output += `${'═'.repeat(60)}\n`
      output += `事故ID: ${rootCauseResult.incidentId}\n`
      output += `分析时间: ${rootCauseResult.timestamp}\n\n`

      output += `📝 问题描述\n`
      output += `${'─'.repeat(60)}\n`
      output += `${rootCauseResult.description}\n\n`

      output += `🎯 根本原因\n`
      output += `${'─'.repeat(60)}\n`
      output += `${rootCauseResult.rootCause}\n\n`

      output += `📊 贡献因素\n`
      output += `${'─'.repeat(60)}\n`
      rootCauseResult.contributingFactors.forEach((factor, idx) => {
        output += `${idx + 1}. ${factor}\n`
      })
      output += `\n`

      output += `⏱️  事件时间线\n`
      output += `${'─'.repeat(60)}\n`
      rootCauseResult.timeline.forEach(event => {
        const emoji = event.type === 'change' ? '🔄' : event.type === 'alert' ? '🚨' : '📈'
        output += `${emoji} ${new Date(event.timestamp).toLocaleString('zh-CN')}\n`
        output += `   ${event.event}\n\n`
      })

      output += `🔗 证据链\n`
      output += `${'─'.repeat(60)}\n`
      rootCauseResult.evidence.forEach((evidence, idx) => {
        output += `${idx + 1}. [${evidence.type.toUpperCase()}] ${evidence.description}\n`
        output += `   来源: ${evidence.source}\n\n`
      })

      return output
    }
  },
  traces: {
    description: '查看所有追踪记录',
    usage: 'traces',
    handler: async () => {
      let output = `🔗 全链路追踪记录\n`
      output += `${'═'.repeat(60)}\n`
      output += `共找到 ${traces.length} 条追踪记录\n\n`

      traces.forEach((trace, idx) => {
        const statusEmoji = trace.status === 'success' ? '✅' : trace.status === 'error' ? '❌' : '⏱️'
        output += `${idx + 1}. ${statusEmoji} ${trace.traceId}\n`
        output += `   业务流程: ${trace.businessFlow}\n`
        output += `   入口系统: ${trace.entrySystem}\n`
        output += `   总耗时: ${trace.duration}ms\n`
        output += `   Span数量: ${trace.spans.length}\n`
        output += `   时间: ${new Date(trace.timestamp).toLocaleString('zh-CN')}\n\n`
      })

      return output
    }
  },
  metrics: {
    description: '查看服务性能指标',
    usage: 'metrics',
    handler: async () => {
      let output = `📊 服务性能指标\n`
      output += `${'═'.repeat(60)}\n\n`

      serviceMetrics.forEach((metric, idx) => {
        const healthStatus = metric.requestSuccessRate >= 99 ? '✅' : metric.requestSuccessRate >= 95 ? '⚠️' : '🔴'
        output += `${idx + 1}. ${healthStatus} ${metric.systemName}\n`
        output += `   时间范围: ${metric.timeframe}\n`
        output += `   请求量: ${metric.requestCount}\n`
        output += `   成功率: ${metric.requestSuccessRate}%\n`
        output += `   错误率: ${metric.requestErrorRate}%\n`
        output += `   延迟: P50=${metric.requestLatency.p50}ms, P95=${metric.requestLatency.p95}ms, P99=${metric.requestLatency.p99}ms\n`
        output += `   CPU: ${metric.cpuUsage}% | 内存: ${metric.memoryUsage}%\n`
        output += `   活跃用户: ${metric.activeUsers}\n\n`
      })

      return output
    }
  },
  topology: {
    description: '查看系统依赖拓扑',
    usage: 'topology',
    handler: async () => {
      let output = `🕸️  系统依赖拓扑\n`
      output += `${'═'.repeat(60)}\n\n`

      output += `📦 节点列表 (${dependencyGraph.nodes.length}个)\n`
      output += `${'─'.repeat(60)}\n`
      dependencyGraph.nodes.forEach(node => {
        const statusEmoji = node.status === 'healthy' ? '✅' : node.status === 'warning' ? '⚠️' : '🔴'
        output += `${statusEmoji} ${node.name} [${node.type}]\n`
        output += `   请求量: ${node.metrics.requestCount}\n`
        output += `   错误率: ${node.metrics.errorRate}%\n`
        output += `   平均延迟: ${node.metrics.avgLatency}ms\n\n`
      })

      output += `🔗 依赖关系 (${dependencyGraph.edges.length}条)\n`
      output += `${'─'.repeat(60)}\n`
      dependencyGraph.edges.forEach((edge, idx) => {
        const sourceNode = dependencyGraph.nodes.find(n => n.id === edge.source)
        const targetNode = dependencyGraph.nodes.find(n => n.id === edge.target)
        const statusEmoji = edge.status === 'healthy' ? '✅' : edge.status === 'warning' ? '⚠️' : '🔴'

        output += `${idx + 1}. ${statusEmoji} ${sourceNode?.name} → ${targetNode?.name}\n`
        output += `   类型: ${edge.type}\n`
        output += `   请求量: ${edge.metrics.requestCount}\n`
        output += `   错误率: ${edge.metrics.errorRate}%\n`
        output += `   延迟: ${edge.metrics.avgLatency}ms\n\n`
      })

      output += `更新时间: ${new Date(dependencyGraph.timestamp).toLocaleString('zh-CN')}\n`

      return output
    }
  },
  alerts: {
    description: '查看活跃告警',
    usage: 'alerts',
    handler: async () => {
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
          output += `   描述: ${alert.description}\n`

          if (alert.metricName) {
            output += `   指标: ${alert.metricName} = ${alert.currentValue} (阈值: ${alert.threshold})\n`
          }

          output += `   影响系统: ${alert.affectedSystems.join(', ')}\n`
          output += `   时间: ${new Date(alert.timestamp).toLocaleString('zh-CN')}\n\n`

          if (alert.suggestedActions && alert.suggestedActions.length > 0) {
            output += `   建议操作:\n`
            alert.suggestedActions.forEach(action => {
              output += `     • ${action}\n`
            })
            output += `\n`
          }
        })
      }

      return output
    }
  },
  skills: {
    description: '查看技能库列表',
    usage: 'skills',
    handler: async () => {
      let output = `📚 专家技能知识库\n`
      output += `${'═'.repeat(60)}\n`
      output += `共 ${skillRules.length} 个技能规则\n\n`

      // 按类别分组
      const skillsByCategory: Record<string, typeof skillRules> = {}
      skillRules.forEach(skill => {
        if (!skillsByCategory[skill.category]) {
          skillsByCategory[skill.category] = []
        }
        skillsByCategory[skill.category].push(skill)
      })

      // 按类别显示
      Object.entries(skillsByCategory).forEach(([category, skills]) => {
        const categoryEmoji = {
          performance: '⚡',
          integration: '🔗',
          availability: '✅',
          security: '🔒',
          capacity: '📊',
          network_block: '🌐'
        }[category] || '📦'

        output += `${categoryEmoji} ${category.toUpperCase()} (${skills.length}个)\n`
        output += `${'─'.repeat(60)}\n`

        skills.forEach(skill => {
          const statusEmoji = skill.enabled ? '✅' : '⭕'
          const successRate = skill.executionCount > 0
            ? ((skill.successCount / skill.executionCount) * 100).toFixed(0)
            : 'N/A'

          output += `${statusEmoji} ${skill.id}\n`
          output += `   名称: ${skill.name}\n`
          output += `   创建者: ${skill.creatorName}\n`
          output += `   适用系统: ${skill.applicableSystems.join(', ')}\n`
          output += `   成功率: ${successRate}% (${skill.successCount}/${skill.executionCount})\n`
          output += `   标签: ${skill.tags.join(', ')}\n\n`
        })
      })

      return output
    }
  },
  'skill-info': {
    description: '查看技能详细信息',
    usage: 'skill-info [id]',
    handler: async (args?: string[]) => {
      const skillId = args?.[0]
      if (!skillId) {
        return '❌ 请提供技能ID\n\n用法: skill-info [id]\n\n示例: skill-info skill-001'
      }

      const skill = skillRules.find(s => s.id === skillId)
      if (!skill) {
        return `❌ 未找到ID为 ${skillId} 的技能\n\n提示: 使用 "skills" 命令查看所有可用技能`
      }

      let output = `📖 技能详细信息\n`
      output += `${'═'.repeat(60)}\n\n`

      output += `🎯 基本信息\n`
      output += `${'─'.repeat(60)}\n`
      output += `ID: ${skill.id}\n`
      output += `名称: ${skill.name}\n`
      output += `描述: ${skill.description}\n`
      output += `类别: ${skill.category}\n`
      output += `版本: v${skill.version}\n`
      output += `状态: ${skill.enabled ? '✅ 已启用' : '⭕ 已禁用'}\n\n`

      output += `👤 创建信息\n`
      output += `${'─'.repeat(60)}\n`
      output += `创建者: ${skill.creatorName} (${skill.createdBy})\n`
      output += `创建时间: ${new Date(skill.createdAt).toLocaleString('zh-CN')}\n`
      if (skill.modifiedAt) {
        output += `修改者: ${skill.modifiedBy}\n`
        output += `修改时间: ${new Date(skill.modifiedAt).toLocaleString('zh-CN')}\n`
      }
      output += `\n`

      output += `🏷️  分类信息\n`
      output += `${'─'.repeat(60)}\n`
      output += `适用系统: ${skill.applicableSystems.join(', ')}\n`
      output += `标签: ${skill.tags.join(', ')}\n\n`

      output += `📊 执行统计\n`
      output += `${'─'.repeat(60)}\n`
      output += `执行次数: ${skill.executionCount}\n`
      output += `成功次数: ${skill.successCount}\n`
      output += `误报率: ${(skill.falsePositiveRate * 100).toFixed(1)}%\n`
      if (skill.lastExecutedAt) {
        output += `最后执行: ${new Date(skill.lastExecutedAt).toLocaleString('zh-CN')}\n`
      }
      output += `\n`

      if (skill.validated) {
        output += `✅ 验证状态: 已验证\n`
        output += `验证者: ${skill.validatedBy}\n`
        output += `验证时间: ${new Date(skill.validatedAt!).toLocaleString('zh-CN')}\n\n`
      }

      output += `⚡ 触发条件 (${skill.triggers.length}个)\n`
      output += `${'─'.repeat(60)}\n`
      skill.triggers.forEach((trigger, idx) => {
        output += `${idx + 1}. ${trigger.name}\n`
        output += `   描述: ${trigger.description}\n`
        output += `   类型: ${trigger.triggerType}\n`
        output += `   状态: ${trigger.enabled ? '✅' : '⭕'}\n\n`
      })

      output += `🔍 诊断步骤 (${skill.diagnosisSteps.length}个)\n`
      output += `${'─'.repeat(60)}\n`
      skill.diagnosisSteps.forEach((step, idx) => {
        output += `${idx + 1}. ${step.name} (${step.stepType})\n`
        output += `   描述: ${step.description}\n\n`
      })

      output += `🎬 执行动作 (${skill.actions.length}个)\n`
      output += `${'─'.repeat(60)}\n`
      skill.actions.forEach((action, idx) => {
        output += `${idx + 1}. ${action.name} (${action.actionType})\n`
        output += `   描述: ${action.description}\n`
        output += `   状态: ${action.enabled ? '✅' : '⭕'}\n\n`
      })

      if (skill.documentation) {
        output += `📝 文档\n`
        output += `${'─'.repeat(60)}\n`
        output += `${skill.documentation}\n\n`
      }

      if (skill.examples && skill.examples.length > 0) {
        output += `💡 使用示例\n`
        output += `${'─'.repeat(60)}\n`
        skill.examples.forEach((example, idx) => {
          output += `${idx + 1}. ${example}\n`
        })
      }

      return output
    }
  },
  'skill-exec': {
    description: '执行指定技能',
    usage: 'skill-exec [id]',
    handler: async (args?: string[]) => {
      const skillId = args?.[0]
      if (!skillId) {
        return '❌ 请提供技能ID\n\n用法: skill-exec [id]\n\n示例: skill-exec skill-001'
      }

      const skill = skillRules.find(s => s.id === skillId)
      if (!skill) {
        return `❌ 未找到ID为 ${skillId} 的技能\n\n提示: 使用 "skills" 命令查看所有可用技能`
      }

      if (!skill.enabled) {
        return `❌ 技能 ${skillId} 当前已禁用，无法执行`
      }

      const result = executeSkillRule(skill)

      let output = `🎯 技能执行报告\n`
      output += `${'═'.repeat(60)}\n`
      output += `执行ID: ${result.executionId}\n`
      output += `技能名称: ${result.ruleName}\n`
      output += `执行时间: ${new Date(result.executedAt).toLocaleString('zh-CN')}\n`
      output += `执行者: ${result.executedBy}\n`
      output += `状态: ${result.status === 'success' ? '✅ 成功' : result.status === 'failed' ? '❌ 失败' : '⚠️ 部分成功'}\n`
      output += `置信度: ${(result.confidence * 100).toFixed(0)}%\n`
      output += `总耗时: ${result.totalDuration}ms\n\n`

      output += `📋 执行摘要\n`
      output += `${'─'.repeat(60)}\n`
      output += `${result.summary}\n\n`

      if (result.diagnosisResults.length > 0) {
        output += `🔍 诊断步骤 (${result.diagnosisResults.length}个)\n`
        output += `${'─'.repeat(60)}\n`
        result.diagnosisResults.forEach((step, idx) => {
          const statusEmoji = step.status === 'success' ? '✅' : step.status === 'failed' ? '❌' : '⏭️'
          output += `${idx + 1}. ${statusEmoji} ${step.stepName} (${step.duration}ms)\n`
          if (step.output) {
            output += `   ${step.output.substring(0, 100)}${step.output.length > 100 ? '...' : ''}\n`
          }
        })
        output += `\n`
      }

      if (result.actionResults.length > 0) {
        output += `🎬 执行动作 (${result.actionResults.length}个)\n`
        output += `${'─'.repeat(60)}\n`
        result.actionResults.forEach((action, idx) => {
          const statusEmoji = action.status === 'success' ? '✅' : action.status === 'failed' ? '❌' : '⏳'
          output += `${idx + 1}. ${statusEmoji} ${action.actionName} (${action.duration}ms)\n`
          if (action.output) {
            output += `   ${action.output.substring(0, 100)}${action.output.length > 100 ? '...' : ''}\n`
          }
        })
        output += `\n`
      }

      if (result.recommendations && result.recommendations.length > 0) {
        output += `💡 建议\n`
        output += `${'─'.repeat(60)}\n`
        result.recommendations.forEach((rec, idx) => {
          output += `${idx + 1}. ${rec}\n`
        })
        output += `\n`
      }

      output += `📊 影响范围\n`
      output += `${'─'.repeat(60)}\n`
      output += `影响系统: ${result.affectedSystems.join(', ')}\n`
      output += `业务影响: ${result.businessImpact}\n`

      return output
    }
  },
  'skill-exec-all': {
    description: '执行所有启用的技能',
    usage: 'skill-exec-all',
    handler: async () => {
      const enabledSkills = skillRules.filter(s => s.enabled)
      if (enabledSkills.length === 0) {
        return '❌ 当前没有启用的技能\n\n提示: 使用 "skills" 查看所有技能'
      }

      const results = executeAllSkillRules(enabledSkills)

      let output = `🎯 批量技能执行报告\n`
      output += `${'═'.repeat(60)}\n`
      output += `执行时间: ${new Date().toLocaleString('zh-CN')}\n`
      output += `执行数量: ${results.length} 个技能\n\n`

      // 统计
      const successCount = results.filter(r => r.status === 'success').length
      const failedCount = results.filter(r => r.status === 'failed').length

      output += `📊 执行统计\n`
      output += `${'─'.repeat(60)}\n`
      output += `成功: ${successCount} | 失败: ${failedCount} | 总数: ${results.length}\n\n`

      // 详细结果
      output += `📋 执行详情\n`
      output += `${'─'.repeat(60)}\n\n`

      results.forEach((result, idx) => {
        const statusEmoji = result.status === 'success' ? '✅' : result.status === 'failed' ? '❌' : '⚠️'
        output += `${idx + 1}. ${statusEmoji} ${result.ruleName}\n`
        output += `   置信度: ${(result.confidence * 100).toFixed(0)}% | 耗时: ${result.totalDuration}ms\n`
        output += `   摘要: ${result.summary.substring(0, 80)}...\n\n`
      })

      return output
    }
  },
  'skill-cat': {
    description: '按类别过滤技能',
    usage: 'skill-cat [category]',
    handler: async (args?: string[]) => {
      const category = args?.[0]
      if (!category) {
        let output = `📊 按类别查看技能\n\n`
        output += `可用的类别:\n\n`
        const categories = [...new Set(skillRules.map(s => s.category))]
        categories.forEach(cat => {
          const count = skillRules.filter(s => s.category === cat).length
          output += `• ${cat} (${count}个)\n`
        })
        output += `\n用法: skill-cat [category]\n\n示例: skill-cat performance`
        return output
      }

      const filtered = filterRulesByCategory(skillRules, category)
      if (filtered.length === 0) {
        return `❌ 未找到类别 "${category}" 的技能\n\n提示: 使用 "skill-cat" 查看所有可用类别`
      }

      let output = `📊 类别: ${category.toUpperCase()}\n`
      output += `${'═'.repeat(60)}\n`
      output += `共 ${filtered.length} 个技能\n\n`

      filtered.forEach((skill, idx) => {
        const statusEmoji = skill.enabled ? '✅' : '⭕'
        output += `${idx + 1}. ${statusEmoji} ${skill.id}\n`
        output += `   名称: ${skill.name}\n`
        output += `   描述: ${skill.description}\n`
        output += `   创建者: ${skill.creatorName}\n\n`
      })

      return output
    }
  },
  'skill-sys': {
    description: '按系统过滤技能',
    usage: 'skill-sys [system-id]',
    handler: async (args?: string[]) => {
      const systemId = args?.[0]
      if (!systemId) {
        return '❌ 请提供系统ID\n\n用法: skill-sys [system-id]\n\n示例: skill-sys sys-001'
      }

      const filtered = filterRulesBySystem(skillRules, systemId)
      if (filtered.length === 0) {
        return `❌ 未找到适用于系统 "${systemId}" 的技能\n\n提示: 使用 "*" 查看适用于所有系统的技能`
      }

      let output = `🖥️  系统: ${systemId.toUpperCase()}\n`
      output += `${'═'.repeat(60)}\n`
      output += `共 ${filtered.length} 个适用技能\n\n`

      filtered.forEach((skill, idx) => {
        const statusEmoji = skill.enabled ? '✅' : '⭕'
        output += `${idx + 1}. ${statusEmoji} ${skill.id}\n`
        output += `   名称: ${skill.name}\n`
        output += `   描述: ${skill.description}\n`
        output += `   类别: ${skill.category}\n\n`
      })

      return output
    }
  },
  'skill-search': {
    description: '搜索技能',
    usage: 'skill-search [keyword]',
    handler: async (args?: string[]) => {
      const keyword = args?.join(' ')
      if (!keyword) {
        return '❌ 请提供搜索关键词\n\n用法: skill-search [keyword]\n\n示例: skill-search CPU'
      }

      const results = searchSkillRules(skillRules, keyword)
      if (results.length === 0) {
        return `❌ 未找到包含 "${keyword}" 的技能\n\n提示: 尝试使用不同的关键词`
      }

      let output = `🔍 搜索结果: "${keyword}"\n`
      output += `${'═'.repeat(60)}\n`
      output += `找到 ${results.length} 个匹配的技能\n\n`

      results.forEach((skill, idx) => {
        const statusEmoji = skill.enabled ? '✅' : '⭕'
        output += `${idx + 1}. ${statusEmoji} ${skill.id}\n`
        output += `   名称: ${skill.name}\n`
        output += `   描述: ${skill.description}\n`
        output += `   类别: ${skill.category}\n`
        output += `   标签: ${skill.tags.join(', ')}\n\n`
      })

      return output
    }
  },
  'skill-history': {
    description: '查看技能执行历史',
    usage: 'skill-history',
    handler: async () => {
      if (skillExecutionHistory.length === 0) {
        return '📜 暂无技能执行历史'
      }

      let output = `📜 技能执行历史\n`
      output += `${'═'.repeat(60)}\n`
      output += `共 ${skillExecutionHistory.length} 条记录\n\n`

      skillExecutionHistory.slice(0, 10).forEach((record, idx) => {
        const statusEmoji = record.status === 'success' ? '✅' : record.status === 'failed' ? '❌' : '⚠️'
        output += `${idx + 1}. ${statusEmoji} ${record.ruleName}\n`
        output += `   执行ID: ${record.executionId}\n`
        output += `   执行时间: ${new Date(record.executedAt).toLocaleString('zh-CN')}\n`
        output += `   置信度: ${(record.confidence * 100).toFixed(0)}%\n`
        output += `   耗时: ${record.totalDuration}ms\n`
        output += `   影响系统: ${record.affectedSystems.join(', ')}\n\n`
      })

      if (skillExecutionHistory.length > 10) {
        output += `... 还有 ${skillExecutionHistory.length - 10} 条记录\n`
      }

      return output
    }
  },
  'skill-templates': {
    description: '查看技能模板',
    usage: 'skill-templates',
    handler: async () => {
      let output = `📋 技能模板库\n`
      output += `${'═'.repeat(60)}\n`
      output += `共 ${skillTemplates.length} 个模板\n\n`

      // 按类别分组
      const templatesByCategory: Record<string, typeof skillTemplates> = {}
      skillTemplates.forEach(template => {
        if (!templatesByCategory[template.category]) {
          templatesByCategory[template.category] = []
        }
        templatesByCategory[template.category].push(template)
      })

      Object.entries(templatesByCategory).forEach(([category, templates]) => {
        const categoryEmoji = {
          performance: '⚡',
          integration: '🔗',
          availability: '✅',
          security: '🔒',
          capacity: '📊',
          network_block: '🌐'
        }[category] || '📦'

        output += `${categoryEmoji} ${category.toUpperCase()} (${templates.length}个)\n`
        output += `${'─'.repeat(60)}\n`

        templates.forEach(template => {
          output += `• ${template.id}\n`
          output += `  名称: ${template.name}\n`
          output += `  描述: ${template.description}\n`
          output += `  使用次数: ${template.usageCount}\n`
          output += `  用例:\n`
          template.useCases.forEach(useCase => {
            output += `    - ${useCase}\n`
          })
          output += `\n`
        })
      })

      return output
    }
  }
}

// Process AI command
async function processAICommand(command: any, input: string): Promise<string> {
  if (!command) {
    return '抱歉，我没有理解您的请求。您可以输入 "help" 查看可用命令。'
  }

  const response = generateResponse(command, input)

  // Return formatted response
  return response.content
}

// Handle input submit
async function handleSubmit() {
  if (!currentInput.value.trim() || isProcessing.value) return

  const input = currentInput.value.trim()
  currentInput.value = ''

  // Add to history
  commandHistory.value.push(input)
  historyIndex.value = commandHistory.value.length

  // Add command message
  const commandMsg: TerminalMessage = {
    id: `msg-${Date.now()}`,
    type: 'command',
    content: input,
    timestamp: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  }
  messages.value.push(commandMsg)
  trimMessages() // 限制消息数量

  // Process command
  isProcessing.value = true
  await nextTick()
  scrollToBottom()

  const startTime = Date.now()

  try {
    // Check if it's a built-in command
    const cmdParts = input.split(' ')
    const cmdName = cmdParts[0].toLowerCase()
    const args = cmdParts.slice(1)
    const builtInCmd = builtInCommands[cmdName as keyof typeof builtInCommands]

    let response: string

    if (builtInCmd) {
      response = await builtInCmd.handler(args.length > 0 ? args : undefined)
    } else {
      // Use AI natural language processing
      const command = parseCommand(input)
      response = await processAICommand(command, input)
    }

    const duration = Date.now() - startTime

    // Add response message
    if (response) {
      const responseMsg: TerminalMessage = {
        id: `msg-${Date.now()}`,
        type: 'response',
        content: response,
        timestamp: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        metadata: { duration }
      }
      messages.value.push(responseMsg)
      trimMessages() // 限制消息数量
    }
  } catch (error) {
    const errorMsg: TerminalMessage = {
      id: `msg-${Date.now()}`,
      type: 'error',
      content: `错误: ${error instanceof Error ? error.message : '未知错误'}`,
      timestamp: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    }
    messages.value.push(errorMsg)
    trimMessages() // 限制消息数量
  } finally {
    isProcessing.value = false
    await nextTick()
    scrollToBottom()
  }
}

// Handle keyboard events
function handleKeydown(event: KeyboardEvent) {
  // Navigate history with up/down arrows
  if (event.key === 'ArrowUp') {
    event.preventDefault()
    if (historyIndex.value > 0) {
      historyIndex.value--
      currentInput.value = commandHistory.value[historyIndex.value]
    }
  } else if (event.key === 'ArrowDown') {
    event.preventDefault()
    if (historyIndex.value < commandHistory.value.length - 1) {
      historyIndex.value++
      currentInput.value = commandHistory.value[historyIndex.value]
    } else {
      historyIndex.value = commandHistory.value.length
      currentInput.value = ''
    }
  } else if (event.key === 'Enter') {
    event.preventDefault()
    handleSubmit()
  } else if (event.key === 'l' && event.ctrlKey) {
    // Ctrl+L to clear
    event.preventDefault()
    messages.value = []
  }
}

// Scroll to bottom
function scrollToBottom() {
  if (terminalRef.value) {
    terminalRef.value.scrollTop = terminalRef.value.scrollHeight
  }
}

// Focus input
function focusInput() {
  inputRef.value?.focus()
}

// Get message type class
function getMessageClass(type: string): string {
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

// Format content with syntax highlighting
function formatContent(content: string, type: string): string {
  if (type === 'command') {
    return `<span class="terminal-prompt">$</span> ${content}`
  }
  return content
}

// Lifecycle
onMounted(() => {
  // Welcome message
  const welcomeMsg: TerminalMessage = {
    id: 'welcome',
    type: 'system',
    content: `🌷 Spring-themed Operations Assistant Terminal
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

欢迎使用运维助手终端 v1.0.0

支持的交互方式:
  • 自然语言: 直接输入问题，如 "查看系统状态"
  • 命令行: 输入命令，如 "analyze" 或 "status"
  • 输入 "help" 查看所有可用命令

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
    timestamp: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  }
  messages.value.push(welcomeMsg)

  // Focus input on mount
  focusInput()
})

// Auto-scroll when messages change
watch(messages, () => {
  nextTick(() => {
    scrollToBottom()
  })
}, { deep: true })
</script>

<template>
  <div class="terminal-container" @click="focusInput">
    <!-- Header -->
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

    <!-- Terminal Output -->
    <div ref="terminalRef" class="terminal-output">
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
        <div
          class="message-content"
          v-html="formatContent(message.content, message.type)"
        ></div>
      </div>

      <!-- Processing indicator -->
      <div v-if="isProcessing" class="terminal-processing">
        <span class="processing-spinner"></span>
        <span>正在处理...</span>
      </div>
    </div>

    <!-- Input Area -->
    <div class="terminal-input-area">
      <div class="input-prompt">
        <ChevronRight :size="18" class="prompt-icon" />
      </div>
      <input
        ref="inputRef"
        v-model="currentInput"
        type="text"
        class="terminal-input"
        placeholder="输入命令或自然语言问题..."
        @keydown="handleKeydown"
        :disabled="isProcessing"
      />
      <button
        class="send-button"
        @click="handleSubmit"
        :disabled="!currentInput.trim() || isProcessing"
      >
        <Send :size="16" />
      </button>
    </div>
  </div>
</template>

<style scoped>
.terminal-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: #1e1e1e;
  border-radius: var(--border-radius-lg);
  overflow: hidden;
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
}

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

.terminal-output {
  flex: 1;
  overflow-y: auto;
  padding: var(--spacing-lg);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
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

.terminal-message-command .message-content {
  color: #ffffff;
  font-weight: 600;
}

.terminal-prompt {
  color: #8BC34A;
  font-weight: 700;
  margin-right: 8px;
}

.terminal-message-response .message-content {
  color: #cccccc;
}

.terminal-message-system .message-content {
  color: #569cd6;
  font-style: italic;
}

.terminal-message-error .message-content {
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

/* Syntax highlighting for special characters */
.terminal-message-command :deep(.terminal-prompt) {
  color: #8BC34A;
  font-weight: 700;
}
</style>
