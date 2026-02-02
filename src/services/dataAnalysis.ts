/**
 * Data Analysis Assistant Service
 * 数据分析助手 - 全链路监测和智能分析服务
 */

import type {
  Trace,
  ServiceMetrics,
  DependencyGraph,
  Insight,
  AnalysisResult,
  PerformanceBottleneck,
  RootCauseAnalysis,
  CapacityRecommendation
} from '@/types'
import {
  traces,
  serviceMetrics,
  dependencyGraph,
  insights,
  capacityForecasts,
  slaMetrics,
  alerts,
  changeRecords
} from '@/mock/monitoringData'

// ==================== 数据分析结果类型 ====================
export interface AnalysisResult {
  timestamp: string
  summary: string
  overallHealth: 'excellent' | 'good' | 'warning' | 'critical'
  keyFindings: KeyFinding[]
  bottlenecks: PerformanceBottleneck[]
  recommendations: Recommendation[]
  relatedInsights: Insight[]
}

export interface KeyFinding {
  category: 'performance' | 'reliability' | 'capacity' | 'integration'
  severity: 'info' | 'warning' | 'critical'
  title: string
  description: string
  metrics: string[]
  impact: string
}

export interface PerformanceBottleneck {
  system: string
  operation: string
  type: 'latency' | 'error' | 'resource' | 'dependency'
  currentValue: number
  baselineValue: number
  impactLevel: 'high' | 'medium' | 'low'
  description: string
  suggestedActions: string[]
}

export interface Recommendation {
  priority: 'urgent' | 'high' | 'medium' | 'low'
  category: string
  title: string
  description: string
  expectedBenefit: string
  effort: 'quick' | 'medium' | 'significant'
}

export interface RootCauseAnalysis {
  incidentId: string
  timestamp: string
  description: string
  rootCause: string
  contributingFactors: string[]
  timeline: TimelineEvent[]
  evidence: Evidence[]
  relatedChanges: string[]
}

export interface TimelineEvent {
  timestamp: string
  event: string
  type: 'change' | 'alert' | 'metric' | 'user_action'
}

export interface Evidence {
  type: 'metric' | 'log' | 'trace' | 'change'
  source: string
  description: string
  data: any
}

/**
 * 执行完整的数据分析
 */
export function performFullAnalysis(): AnalysisResult {
  const bottleneckAnalysis = analyzeBottlenecks()
  const trendAnalysis = analyzeTrends()
  const capacityAnalysis = analyzeCapacity()
  const integrationAnalysis = analyzeIntegrations()

  const keyFindings = [
    ...bottleneckAnalysis.findings,
    ...trendAnalysis.findings,
    ...capacityAnalysis.findings,
    ...integrationAnalysis.findings
  ]

  const bottlenecks = [
    ...bottleneckAnalysis.bottlenecks,
    ...integrationAnalysis.bottlenecks
  ]

  const recommendations = [
    ...bottleneckAnalysis.recommendations,
    ...capacityAnalysis.recommendations,
    ...integrationAnalysis.recommendations
  ]

  const overallHealth = calculateOverallHealth(keyFindings)

  return {
    timestamp: new Date().toLocaleString('zh-CN'),
    summary: generateAnalysisSummary(overallHealth, keyFindings),
    overallHealth,
    keyFindings: sortFindingsBySeverity(keyFindings),
    bottlenecks,
    recommendations: sortRecommendationsByPriority(recommendations),
    relatedInsights: insights
  }
}

/**
 * 分析性能瓶颈
 */
function analyzeBottlenecks(): {
  findings: KeyFinding[]
  bottlenecks: PerformanceBottleneck[]
  recommendations: Recommendation[]
} {
  const findings: KeyFinding[] = []
  const bottlenecks: PerformanceBottleneck[] = []
  const recommendations: Recommendation[] = []

  // 分析服务指标
  serviceMetrics.forEach(metric => {
    // CPU瓶颈
    if (metric.cpuUsage > 80) {
      bottlenecks.push({
        system: metric.systemName,
        operation: 'general_processing',
        type: 'resource',
        currentValue: metric.cpuUsage,
        baselineValue: 60,
        impactLevel: metric.cpuUsage > 90 ? 'high' : 'medium',
        description: `${metric.systemName}的CPU使用率为${metric.cpuUsage}%，超出正常水平`,
        suggestedActions: [
          '检查是否有异常进程消耗CPU',
          '考虑增加CPU资源或水平扩展',
          '优化高CPU消耗的代码路径'
        ]
      })

      findings.push({
        category: 'performance',
        severity: metric.cpuUsage > 90 ? 'critical' : 'warning',
        title: `${metric.systemName} CPU使用率过高`,
        description: `CPU使用率达到${metric.cpuUsage}%，${metric.cpuUsage > 90 ? '严重影响系统性能' : '需要关注'}`,
        metrics: [`CPU: ${metric.cpuUsage}%`],
        impact: `影响${metric.activeUsers}个活跃用户`
      })
    }

    // 内存瓶颈
    if (metric.memoryUsage > 85) {
      bottlenecks.push({
        system: metric.systemName,
        operation: 'memory_management',
        type: 'resource',
        currentValue: metric.memoryUsage,
        baselineValue: 70,
        impactLevel: 'medium',
        description: `${metric.systemName}的内存使用率为${metric.memoryUsage}%`,
        suggestedActions: [
          '检查内存泄漏',
          '优化缓存策略',
          '增加内存配置'
        ]
      })
    }

    // 响应时间瓶颈
    if (metric.requestLatency.p95 > 1000) {
      bottlenecks.push({
        system: metric.systemName,
        operation: 'request_processing',
        type: 'latency',
        currentValue: metric.requestLatency.p95,
        baselineValue: 500,
        impactLevel: metric.requestLatency.p95 > 2000 ? 'high' : 'medium',
        description: `${metric.systemName}的P95响应时间为${metric.requestLatency.p95}ms`,
        suggestedActions: [
          '分析慢查询',
          '检查下游系统调用',
          '优化代码逻辑'
        ]
      })

      findings.push({
        category: 'performance',
        severity: metric.requestLatency.p95 > 2000 ? 'critical' : 'warning',
        title: `${metric.systemName}响应时间过长`,
        description: `P95响应时间${metric.requestLatency.p95}ms，${metric.requestLatency.p95 > 2000 ? '严重影响用户体验' : '需要优化'}`,
        metrics: [`P95延迟: ${metric.requestLatency.p95}ms`, `平均延迟: ${metric.requestLatency.avg}ms`],
        impact: `影响${metric.activeUsers}个用户的使用体验`
      })
    }

    // 错误率瓶颈
    if (metric.requestErrorRate > 5) {
      bottlenecks.push({
        system: metric.systemName,
        operation: 'error_handling',
        type: 'error',
        currentValue: metric.requestErrorRate,
        baselineValue: 1,
        impactLevel: metric.requestErrorRate > 10 ? 'critical' : 'high',
        description: `${metric.systemName}的错误率为${metric.requestErrorRate}%`,
        suggestedActions: [
          '立即查看错误日志',
          '检查依赖系统状态',
          '评估是否需要回滚'
        ]
      })

      recommendations.push({
        priority: 'urgent',
        category: '可靠性',
        title: `降低${metric.systemName}错误率`,
        description: `错误率${metric.requestErrorRate}%远超1%的目标`,
        expectedBenefit: '提升系统稳定性和用户满意度',
        effort: 'medium'
      })
    }
  })

  // 分析Trace数据，找出慢操作
  traces.forEach(trace => {
    if (trace.status !== 'success') {
      const slowSpans = trace.spans.filter(s => s.duration > 2000)
      slowSpans.forEach(span => {
        bottlenecks.push({
          system: span.system,
          operation: span.operation,
          type: 'latency',
          currentValue: span.duration,
          baselineValue: 500,
          impactLevel: 'high',
          description: `${span.system}的${span.operation}操作耗时${span.duration}ms`,
          suggestedActions: [
            '查看详细日志',
            '检查依赖系统',
            '优化操作流程'
          ]
        })
      })
    }
  })

  return { findings, bottlenecks, recommendations }
}

/**
 * 分析趋势
 */
function analyzeTrends(): {
  findings: KeyFinding[]
  bottlenecks: PerformanceBottleneck[]
  recommendations: Recommendation[]
} {
  const findings: KeyFinding[] = []
  const bottlenecks: PerformanceBottleneck[] = []
  const recommendations: Recommendation[] = []

  // 分析变更对性能的影响
  const recentChanges = changeRecords.filter(c => c.status === 'completed' && c.type === 'deployment')
  recentChanges.forEach(change => {
    if (change.postChangeMetrics && change.preChangeMetrics) {
      const cpuIncrease = (change.postChangeMetrics.cpuUsage || 0) - (change.preChangeMetrics.cpuUsage || 0)
      const errorIncrease = (change.postChangeMetrics.errorRate || 0) - (change.preChangeMetrics.errorRate || 0)

      if (cpuIncrease > 20 || errorIncrease > 5) {
        findings.push({
          category: 'performance',
          severity: errorIncrease > 5 ? 'critical' : 'warning',
          title: `${change.system}性能下降与变更相关`,
          description: `变更"${change.description}"导致性能显著下降：CPU增加${cpuIncrease}%，错误率增加${errorIncrease}%`,
          metrics: [`CPU增长: +${cpuIncrease}%`, `错误率增长: +${errorIncrease}%`],
          impact: '影响所有依赖该系统的业务流程'
        })

        recommendations.push({
          priority: 'urgent',
          category: '变更管理',
          title: `评估${change.system}的变更回滚`,
          description: `最近的变更导致性能严重下降，建议评估是否回滚`,
          expectedBenefit: '恢复系统性能到变更前水平',
          effort: 'quick'
        })
      }
    }
  })

  return { findings, bottlenecks, recommendations }
}

/**
 * 分析容量
 */
function analyzeCapacity(): {
  findings: KeyFinding[]
  bottlenecks: PerformanceBottleneck[]
  recommendations: Recommendation[]
} {
  const findings: KeyFinding[] = []
  const bottlenecks: PerformanceBottleneck[] = []
  const recommendations: Recommendation[] = []

  capacityForecasts.forEach(forecast => {
    if (forecast.predictedExhaustionDate) {
      const daysUntilExhaustion = Math.floor((new Date(forecast.predictedExhaustionDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))

      findings.push({
        category: 'capacity',
        severity: daysUntilExhaustion < 7 ? 'critical' : 'warning',
        title: `${forecast.systemName}${forecast.metricType === 'cpu' ? 'CPU' : forecast.metricType === 'memory' ? '内存' : forecast.metricType}容量即将耗尽`,
        description: `基于当前增长趋势，${daysUntilExhaustion}天后将达到容量上限`,
        metrics: [`${forecast.metricType}使用率: ${forecast.currentValue}%`, `预计耗尽日期: ${forecast.predictedExhaustionDate}`],
        impact: daysUntilExhaustion < 7 ? '可能导致服务中断' : '影响系统性能和稳定性'
      })

      bottlenecks.push({
        system: forecast.systemName,
        operation: 'capacity_management',
        type: 'resource',
        currentValue: forecast.currentValue,
        baselineValue: 70,
        impactLevel: 'high',
        description: `${forecast.metricType}容量不足，${daysUntilExhaustion}天后将耗尽`,
        suggestedActions: forecast.recommendedActions
      })

      recommendations.push({
        priority: daysUntilExhaustion < 7 ? 'urgent' : 'high',
        category: '容量规划',
        title: `${forecast.systemName}扩容计划`,
        description: `需要在${daysUntilExhaustion}天内完成扩容，避免服务中断`,
        expectedBenefit: '确保系统稳定运行，支持业务增长',
        effort: 'significant'
      })
    }
  })

  return { findings, bottlenecks, recommendations }
}

/**
 * 分析系统集成
 */
function analyzeIntegrations(): {
  findings: KeyFinding[]
  bottlenecks: PerformanceBottleneck[]
  recommendations: Recommendation[]
} {
  const findings: KeyFinding[] = []
  const bottlenecks: PerformanceBottleneck[] = []
  const recommendations: Recommendation[] = []

  // 分析依赖图中的问题边
  dependencyGraph.edges.forEach(edge => {
    if (edge.status !== 'healthy') {
      const sourceNode = dependencyGraph.nodes.find(n => n.id === edge.source)
      const targetNode = dependencyGraph.nodes.find(n => n.id === edge.target)

      if (edge.status === 'error') {
        findings.push({
          category: 'integration',
          severity: 'critical',
          title: `${sourceNode?.name} → ${targetNode?.name} 集成失败`,
          description: `${edge.type}接口调用错误率${edge.metrics.errorRate}%，远超正常水平`,
          metrics: [`错误率: ${edge.metrics.errorRate}%`, `平均延迟: ${edge.metrics.avgLatency}ms`],
          impact: `导致${sourceNode?.name}的业务功能无法正常完成`
        })

        bottlenecks.push({
          system: `${sourceNode?.name} → ${targetNode?.name}`,
          operation: `${edge.type}_integration`,
          type: 'dependency',
          currentValue: edge.metrics.errorRate,
          baselineValue: 1,
          impactLevel: 'critical',
          description: `${edge.type}集成错误率过高`,
          suggestedActions: [
            '检查目标系统服务状态',
            '查看网络连接',
            '验证接口配置',
            '实施熔断机制'
          ]
        })

        recommendations.push({
          priority: 'urgent',
          category: '集成',
          title: `修复${sourceNode?.name}到${targetNode?.name}的集成`,
          description: `集成错误率${edge.metrics.errorRate}%严重影响业务`,
          expectedBenefit: '恢复跨系统业务流程',
          effort: 'medium'
        })
      } else if (edge.status === 'warning') {
        findings.push({
          category: 'integration',
          severity: 'warning',
          title: `${sourceNode?.name} → ${targetNode?.name} 性能下降`,
          description: `${edge.type}接口延迟${edge.metrics.avgLatency}ms，超出预期`,
          metrics: [`延迟: ${edge.metrics.avgLatency}ms`, `错误率: ${edge.metrics.errorRate}%`],
          impact: '影响用户体验和业务流程效率'
        })
      }
    }
  })

  // 分析SLA违约
  slaMetrics.forEach(sla => {
    if (sla.status !== 'compliant') {
      findings.push({
        category: 'reliability',
        severity: 'critical',
        title: `${sla.serviceName} SLA违约`,
        description: `当前可用性${sla.currentValue}%，低于SLA目标${sla.slaTarget}%`,
        metrics: [`SLA目标: ${sla.slaTarget}%`, `当前值: ${sla.currentValue}%`, `事故数: ${sla.incidents.length}`],
        impact: '违反服务等级协议，可能影响客户信任和产生财务损失'
      })

      recommendations.push({
        priority: 'urgent',
        category: 'SLA',
        title: `恢复${sla.serviceName}SLA合规`,
        description: `需要立即采取行动提升可用性至${sla.slaTarget}%以上`,
        expectedBenefit: '满足SLA要求，避免违约惩罚',
        effort: 'significant'
      })
    }
  })

  return { findings, bottlenecks, recommendations }
}

/**
 * 执行根因分析
 */
export function performRootCauseAnalysis(incidentId: string): RootCauseAnalysis {
  // 查找相关的告警
  const relatedAlerts = alerts.filter(a =>
    a.affectedSystems.some(s => alerts.some(al => al.source === s)) ||
    a.relatedAlerts?.includes(incidentId)
  )

  // 查找相关的变更
  const relatedChanges = changeRecords.filter(c =>
    c.relatedIncidents?.includes(incidentId) ||
    c.status === 'completed' && c.type === 'deployment'
  )

  // 构建时间线
  const timeline: TimelineEvent[] = []

  // 添加变更事件
  relatedChanges.forEach(change => {
    timeline.push({
      timestamp: change.timestamp,
      event: `${change.type}: ${change.description}`,
      type: 'change'
    })
  })

  // 添加告警事件
  relatedAlerts.forEach(alert => {
    timeline.push({
      timestamp: alert.timestamp,
      event: `告警: ${alert.title}`,
      type: 'alert'
    })
  })

  // 整理时间线
  timeline.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())

  // 收集证据
  const evidence: Evidence[] = [
    {
      type: 'metric',
      source: 'serviceMetrics',
      description: '数据中台错误率从2.5%上升到10.8%',
      data: { before: 2.5, after: 10.8, change: +332 }
    },
    {
      type: 'metric',
      source: 'serviceMetrics',
      description: '数据中台CPU使用率从65%上升到92%',
      data: { before: 65, after: 92, change: +42 }
    },
    {
      type: 'change',
      source: 'changeRecords',
      description: '数据中台从V3.1升级到V3.2',
      data: relatedChanges[0]
    },
    {
      type: 'trace',
      source: 'traces',
      description: '多条Trace显示数据中台超时',
      data: traces.filter(t => t.spans.some(s => s.system === '数据中台' && s.status !== 'success'))
    }
  ]

  return {
    incidentId,
    timestamp: new Date().toLocaleString('zh-CN'),
    description: '数据中台性能严重下降，导致多个下游系统受影响',
    rootCause: '数据中台V3.2版本存在性能问题，可能是代码优化不当或新增功能导致资源消耗增加',
    contributingFactors: [
      '变更前未进行充分的性能测试',
      '缺少灰度发布机制',
      '没有完善的性能监控和告警',
      '缺少自动回滚机制'
    ],
    timeline,
    evidence,
    relatedChanges: relatedChanges.map(c => c.id)
  }
}

/**
 * 计算整体健康度
 */
function calculateOverallHealth(findings: KeyFinding[]): 'excellent' | 'good' | 'warning' | 'critical' {
  const criticalCount = findings.filter(f => f.severity === 'critical').length
  const warningCount = findings.filter(f => f.severity === 'warning').length

  if (criticalCount > 0) return 'critical'
  if (warningCount >= 3 || criticalCount + warningCount >= 4) return 'warning'
  if (warningCount > 0) return 'good'
  return 'excellent'
}

/**
 * 生成分析摘要
 */
function generateAnalysisSummary(health: string, findings: KeyFinding[]): string {
  const criticalCount = findings.filter(f => f.severity === 'critical').length
  const warningCount = findings.filter(f => f.severity === 'warning').length

  let summary = `系统整体健康度：${health.toUpperCase()}。\n\n`
  summary += `检测到 ${findings.length} 个关键发现，其中 ${criticalCount} 个严重问题，${warningCount} 个警告。`

  if (health === 'critical') {
    summary += '\n\n建议立即处理严重问题，特别是数据中台相关的性能和集成问题。'
  } else if (health === 'warning') {
    summary += '\n\n建议关注警告级别的发现，并制定相应的改进计划。'
  }

  return summary
}

/**
 * 按严重程度排序发现
 */
function sortFindingsBySeverity(findings: KeyFinding[]): KeyFinding[] {
  const severityOrder = { critical: 0, warning: 1, info: 2 }
  return findings.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity])
}

/**
 * 按优先级排序建议
 */
function sortRecommendationsByPriority(recommendations: Recommendation[]): Recommendation[] {
  const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 }
  return recommendations.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority])
}

/**
 * 格式化分析结果
 */
export function formatAnalysisResult(result: AnalysisResult): string {
  let output = `📊 信息系统全链路数据分析报告\n`
  output += `${'═'.repeat(60)}\n`
  output += `分析时间: ${result.timestamp}\n`
  output += `整体健康度: ${getHealthEmoji(result.overallHealth)} ${result.overallHealth.toUpperCase()}\n\n`

  output += `📋 执行摘要\n`
  output += `${'─'.repeat(60)}\n`
  output += `${result.summary}\n\n`

  if (result.keyFindings.length > 0) {
    output += `🔍 关键发现 (${result.keyFindings.length}个)\n`
    output += `${'═'.repeat(60)}\n\n`

    result.keyFindings.forEach((finding, idx) => {
      output += `${idx + 1}. ${getSeverityEmoji(finding.severity)} ${finding.title}\n`
      output += `   类别: ${getCategoryLabel(finding.category)}\n`
      output += `   描述: ${finding.description}\n`
      output += `   指标: ${finding.metrics.join(' | ')}\n`
      output += `   影响: ${finding.impact}\n\n`
    })
  }

  if (result.bottlenecks.length > 0) {
    output += `⚠️  性能瓶颈 (${result.bottlenecks.length}个)\n`
    output += `${'═'.repeat(60)}\n\n`

    result.bottlenecks.forEach((bottleneck, idx) => {
      output += `${idx + 1}. ${bottleneck.system} - ${bottleneck.operation}\n`
      output += `   类型: ${bottleneck.type.toUpperCase()}\n`
      output += `   当前值: ${bottleneck.currentValue} | 基线值: ${bottleneck.baselineValue}\n`
      output += `   影响级别: ${bottleneck.impactLevel.toUpperCase()}\n`
      output += `   描述: ${bottleneck.description}\n`
      output += `   建议操作:\n`
      bottleneck.suggestedActions.forEach(action => {
        output += `     • ${action}\n`
      })
      output += `\n`
    })
  }

  if (result.recommendations.length > 0) {
    output += `💡 改进建议 (${result.recommendations.length}个)\n`
    output += `${'═'.repeat(60)}\n\n`

    result.recommendations.forEach((rec, idx) => {
      output += `${idx + 1}. [${rec.priority.toUpperCase()}] ${rec.title}\n`
      output += `   类别: ${rec.category}\n`
      output += `   描述: ${rec.description}\n`
      output += `   预期收益: ${rec.expectedBenefit}\n`
      output += `   实施难度: ${rec.effort.toUpperCase()}\n\n`
    })
  }

  if (result.relatedInsights.length > 0) {
    output += `🎯 智能洞察 (${result.relatedInsights.length}个)\n`
    output += `${'═'.repeat(60)}\n\n`

    result.relatedInsights.slice(0, 3).forEach((insight, idx) => {
      output += `${idx + 1}. ${getSeverityEmoji(insight.severity)} ${insight.title}\n`
      output += `   类型: ${insight.type.toUpperCase()}\n`
      output += `   描述: ${insight.description}\n`
      output += `   置信度: ${(insight.confidence * 100).toFixed(0)}%\n\n`

      if (insight.recommendations.length > 0) {
        output += `   建议:\n`
        insight.recommendations.slice(0, 2).forEach(rec => {
          output += `     • ${rec}\n`
        })
        output += `\n`
      }
    })
  }

  return output
}

/**
 * 辅助函数
 */
function getHealthEmoji(health: string): string {
  const emojis: Record<string, string> = {
    excellent: '✅',
    good: '🟢',
    warning: '⚠️',
    critical: '🔴'
  }
  return emojis[health] || 'ℹ️'
}

function getSeverityEmoji(severity: string): string {
  const emojis: Record<string, string> = {
    critical: '🔴',
    warning: '🟠',
    info: '🔵'
  }
  return emojis[severity] || '⚪'
}

function getCategoryLabel(category: string): string {
  const labels: Record<string, string> = {
    performance: '性能',
    reliability: '可靠性',
    capacity: '容量',
    integration: '集成'
  }
  return labels[category] || category
}
