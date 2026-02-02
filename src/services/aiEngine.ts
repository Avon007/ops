/**
 * AI Assistant Rule Engine for Information System Operations
 * 信息系统运维助手 - 自然语言规则引擎
 */

import type { Command, ChatMessage } from '@/types'
import { infoSystems, systemLogs, networkPackets, integrationCalls } from '@/mock/data'
import {
  securityDevices,
  securityRules,
  blockedConnections,
  portBlockIssues,
  networkDiagnostics,
  securitySystemLogs
} from '@/mock/data'
import { analyzeSystemFaults, formatSystemDiagnosisReport } from './systemFaultAnalysis'
import { performFullAnalysis, formatAnalysisResult, performRootCauseAnalysis } from './dataAnalysis'
import { serviceMetrics, dependencyGraph, capacityForecasts, slaMetrics } from '@/mock/monitoringData'
import { skillRules, skillExecutionHistory } from '@/mock/skillLibrary'
import { executeSkillRule, executeAllSkillRules, searchSkillRules } from './skillEngine'

/**
 * 解析用户输入，提取命令
 */
export function parseCommand(input: string): Command | null {
  const normalizedInput = input.toLowerCase().trim()

  // 命令规则匹配
  const patterns = [
    {
      type: 'analyze' as const,
      patterns: [
        /分析.*故障|故障分析|系统诊断|diagnose|analyze/i,
        /检查.*问题|问题排查|问题诊断/i,
        /生成.*报告|诊断报告/i,
        /系统集成|集成.*问题/i,
        /数据.*一致|一致性.*检查/i
      ]
    },
    {
      type: 'data_analysis' as const,
      patterns: [
        /全链路.*分析|链路.*追踪|full.*link|trace.*analysis/i,
        /性能.*分析|performance.*analysis/i,
        /容量.*分析|capacity.*analysis/i,
        /瓶颈.*分析|bottleneck/i,
        /数据.*洞察|data.*insight/i,
        /智能.*分析|smart.*analysis/i,
        /根因.*分析|root.*cause/i
      ]
    },
    {
      type: 'capacity' as const,
      patterns: [
        /容量.*规划|capacity.*planning/i,
        /资源.*预测|resource.*forecast/i,
        /扩容.*建议|scale.*recommendation/i
      ]
    },
    {
      type: 'sla' as const,
      patterns: [
        /SLA|服务等级|service.*level/i,
        /可用性.*分析|availability/i
      ]
    },
    {
      type: 'topology' as const,
      patterns: [
        /依赖.*拓扑|dependency.*graph/i,
        /系统.*架构|system.*architecture/i,
        /调用.*链路|call.*chain/i
      ]
    },
    {
      type: 'status' as const,
      patterns: [
        /查看.*状态|检查.*状态|系统状态|health check|status/i,
        /怎么样|如何|健康/i
      ]
    },
    {
      type: 'help' as const,
      patterns: [/帮助|help|能做什么|怎么用/i]
    },
    {
      type: 'port_block' as const,
      patterns: [
        /端口.*阻塞|port.*block|端口.*不可达/i,
        /端口.*检测|端口.*扫描|port.*scan/i,
        /连接.*被拒|connection.*refused|连接.*超时|connection.*timeout/i,
        /防火墙.*阻断|firewall.*block/i,
        /安全.*隔离|security.*gateway/i,
        /网络.*不通|网络.*问题/i
      ]
    },
    {
      type: 'security' as const,
      patterns: [
        /安全.*设备|security.*device/i,
        /安全.*规则|security.*rule|防火墙.*规则/i,
        /阻断.*连接|blocked.*connection|被.*阻断/i,
        /IPS|IDS|WAF|防火墙/i,
        /SQL注入|sql.*injection|攻击.*检测/i
      ]
    },
    {
      type: 'skill' as const,
      patterns: [
        /技能库|skill.*library|专家技能/i,
        /我的技能|查看技能|list.*skills/i,
        /技能规则|skill.*rules/i
      ]
    },
    {
      type: 'execute_skills' as const,
      patterns: [
        /执行.*技能|execute.*skill|运行.*技能/i,
        /触发.*技能|trigger.*skill/i
      ]
    }
  ]

  for (const commandType of patterns) {
    for (const pattern of commandType.patterns) {
      if (pattern.test(normalizedInput)) {
        // 提取目标系统
        const systemMatch = input.match(
          /ERP|CRM|OA|数据中台|支付网关|MES|WMS/i
        )

        return {
          type: commandType.type,
          target: systemMatch ? systemMatch[0] : undefined,
          params: { originalInput: input }
        }
      }
    }
  }

  return null
}

/**
 * 生成助手响应
 */
export function generateResponse(
  command: Command | null,
  userInput: string
): ChatMessage {
  const timestamp = new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })

  if (!command) {
    return {
      id: `msg-${Date.now()}`,
      role: 'assistant',
      content: '抱歉，我没有理解您的请求。您可以尝试：\n• "全链路数据分析"\n• "分析系统集成故障"\n• "容量规划"\n• "查看系统状态"\n• "帮助"',
      timestamp
    }
  }

  switch (command.type) {
    case 'data_analysis':
      return handleDataAnalysisCommand(command, timestamp)

    case 'capacity':
      return handleCapacityCommand(command, timestamp)

    case 'sla':
      return handleSLACommand(command, timestamp)

    case 'topology':
      return handleTopologyCommand(command, timestamp)

    case 'analyze':
      return handleAnalyzeCommand(command, timestamp)

    case 'status':
      return handleStatusCommand(command, timestamp)


    case 'help':
      return {
        id: `msg-${Date.now()}`,
        role: 'assistant',
        content: getHelpMessage(),
        timestamp
      }

    case 'skill':
      return handleSkillCommand(command, timestamp)

    case 'execute_skills':
      return handleExecuteSkillsCommand(command, timestamp)

    case 'port_block':
      return handlePortBlockCommand(command, timestamp)

    case 'security':
      return handleSecurityCommand(command, timestamp)

    default:
      return {
        id: `msg-${Date.now()}`,
        role: 'assistant',
        content: '抱歉，我还在学习中。请尝试更明确的指令。',
        timestamp
      }
  }
}

/**
 * 处理全链路数据分析命令
 */
function handleDataAnalysisCommand(command: Command, timestamp: string): ChatMessage {
  // 执行数据分析
  const result = performFullAnalysis()

  // 格式化结果
  const formattedResult = formatAnalysisResult(result)

  return {
    id: `msg-${Date.now()}`,
    role: 'assistant',
    content: formattedResult,
    timestamp
  }
}

/**
 * 处理容量规划命令
 */
function handleCapacityCommand(command: Command, timestamp: string): ChatMessage {
  let response = `📊 容量规划分析报告\n`
  response += `${'═'.repeat(60)}\n\n`

  capacityForecasts.forEach(forecast => {
    response += `🖥️  ${forecast.systemName}\n`
    response += `${'─'.repeat(60)}\n`
    response += `指标类型: ${forecast.metricType.toUpperCase()}\n`
    response += `当前值: ${forecast.currentValue}%\n\n`

    if (forecast.predictedExhaustionDate) {
      response += `⚠️  预计耗尽日期: ${forecast.predictedExhaustionDate}\n\n`
    }

    response += `📈 预测趋势:\n`
    forecast.forecastData.slice(0, 5).forEach(point => {
      const bar = '█'.repeat(Math.round(point.predictedValue / 10))
      response += `  ${point.date}: ${bar} ${point.predictedValue}% (置信度: ${(point.confidence * 100).toFixed(0)}%)\n`
    })
    response += `\n`

    response += `💡 建议操作:\n`
    forecast.recommendedActions.forEach(action => {
      response += `  • ${action}\n`
    })
    response += `\n`
  })

  return {
    id: `msg-${Date.now()}`,
    role: 'assistant',
    content: response,
    timestamp
  }
}

/**
 * 处理SLA查询命令
 */
function handleSLACommand(command: Command, timestamp: string): ChatMessage {
  let response = `📋 SLA服务等级报告\n`
  response += `${'═'.repeat(60)}\n\n`

  slaMetrics.forEach(sla => {
    const statusEmoji = sla.status === 'compliant' ? '✅' : sla.status === 'warning' ? '⚠️' : '🔴'
    response += `${statusEmoji} ${sla.serviceName}\n`
    response += `${'─'.repeat(60)}\n`
    response += `SLA目标: ${sla.slaTarget}%\n`
    response += `当前值: ${sla.currentValue}%\n`
    response += `状态: ${sla.status.toUpperCase()}\n`
    response += `考核周期: ${sla.measurementPeriod}\n`

    if (sla.incidents.length > 0) {
      response += `\n事故记录 (${sla.incidents.length}次):\n`
      sla.incidents.forEach(incident => {
        response += `  • ${new Date(incident.timestamp).toLocaleString('zh-CN')}\n`
        response += `    持续时间: ${Math.floor(incident.duration / 60)}分钟\n`
        response += `    影响: ${incident.impact}\n`
        response += `    描述: ${incident.description}\n`
      })
    }
    response += `\n`
  })

  return {
    id: `msg-${Date.now()}`,
    role: 'assistant',
    content: response,
    timestamp
  }
}

/**
 * 处理依赖拓扑查询命令
 */
function handleTopologyCommand(command: Command, timestamp: string): ChatMessage {
  let response = `🔗 系统依赖拓扑图\n`
  response += `${'═'.repeat(60)}\n\n`

  // 统计节点状态
  const healthyNodes = dependencyGraph.nodes.filter(n => n.status === 'healthy').length
  const warningNodes = dependencyGraph.nodes.filter(n => n.status === 'warning').length
  const errorNodes = dependencyGraph.nodes.filter(n => n.status === 'error').length

  response += `节点状态: ✅${healthyNodes}  ⚠️${warningNodes}  🔴${errorNodes}\n\n`

  // 显示系统节点
  response += `📦 系统节点\n`
  response += `${'─'.repeat(60)}\n`
  dependencyGraph.nodes.forEach(node => {
    const statusEmoji = node.status === 'healthy' ? '✅' : node.status === 'warning' ? '⚠️' : '🔴'
    response += `${statusEmoji} ${node.name} [${node.type}]\n`
    response += `   请求: ${node.metrics.requestCount}/5m | 错误率: ${node.metrics.errorRate}% | 延迟: ${node.metrics.avgLatency}ms\n`
  })

  response += `\n🔗 集成关系\n`
  response += `${'─'.repeat(60)}\n`

  const healthyEdges = dependencyGraph.edges.filter(e => e.status === 'healthy').length
  const warningEdges = dependencyGraph.edges.filter(e => e.status === 'warning').length
  const errorEdges = dependencyGraph.edges.filter(e => e.status === 'error').length

  response += `健康: ${healthyEdges} | 告警: ${warningEdges} | 错误: ${errorEdges}\n\n`

  // 显示有问题的集成
  const problemEdges = dependencyGraph.edges.filter(e => e.status !== 'healthy')
  if (problemEdges.length > 0) {
    response += `⚠️  问题集成:\n`
    problemEdges.forEach(edge => {
      const sourceNode = dependencyGraph.nodes.find(n => n.id === edge.source)
      const targetNode = dependencyGraph.nodes.find(n => n.id === edge.target)
      const statusEmoji = edge.status === 'warning' ? '⚠️' : '🔴'

      response += `${statusEmoji} ${sourceNode?.name} → ${targetNode?.name} [${edge.type}]\n`
      response += `   请求: ${edge.metrics.requestCount}/5m | 错误率: ${edge.metrics.errorRate}% | 延迟: ${edge.metrics.avgLatency}ms\n`
    })
  }

  return {
    id: `msg-${Date.now()}`,
    role: 'assistant',
    content: response,
    timestamp
  }
}

/**
 * 处理故障分析命令
 */
function handleAnalyzeCommand(command: Command, timestamp: string): ChatMessage {
  // 执行故障分析
  const report = analyzeSystemFaults()

  // 格式化报告
  const formattedReport = formatSystemDiagnosisReport(report)

  return {
    id: `msg-${Date.now()}`,
    role: 'assistant',
    content: formattedReport,
    timestamp,
    analysisResult: report,
    thinkingProcess: report.analysisChain
  }
}

/**
 * 处理状态查询命令
 */
function handleStatusCommand(command: Command, timestamp: string): ChatMessage {
  let response = `📊 信息系统健康状态检查\n`
  response += `${'═'.repeat(50)}\n\n`

  // 统计各系统状态
  const normalSystems = infoSystems.filter(s => s.status === 'normal')
  const degradedSystems = infoSystems.filter(s => s.status === 'degraded')
  const downSystems = infoSystems.filter(s => s.status === 'down')

  response += `✅ 正常运行 (${normalSystems.length}个)\n`
  normalSystems.forEach(sys => {
    response += `   • ${sys.name} (v${sys.version}) - ${sys.owner}\n`
  })

  if (degradedSystems.length > 0) {
    response += `\n⚠️  性能降级 (${degradedSystems.length}个)\n`
    degradedSystems.forEach(sys => {
      response += `   • ${sys.name} (v${sys.version}) - ${sys.owner}\n`
    })
  }

  if (downSystems.length > 0) {
    response += `\n🔴 系统离线 (${downSystems.length}个)\n`
    downSystems.forEach(sys => {
      response += `   • ${sys.name}\n`
    })
  }

  // 统计错误日志
  const errorLogs = systemLogs.filter(l => l.level === 'ERROR')
  const warnLogs = systemLogs.filter(l => l.level === 'WARN')

  response += `\n📋 最近日志统计\n`
  response += `${'─'.repeat(50)}\n`
  response += `ERROR: ${errorLogs.length}条 | WARN: ${warnLogs.length}条\n`

  // 统计失败的集成调用
  const failedCalls = integrationCalls.filter(c => c.status !== 'success')
  response += `失败的集成调用: ${failedCalls.length}次\n\n`

  if (degradedSystems.length > 0 || downSystems.length > 0) {
    response += `是否需要我帮您进行详细的故障分析？`
  }

  return {
    id: `msg-${Date.now()}`,
    role: 'assistant',
    content: response,
    timestamp
  }
}

/**
 * 获取帮助信息
 */
function getHelpMessage(): string {
  return `我是您的信息系统运维助手，可以协助您进行多系统集化的故障诊断和数据分析。

🔍 故障分析与诊断
  • "分析系统集成故障" - 完整的系统集成故障分析
  • "生成诊断报告" - 详细的诊断报告（含CoT分析过程）

📊 数据分析与监控
  • "全链路数据分析" - 完整的性能和容量分析
  • "容量规划" - 资源预测和扩容建议
  • "SLA查询" - 服务等级协议执行情况
  • "依赖拓扑" - 系统间调用关系图
  • "性能瓶颈分析" - 识别性能瓶颈
  • "根因分析" - 深入分析问题根源

📋 状态查询
  • "查看系统状态" - 所有信息系统的健康状态
  • "追踪业务事务" - 失败的事务和调用链

🧠 专家技能库
  • "技能库" - 查看所有专家诊断技能
  • "执行技能 [名称]" - 执行特定的诊断技能
  • "执行所有技能" - 批量执行所有启用的技能

🔌 安全与网络
  • "端口阻塞" - 诊断端口阻塞和网络不通问题
  • "安全设备" - 查看安全隔离装置状态
  • "防火墙" - 查看防火墙规则和阻断记录
  • "网络不通" - 诊断网络连接问题

💡 核心能力
  • 多格式日志解析（JSON、XML、CSV、Syslog）
  • 全链路追踪和性能分析
  • 智能容量预测和规划
  • 自动化根因分析
  • 依赖关系可视化
  • 专家技能知识库 - 存储和复用诊断经验
  • 安全隔离装置管理 - 防火墙、IPS、WAF
  • 端口阻塞诊断 - 网络连接问题排查

现在就试试输入"全链路数据分析"、"端口阻塞"或"技能库"吧！`
}

/**
 * 处理技能库查询命令
 */
function handleSkillCommand(command: Command, timestamp: string): ChatMessage {
  let response = `📚 专家技能知识库\n`
  response += `${'═'.repeat(60)}\n\n`

  const enabledRules = skillRules.filter(rule => rule.enabled)
  const categories = ['performance', 'availability', 'integration', 'security', 'capacity', 'network_block']

  response +=`📊 技能统计\n`
  response += `${'─'.repeat(60)}\n`
  response += `总技能数: ${skillRules.length}\n`
  response += `启用技能: ${enabledRules.length}\n`
  response += `禁用技能: ${skillRules.length - enabledRules.length}\n`
  response += `总执行次数: ${skillRules.reduce((sum, r) => sum + r.executionCount, 0)}\n\n`

  response += `📋 技能列表\n`
  response += `${'─'.repeat(60)}\n\n`

  for (const category of categories) {
    const categoryRules = skillRules.filter(r => r.category === category && r.enabled)

    if (categoryRules.length > 0) {
      const categoryNames: Record<string, string> = {
        performance: '性能',
        availability: '可用性',
        integration: '集成',
        security: '安全',
        capacity: '容量',
        network_block: '网络'
      }

      response += `🔹 ${categoryNames[category]} (${categoryRules.length}个)\n`

      for (const rule of categoryRules) {
        const statusEmoji = rule.enabled ? '✅' : '❌'
        response += `  ${statusEmoji} ${rule.name}\n`
        response += `     创建者: ${rule.creatorName} | 执行: ${rule.executionCount}次 | 成功率: ${rule.executionCount > 0 ? ((rule.successCount / rule.executionCount) * 100).toFixed(0) : 0}%\n`

        if (rule.lastExecutedAt) {
          response += `     最后执行: ${new Date(rule.lastExecutedAt).toLocaleString('zh-CN')}\n`
        }
      }

      response += `\n`
    }
  }

  response += `💡 提示:\n`
  response += `• 访问 /skills 查看完整的技能库管理界面\n`
  response += `• 使用"执行技能 [技能名称]"来执行特定技能\n`
  response += `• 使用"执行所有技能"来批量执行启用的技能`

  return {
    id: `msg-${Date.now()}`,
    role: 'assistant',
    content: response,
    timestamp
  }
}

/**
 * 处理执行技能命令
 */
function handleExecuteSkillsCommand(command: Command, timestamp: string): ChatMessage {
  const input = command.params?.originalInput?.toLowerCase() || ''

  // 执行所有技能
  if (input.includes('所有') || input.includes('all') || input.includes('批量')) {
    const results = executeAllSkillRules(skillRules)

    let response = `🚀 批量执行技能规则\n`
    response += `${'═'.repeat(60)}\n\n`

    response += `执行完成: ${results.length} 个技能\n\n`

    let successCount = 0
    let failedCount = 0

    for (const result of results) {
      const statusEmoji = result.status === 'success' ? '✅' : result.status === 'failed' ? '❌' : '⚠️'

      if (result.status === 'success') successCount++
      else if (result.status === 'failed') failedCount++

      response += `${statusEmoji} ${result.ruleName}\n`
      response += `   置信度: ${(result.confidence * 100).toFixed(0)}% | 耗时: ${(result.totalDuration / 1000).toFixed(1)}s\n`

      if (result.summary) {
        response += `   ${result.summary.substring(0, 100)}...\n`
      }

      response += `\n`
    }

    response += `📊 统计:\n`
    response += `成功: ${successCount} | 失败: ${failedCount} | 部分成功: ${results.length - successCount - failedCount}\n`

    return {
      id: `msg-${Date.now()}`,
      role: 'assistant',
      content: response,
      timestamp
    }
  }

  // 搜索并执行特定技能
  const searchTerm = input.replace(/执行.*技能|运行.*技能|execute.*skill|trigger.*skill/gi, '').trim()

  if (searchTerm) {
    const matchedRules = searchSkillRules(skillRules, searchTerm)

    if (matchedRules.length === 0) {
      return {
        id: `msg-${Date.now()}`,
        role: 'assistant',
        content: `未找到匹配 "${searchTerm}" 的技能规则。\n\n您可以:\n• 使用"技能库"查看所有可用技能\n• 使用"执行所有技能"批量执行`,
        timestamp
      }
    }

    if (matchedRules.length === 1) {
      const result = executeSkillRule(matchedRules[0])

      let response = `🎯 执行技能: ${result.ruleName}\n`
      response += `${'═'.repeat(60)}\n\n`
      response += `状态: ${result.status === 'success' ? '✅ 成功' : result.status === 'failed' ? '❌ 失败' : '⚠️ 部分成功'}\n`
      response += `置信度: ${(result.confidence * 100).toFixed(0)}%\n`
      response += `耗时: ${(result.totalDuration / 1000).toFixed(1)}s\n\n`

      if (result.summary) {
        response += `📋 执行摘要:\n${result.summary}\n\n`
      }

      if (result.diagnosisResults.length > 0) {
        response += `🔍 诊断步骤:\n`
        for (const diagnosis of result.diagnosisResults) {
          const stepStatus = diagnosis.status === 'success' ? '✅' : diagnosis.status === 'failed' ? '❌' : '⏭️'
          response += `  ${stepStatus} ${diagnosis.stepName} (${(diagnosis.duration / 1000).toFixed(1)}s)\n`
        }
        response += `\n`
      }

      if (result.actionResults.length > 0) {
        response += `⚡ 执行动作:\n`
        for (const action of result.actionResults) {
          const actionStatus = action.status === 'success' ? '✅' : action.status === 'failed' ? '❌' : '⏳'
          response += `  ${actionStatus} ${action.actionName}\n`
        }
        response += `\n`
      }

      if (result.recommendations && result.recommendations.length > 0) {
        response += `💡 建议:\n`
        for (const rec of result.recommendations) {
          response += `  • ${rec}\n`
        }
      }

      return {
        id: `msg-${Date.now()}`,
        role: 'assistant',
        content: response,
        timestamp
      }
    }

    // 多个匹配
    let response = `找到 ${matchedRules.length} 个匹配的技能:\n\n`

    for (const rule of matchedRules) {
      const statusEmoji = rule.enabled ? '✅' : '❌'
      response += `${statusEmoji} ${rule.name}\n`
      response += `   ${rule.description}\n\n`
    }

    response += `请指定更具体的技能名称来执行。`

    return {
      id: `msg-${Date.now()}`,
      role: 'assistant',
      content: response,
      timestamp
    }
  }

  // 默认执行所有启用的技能
  return handleSkillCommand(command, timestamp)
}

/**
 * 处理端口阻塞诊断命令
 */
function handlePortBlockCommand(command: Command, timestamp: string): ChatMessage {
  let response = `🔌 端口阻塞诊断报告\n`
  response += `${'═'.repeat(60)}\n\n`

  // 统计信息
  const activeIssues = portBlockIssues.filter(p => !p.resolved)
  const criticalIssues = activeIssues.filter(p => p.severity === 'critical' || p.status === 'blocked')

  response += `📊 问题统计\n`
  response += `${'─'.repeat(60)}\n`
  response += `总问题数: ${portBlockIssues.length}\n`
  response += `未解决: ${activeIssues.length}\n`
  response += `已解决: ${portBlockIssues.length - activeIssues.length}\n`
  response += `严重问题: ${criticalIssues.length}\n\n`

  // 显示活跃的端口阻塞问题
  if (activeIssues.length > 0) {
    response += `🚨 活跃的端口阻塞问题\n`
    response += `${'─'.repeat(60)}\n\n`

    for (const issue of activeIssues) {
      const statusEmoji = issue.status === 'blocked' ? '🔴' : issue.status === 'filtered' ? '🟡' : '⚠️'

      response += `${statusEmoji} ${issue.systemName} - ${issue.portNumber}/${issue.protocol}\n`
      response += `   状态: ${issue.status.toUpperCase()}\n`
      response += `   端口类型: ${issue.portType}\n`
      response += `   阻塞原因: ${issue.blockReason}\n`
      response += `   影响服务: ${issue.affectedService}\n`
      response += `   检测方式: ${issue.detectionMethod}\n`

      if (issue.relatedDevices && issue.relatedDevices.length > 0) {
        const device = securityDevices.find(d => d.id === issue.relatedDevices[0])
        response += `   相关设备: ${device ? device.name : issue.relatedDevices[0]}\n`
      }

      response += `\n`

      if (issue.suggestedActions && issue.suggestedActions.length > 0) {
        response += `   💡 建议操作:\n`
        issue.suggestedActions.forEach(action => {
          response += `      • ${action}\n`
        })
        response += `\n`
      }
    }
  }

  // 显示被阻断的连接统计
  const recentBlocks = blockedConnections.slice(0, 5)
  if (recentBlocks.length > 0) {
    response += `🔗 最近的阻断连接\n`
    response += `${'─'.repeat(60)}\n\n`

    for (const block of recentBlocks) {
      const severityEmoji = block.severity === 'critical' ? '🔴' : '⚠️'

      response += `${severityEmoji} ${block.deviceName}\n`
      response += `   规则: ${block.ruleName}\n`
      response += `   连接: ${block.sourceIp}:${block.sourcePort} → ${block.destinationIp}:${block.destinationPort}\n`
      response += `   协议: ${block.protocol}\n`
      response += `   原因: ${block.blockReason}\n`
      response += `   尝试次数: ${block.attemptCount}\n`
      response += `   首次: ${new Date(block.firstAttempt).toLocaleString('zh-CN')}\n`
      response += `   最后: ${new Date(block.lastAttempt).toLocaleString('zh-CN')}\n\n`
    }
  }

  // 相关日志
  const relatedLogs = securitySystemLogs.filter(l =>
    l.level === 'ERROR' || l.level === 'WARN'
  ).slice(0, 3)

  if (relatedLogs.length > 0) {
    response += `📋 相关日志\n`
    response += `${'─'.repeat(60)}\n\n`

    for (const log of relatedLogs) {
      const levelEmoji = log.level === 'ERROR' ? '🔴' : '⚠️'
      response += `${levelEmoji} [${log.systemName}] ${new Date(log.timestamp).toLocaleString('zh-CN')}\n`
      response += `   ${log.parsed?.message || log.raw.substring(0, 100)}\n\n`
    }
  }

  response += `💡 提示:\n`
  response += `• 使用 "安全设备" 查看安全隔离装置详情\n`
  response += `• 使用 "安全规则" 查看防火墙规则配置\n`
  response += `• 严重端口阻塞需要立即处理`

  return {
    id: `msg-${Date.now()}`,
    role: 'assistant',
    content: response,
    timestamp
  }
}

/**
 * 处理安全设备查询命令
 */
function handleSecurityCommand(command: Command, timestamp: string): ChatMessage {
  let response = `🛡️  安全隔离装置状态\n`
  response += `${'═'.repeat(60)}\n\n`

  // 设备统计
  const onlineDevices = securityDevices.filter(d => d.status === 'online')
  const degradedDevices = securityDevices.filter(d => d.status === 'degraded')
  const offlineDevices = securityDevices.filter(d => d.status === 'offline')

  response += `📊 设备状态统计\n`
  response += `${'─'.repeat(60)}\n`
  response += `总设备数: ${securityDevices.length}\n`
  response += `在线: ${onlineDevices.length}\n`
  response += `降级: ${degradedDevices.length}\n`
  response += `离线: ${offlineDevices.length}\n\n`

  // 设备详情
  response += `🖥️  安全设备列表\n`
  response += `${'─'.repeat(60)}\n\n`

  for (const device of securityDevices) {
    const statusEmoji = device.status === 'online' ? '🟢' : device.status === 'degraded' ? '🟡' : '🔴'

    response += `${statusEmoji} ${device.name}\n`
    response += `   类型: ${device.type.toUpperCase()}\n`
    response += `   厂商: ${device.vendor} ${device.model}\n`
    response += `   IP: ${device.ipAddress}\n`
    response += `   状态: ${device.status.toUpperCase()}\n`

    if (device.rules && device.rules.length > 0) {
      const enabledRules = device.rules.filter(r => r.enabled).length
      response += `   规则: ${enabledRules}/${device.rules.length} (启用/总数)\n`
    }

    if (device.blockedConnections && device.blockedConnections.length > 0) {
      response += `   阻断连接: ${device.blockedConnections.length}\n`
    }

    response += `\n`
  }

  // 安全规则统计
  const enabledRules = securityRules.filter(r => r.enabled).length
  const highHitRules = securityRules.filter(r => r.hitCount > 1000)

  response += `📋 安全规则统计\n`
  response += `${'─'.repeat(60)}\n`
  response += `总规则数: ${securityRules.length}\n`
  response += `启用规则: ${enabledRules}\n`
  response += `高频规则(>1000次): ${highHitRules.length}\n\n`

  // 显示高频规则
  if (highHitRules.length > 0) {
    response += `🔥 高频命中规则\n`
    response += `${'─'.repeat(60)}\n\n`

    for (const rule of highHitRules.slice(0, 5)) {
      const typeEmoji = rule.ruleType === 'allow' ? '✅' : rule.ruleType === 'deny' ? '🚫' : '👁️'

      response += `${typeEmoji} ${rule.name} [${rule.ruleId}]\n`
      response += `   类型: ${rule.ruleType.toUpperCase()}\n`
      response += `   方向: ${rule.direction}\n`
      response += `   命中次数: ${rule.hitCount}\n`
      response += `   最后命中: ${new Date(rule.lastHit).toLocaleString('zh-CN')}\n\n`
    }
  }

  // 被阻断连接统计
  const criticalBlocks = blockedConnections.filter(b => b.severity === 'critical')

  response += `🚫 阻断连接统计\n`
  response += `${'─'.repeat(60)}\n`
  response += `总阻断数: ${blockedConnections.length}\n`
  response += `严重阻断: ${criticalBlocks.length}\n`
  response += `警告阻断: ${blockedConnections.filter(b => b.severity === 'warning').length}\n\n`

  // 显示最近的严重阻断
  if (criticalBlocks.length > 0) {
    response += `🔴 严重阻断事件\n`
    response += `${'─'.repeat(60)}\n\n`

    for (const block of criticalBlocks.slice(0, 3)) {
      response += `🚫 ${block.ruleName}\n`
      response += `   来源: ${block.sourceIp}:${block.sourcePort}\n`
      response += `   目标: ${block.destinationIp}:${block.destinationPort}\n`
      response += `   原因: ${block.blockReason}\n`
      response += `   尝试: ${block.attemptCount}次\n`
      response += `   时间: ${new Date(block.timestamp).toLocaleString('zh-CN')}\n\n`
    }
  }

  response += `💡 提示:\n`
  response += `• 使用 "端口阻塞" 查看端口阻塞详情\n`
  response += `• 使用 "help" 查看所有可用命令`

  return {
    id: `msg-${Date.now()}`,
    role: 'assistant',
    content: response,
    timestamp
  }
}
