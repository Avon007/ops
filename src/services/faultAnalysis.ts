/**
 * 故障分析服务
 * Fault Analysis Service - 分析日志和通信数据，识别问题并生成诊断报告
 */

import type { LogEntry, ServerCommunication, DiagnosisReport, FaultIssue } from '@/types'
import { mockLogs, mockCommunications } from '@/mock/data'

/**
 * 分析系统故障并生成诊断报告
 */
export function analyzeSystemFaults(): DiagnosisReport {
  const issues: FaultIssue[] = []

  // 分析日志
  const errorLogs = mockLogs.filter(log => log.level === 'ERROR')
  const warnLogs = mockLogs.filter(log => log.level === 'WARN')

  // 按服务器分组错误日志
  const errorsByServer = groupByServer(errorLogs)

  // 分析通信数据
  const failedComms = mockCommunications.filter(comm => comm.status !== 'success')
  const timeoutComms = mockCommunications.filter(comm => comm.status === 'timeout')

  // 识别关键问题
  issues.push(...detectDatabaseConnectionIssues(errorsByServer, failedComms, timeoutComms))
  issues.push(...detectMemoryIssues(errorsByServer, warnLogs))
  issues.push(...detectApplicationErrors(errorsByServer))
  issues.push(...detectCacheIssues(errorsByServer, warnLogs))
  issues.push(...detectConnectivityIssues(failedComms))

  // 计算整体状态
  const overallStatus = calculateOverallStatus(issues)

  // 生成建议
  const recommendations = generateRecommendations(issues)

  return {
    id: `report-${Date.now()}`,
    timestamp: new Date().toLocaleString('zh-CN'),
    overallStatus,
    summary: generateSummary(issues, errorLogs.length, failedComms.length),
    issues,
    analyzedLogs: mockLogs.length,
    analyzedCommunications: mockCommunications.length,
    recommendations
  }
}

/**
 * 检测数据库连接问题
 */
function detectDatabaseConnectionIssues(
  errorsByServer: Map<string, LogEntry[]>,
  failedComms: ServerCommunication[],
  timeoutComms: ServerCommunication[]
): FaultIssue[] {
  const issues: FaultIssue[] = []

  // 检查数据库相关的超时和错误
  const dbTimeouts = timeoutComms.filter(c => c.target.includes('db-server'))
  const dbErrors = Array.from(errorsByServer.entries()).filter(([server, logs]) =>
    server.includes('db-server') || logs.some(l => l.message.toLowerCase().includes('database') || l.message.toLowerCase().includes('connection'))
  )

  if (dbTimeouts.length > 0 || dbErrors.length > 0) {
    const affectedServers = new Set<string>()
    const evidence: string[] = []

    dbTimeouts.forEach(c => {
      affectedServers.add(c.source)
      evidence.push(`${c.source} → ${c.target}: ${c.error} (延迟: ${c.latency}ms)`)
    })

    dbErrors.forEach(([server, logs]) => {
      affectedServers.add(server)
      logs.forEach(log => {
        evidence.push(`[${log.timestamp}] ${log.server}: ${log.message}`)
      })
    })

    issues.push({
      id: `issue-db-${Date.now()}`,
      severity: dbTimeouts.length > 2 ? 'critical' : 'high',
      category: '数据库连接',
      title: '数据库连接池耗尽与查询超时',
      description: `检测到 ${dbTimeouts.length} 次数据库连接超时，${dbErrors.length} 个数据库相关错误。连接池可能已耗尽，导致查询失败和超时。`,
      affectedServers: Array.from(affectedServers),
      evidence: evidence.slice(0, 5),
      suggestedActions: [
        '立即检查数据库连接池配置，考虑增加最大连接数',
        '优化慢查询，添加必要的索引',
        '重启受影响的应用服务器以释放连接',
        '实施连接池监控和告警机制'
      ]
    })
  }

  return issues
}

/**
 * 检测内存问题
 */
function detectMemoryIssues(
  errorsByServer: Map<string, LogEntry[]>,
  warnLogs: LogEntry[]
): FaultIssue[] {
  const issues: FaultIssue[] = []

  const memoryWarnings = warnLogs.filter(log =>
    log.message.toLowerCase().includes('memory') ||
    log.message.toLowerCase().includes('gc')
  )

  if (memoryWarnings.length > 0) {
    const affectedServers = [...new Set(memoryWarnings.map(log => log.server))]

    issues.push({
      id: `issue-mem-${Date.now()}`,
      severity: 'high',
      category: '内存管理',
      title: '高内存使用率和GC频繁',
      description: `检测到 ${memoryWarnings.length} 条内存警告。内存使用率超过90%，GC暂停时间增加，可能导致性能下降和OOM风险。`,
      affectedServers,
      evidence: memoryWarnings.slice(0, 3).map(log =>
        `[${log.timestamp}] ${log.server}: ${log.message} - ${log.details}`
      ),
      suggestedActions: [
        '检查内存泄漏，分析堆转储',
        '增加JVM堆内存配置',
        '优化缓存策略，减少内存占用',
        '考虑实施水平扩展以分散负载'
      ]
    })
  }

  return issues
}

/**
 * 检测应用程序错误
 */
function detectApplicationErrors(errorsByServer: Map<string, LogEntry[]>): FaultIssue[] {
  const issues: FaultIssue[] = []

  // 查找应用层异常
  const appErrors: LogEntry[] = []
  errorsByServer.forEach(logs => {
    logs.forEach(log => {
      if (log.message.includes('Exception') ||
          log.message.includes('NullPointerException') ||
          log.message.includes('payment') ||
          log.message.includes('Failed to process')) {
        appErrors.push(log)
      }
    })
  })

  if (appErrors.length > 0) {
    const affectedServers = [...new Set(appErrors.map(log => log.server))]

    issues.push({
      id: `issue-app-${Date.now()}`,
      severity: 'medium',
      category: '应用程序',
      title: '应用程序异常和支付服务故障',
      description: `检测到 ${appErrors.length} 个应用程序级错误，包括空指针异常和支付网关连接失败。`,
      affectedServers,
      evidence: appErrors.slice(0, 4).map(log =>
        `[${log.timestamp}] ${log.service}: ${log.message}`
      ),
      suggestedActions: [
        '修复 UserService.java:245 的空指针异常',
        '检查支付网关配置和连接状态',
        '实施更完善的错误处理和重试机制',
        '增加单元测试以覆盖边界情况'
      ]
    })
  }

  return issues
}

/**
 * 检测缓存问题
 */
function detectCacheIssues(
  errorsByServer: Map<string, LogEntry[]>,
  warnLogs: LogEntry[]
): FaultIssue[] {
  const issues: FaultIssue[] = []

  const cacheWarnings = warnLogs.filter(log =>
    log.service.toLowerCase().includes('redis') ||
    log.service.toLowerCase().includes('cache')
  )

  if (cacheWarnings.length > 0) {
    const affectedServers = [...new Set(cacheWarnings.map(log => log.server))]

    issues.push({
      id: `issue-cache-${Date.now()}`,
      severity: 'medium',
      category: '缓存服务',
      title: '缓存驱逐率过高',
      description: `Redis缓存驱逐率异常（${cacheWarnings[0]?.details || '450 keys/sec'}），表明缓存配置可能不合理或内存不足。`,
      affectedServers,
      evidence: cacheWarnings.map(log =>
        `[${log.timestamp}] ${log.server}: ${log.message} - ${log.details}`
      ),
      suggestedActions: [
        '增加Redis内存配置或扩展缓存集群',
        '优化缓存键的TTL设置',
        '分析缓存命中率和热点数据',
        '考虑实施缓存预热策略'
      ]
    })
  }

  return issues
}

/**
 * 检测服务间连通性问题
 */
function detectConnectivityIssues(failedComms: ServerCommunication[]): FaultIssue[] {
  const issues: FaultIssue[] = []

  if (failedComms.length > 0) {
    const affectedServers = [...new Set([...failedComms.map(c => c.source), ...failedComms.map(c => c.target)])]

    issues.push({
      id: `issue-conn-${Date.now()}`,
      severity: 'low',
      category: '服务连通性',
      title: '服务间通信不稳定',
      description: `检测到 ${failedComms.length} 次失败的服务间通信，可能影响系统整体可用性。`,
      affectedServers,
      evidence: failedComms.slice(0, 3).map(c =>
        `[${c.timestamp}] ${c.source} → ${c.target}: ${c.error || c.status}`
      ),
      suggestedActions: [
        '检查服务间网络连接和防火墙规则',
        '实施服务网格以改善可观测性',
        '增加重试和超时配置',
        '监控服务健康状态'
      ]
    })
  }

  return issues
}

/**
 * 按服务器分组日志
 */
function groupByServer(logs: LogEntry[]): Map<string, LogEntry[]> {
  const grouped = new Map<string, LogEntry[]>()
  logs.forEach(log => {
    const serverLogs = grouped.get(log.server) || []
    serverLogs.push(log)
    grouped.set(log.server, serverLogs)
  })
  return grouped
}

/**
 * 计算整体状态
 */
function calculateOverallStatus(issues: FaultIssue[]): 'healthy' | 'warning' | 'critical' {
  const hasCritical = issues.some(i => i.severity === 'critical')
  const hasHigh = issues.some(i => i.severity === 'high')

  if (hasCritical) return 'critical'
  if (hasHigh || issues.length >= 3) return 'warning'
  return 'healthy'
}

/**
 * 生成摘要
 */
function generateSummary(issues: FaultIssue[], errorCount: number, failedCommCount: number): string {
  const criticalCount = issues.filter(i => i.severity === 'critical').length
  const highCount = issues.filter(i => i.severity === 'high').length

  return `系统检测到 ${issues.length} 个问题，其中 ${criticalCount} 个严重问题，${highCount} 个高优先级问题。分析了 ${errorCount} 条错误日志和 ${failedCommCount} 次失败的通信记录。建议立即处理严重和高优先级问题以确保系统稳定运行。`
}

/**
 * 生成建议
 */
function generateRecommendations(issues: FaultIssue[]): string[] {
  const recommendations: string[] = []

  // 添加通用建议
  recommendations.push('建立完善的监控和告警系统，提前发现问题')

  // 根据问题类型添加具体建议
  const hasDbIssue = issues.some(i => i.category === '数据库连接')
  const hasMemoryIssue = issues.some(i => i.category === '内存管理')

  if (hasDbIssue) {
    recommendations.push('实施数据库连接池监控和定期性能审查')
  }

  if (hasMemoryIssue) {
    recommendations.push('定期进行内存分析和性能调优')
  }

  recommendations.push('完善错误处理和降级策略')
  recommendations.push('建立事故响应预案和回滚机制')

  return recommendations
}

/**
 * 格式化诊断报告为可读文本
 */
export function formatDiagnosisReport(report: DiagnosisReport): string {
  let output = `📊 系统故障诊断报告\n`
  output += `${'─'.repeat(50)}\n`
  output += `生成时间: ${report.timestamp}\n`
  output += `整体状态: ${getStatusEmoji(report.overallStatus)} ${report.overallStatus.toUpperCase()}\n`
  output += `分析数据: ${report.analyzedLogs} 条日志, ${report.analyzedCommunications} 条通信记录\n\n`

  output += `📋 摘要\n`
  output += `${report.summary}\n\n`

  if (report.issues.length > 0) {
    output += `⚠️  检测到的问题 (${report.issues.length}个)\n`
    output += `${'─'.repeat(50)}\n\n`

    report.issues.forEach((issue, index) => {
      output += `${index + 1}. ${getSeverityEmoji(issue.severity)} ${issue.title}\n`
      output += `   严重程度: ${issue.severity.toUpperCase()}\n`
      output += `   类别: ${issue.category}\n`
      output += `   影响服务器: ${issue.affectedServers.join(', ')}\n`
      output += `   描述: ${issue.description}\n\n`

      if (issue.evidence.length > 0) {
        output += `   证据:\n`
        issue.evidence.forEach(e => {
          output += `     • ${e}\n`
        })
        output += `\n`
      }

      if (issue.suggestedActions.length > 0) {
        output += `   建议操作:\n`
        issue.suggestedActions.forEach(action => {
          output += `     ✓ ${action}\n`
        })
        output += `\n`
      }

      output += `${'─'.repeat(50)}\n\n`
    })
  }

  if (report.recommendations.length > 0) {
    output += `💡 系统建议\n`
    output += `${'─'.repeat(50)}\n`
    report.recommendations.forEach(rec => {
      output += `• ${rec}\n`
    })
  }

  return output
}

/**
 * 获取状态图标
 */
function getStatusEmoji(status: string): string {
  const emojis: Record<string, string> = {
    healthy: '✅',
    warning: '⚠️',
    critical: '🔴'
  }
  return emojis[status] || 'ℹ️'
}

/**
 * 获取严重程度图标
 */
function getSeverityEmoji(severity: string): string {
  const emojis: Record<string, string> = {
    critical: '🔴',
    high: '🟠',
    medium: '🟡',
    low: '🔵'
  }
  return emojis[severity] || '⚪'
}
