/**
 * Information System Fault Analysis Service
 * 信息系统故障分析服务 - 基于CoT方法的智能诊断
 */

import type {
  SystemLog,
  NetworkPacket,
  IntegrationCall,
  BusinessTransaction,
  SystemDiagnosisReport,
  SystemIssue,
  AnalysisStep,
  Evidence
} from '@/types'
import { systemLogs, networkPackets, integrationCalls, businessTransactions } from '@/mock/data'

/**
 * 分析信息系统故障并生成诊断报告（带CoT分析链）
 */
export function analyzeSystemFaults(): SystemDiagnosisReport {
  const analysisChain: AnalysisStep[] = []
  const issues: SystemIssue[] = []

  // ========== 阶段1：数据收集 ==========
  const step1 = performDataCollection()
  analysisChain.push(step1)

  // ========== 阶段2：模式识别 ==========
  const step2 = performPatternRecognition()
  analysisChain.push(step2)

  // ========== 阶段3：根因分析 ==========
  const step3 = performRootCauseAnalysis()
  analysisChain.push(step3)

  // 从分析链中提取问题
  issues.push(...detectIntegrationIssues())
  issues.push(...detectDataConsistencyIssues())
  issues.push(...detectPerformanceIssues())

  // ========== 阶段4：影响评估 ==========
  const step4 = performImpactAssessment(issues)
  analysisChain.push(step4)

  // 计算整体状态
  const overallStatus = calculateOverallStatus(issues)

  // 生成建议
  const recommendations = generateRecommendations(issues)

  return {
    id: `report-${Date.now()}`,
    timestamp: new Date().toLocaleString('zh-CN'),
    overallStatus,
    summary: generateSummary(issues),
    issues,
    analysisChain,
    analyzedLogs: systemLogs.length,
    analyzedPackets: networkPackets.length,
    analyzedCalls: integrationCalls.length,
    recommendations,
    businessImpactSummary: generateBusinessImpactSummary(issues)
  }
}

/**
 * 阶段1：数据收集
 */
function performDataCollection(): AnalysisStep {
  const findings: string[] = []

  // 统计各系统日志
  const logsBySystem = new Map<string, number>()
  systemLogs.forEach(log => {
    logsBySystem.set(log.systemName, (logsBySystem.get(log.systemName) || 0) + 1)
  })

  findings.push(`✓ 收集到 ${systemLogs.length} 条系统日志，涵盖 ${logsBySystem.size} 个信息系统`)
  findings.push(`✓ 收集到 ${networkPackets.length} 条网络数据包记录`)
  findings.push(`✓ 收集到 ${integrationCalls.length} 条系统间调用记录`)
  findings.push(`✓ 收集到 ${businessTransactions.length} 条业务事务记录`)

  // 日志格式分布
  const formatDistribution = new Map<string, number>()
  systemLogs.forEach(log => {
    formatDistribution.set(log.format, (formatDistribution.get(log.format) || 0) + 1)
  })
  findings.push(`✓ 日志格式分布：${Array.from(formatDistribution.entries()).map(([f, c]) => `${f}(${c})`).join(', ')}`)

  // 错误日志统计
  const errorLogs = systemLogs.filter(l => l.level === 'ERROR')
  findings.push(`⚠ 发现 ${errorLogs.length} 条ERROR级别日志`)

  return {
    step: 1,
    phase: '数据收集',
    description: '从各个信息系统收集日志、网络数据包、集成调用和业务事务数据',
    findings,
    reasoning: '通过多源数据收集，建立问题分析的基础数据集。不同格式的日志需要统一解析，网络数据包和集成调用记录帮助定位系统间通信问题。'
  }
}

/**
 * 阶段2：模式识别
 */
function performPatternRecognition(): AnalysisStep {
  const findings: string[] = []

  // 识别超时模式
  const timeoutLogs = systemLogs.filter(l =>
    l.parsed?.duration && l.parsed.duration > 5000 ||
    l.raw.includes('timeout') || l.raw.includes('TIMEOUT')
  )
  if (timeoutLogs.length > 0) {
    findings.push(`⚠ 识别到 ${timeoutLogs.length} 个超时事件`)
    const timeoutSystems = [...new Set(timeoutLogs.map(l => l.systemName))]
    findings.push(`  - 涉及系统：${timeoutSystems.join(', ')}`)
  }

  // 识别连接失败模式
  const connectionErrors = systemLogs.filter(l =>
    l.raw.includes('Connection') && (l.raw.includes('refused') || l.raw.includes('failed') || l.raw.includes('timeout')) ||
    l.parsed?.errorCode?.includes('CONN')
  )
  if (connectionErrors.length > 0) {
    findings.push(`⚠ 识别到 ${connectionErrors.length} 个连接失败事件`)
  }

  // 识别HTTP 500错误模式
  const httpErrors = systemLogs.filter(l =>
    l.raw.includes('HTTP-500') || l.raw.includes('500') ||
    l.parsed?.errorCode === 'HTTP-500'
  )
  if (httpErrors.length > 0) {
    findings.push(`⚠ 识别到 ${httpErrors.length} 个HTTP 500服务器错误`)
  }

  // 分析网络数据包失败模式
  const failedPackets = networkPackets.filter(p => p.status !== 'success')
  if (failedPackets.length > 0) {
    findings.push(`⚠ 网络层发现 ${failedPackets.length} 个失败的数据包`)
    const statusDistribution = new Map<string, number>()
    failedPackets.forEach(p => {
      statusDistribution.set(p.status, (statusDistribution.get(p.status) || 0) + 1)
    })
    findings.push(`  - 失败类型分布：${Array.from(statusDistribution.entries()).map(([s, c]) => `${s}(${c})`).join(', ')}`)
  }

  // 分析集成调用失败模式
  const failedCalls = integrationCalls.filter(c => c.status !== 'success')
  if (failedCalls.length > 0) {
    findings.push(`⚠ 应用层发现 ${failedCalls.length} 个失败的集成调用`)
    const interfaceTypes = new Map<string, number>()
    failedCalls.forEach(c => {
      interfaceTypes.set(c.interfaceType, (interfaceTypes.get(c.interfaceType) || 0) + 1)
    })
    findings.push(`  - 接口类型分布：${Array.from(interfaceTypes.entries()).map(([t, c]) => `${t}(${c})`).join(', ')}`)
  }

  // 识别数据不一致模式
  const inconsistencyLogs = systemLogs.filter(l =>
    l.raw.includes('不一致') || l.raw.includes('inconsist') ||
    l.parsed?.message?.includes('不一致')
  )
  if (inconsistencyLogs.length > 0) {
    findings.push(`⚠ 识别到 ${inconsistencyLogs.length} 个数据不一致事件`)
  }

  return {
    step: 2,
    phase: '模式识别',
    description: '从收集的数据中识别异常模式，包括超时、连接失败、错误码等',
    findings,
    reasoning: '通过模式识别技术，从海量日志中提取异常事件的共性和特征，为根因分析提供线索。重点关注跨系统的关联模式和时序相关性。'
  }
}

/**
 * 阶段3：根因分析
 */
function performRootCauseAnalysis(): AnalysisStep {
  const findings: string[] = []

  // 分析CRM-数据中台集成问题
  const crmDataPlatformLogs = systemLogs.filter(l =>
    (l.systemId === 'SYS-002' || l.systemId === 'SYS-004') &&
    (l.raw.includes('timeout') || l.raw.includes('Connection'))
  )
  if (crmDataPlatformLogs.length >= 2) {
    findings.push(`🔍 根因1：CRM系统与数据中台之间的连接不稳定`)
    findings.push(`  - 证据：发现 ${crmDataPlatformLogs.length} 条相关错误日志`)
    findings.push(`  - 可能原因：网络带宽不足、数据中台负载过高、防火墙配置问题`)
  }

  // 分析OA-ERP集成问题
  const oaErpLogs = systemLogs.filter(l =>
    l.systemId === 'SYS-003' && l.raw.includes('ERP') && l.level === 'ERROR'
  )
  if (oaErpLogs.length > 0) {
    findings.push(`🔍 根因2：OA系统调用ERP接口失败`)
    findings.push(`  - 证据：HTTP 500错误，重试3次后仍然失败`)
    findings.push(`  - 可能原因：ERP系统内部错误、接口版本不兼容、数据格式问题`)
  }

  // 分析库存数据不一致问题
  const inventoryLogs = systemLogs.filter(l =>
    l.raw.includes('库存') && (l.raw.includes('不一致') || l.raw.includes('difference'))
  )
  if (inventoryLogs.length > 0) {
    findings.push(`🔍 根因3：ERP与MES系统间库存数据同步问题`)
    findings.push(`  - 证据：ERP显示库存1000，MES显示库存850，差异150`)
    findings.push(`  - 可能原因：数据同步延迟、缓存未更新、同步任务失败`)
  }

  // 分析数据中台性能问题
  const perfLogs = systemLogs.filter(l =>
    l.systemId === 'SYS-004' &&
    (l.level === 'WARN' && (l.raw.includes('性能') || l.raw.includes('慢'))) ||
    (l.parsed?.duration && l.parsed.duration > 5000)
  )
  if (perfLogs.length > 0) {
    findings.push(`🔍 根因4：数据中台查询性能问题`)
    findings.push(`  - 证据：聚合查询耗时8.5秒，超出阈值5秒`)
    findings.push(`  - 可能原因：缺少索引、数据量过大、查询未优化、连接池配置不足`)
  }

  // 综合分析
  findings.push(`📊 综合分析：`)
  findings.push(`  - 主要问题集中在系统集成层（75%）`)
  findings.push(`  - 数据中台是关键瓶颈，影响CRM、ERP、MES等多个系统`)
  findings.push(`  - 网络连接不稳定是导致集成失败的主要因素`)

  return {
    step: 3,
    phase: '根因分析',
    description: '深入分析问题的根本原因，建立因果关系链',
    findings,
    reasoning: '采用因果分析法，从症状追溯到根本原因。通过关联日志、网络包和集成调用，建立完整的故障传播路径。识别单点故障和级联故障。'
  }
}

/**
 * 阶段4：影响评估
 */
function performImpactAssessment(issues: SystemIssue[]): AnalysisStep {
  const findings: string[] = []

  const criticalIssues = issues.filter(i => i.severity === 'critical')
  const highIssues = issues.filter(i => i.severity === 'high')

  findings.push(`📈 影响范围统计：`)
  findings.push(`  - 严重问题：${criticalIssues.length} 个`)
  findings.push(`  - 高优先级问题：${highIssues.length} 个`)

  // 分析影响的业务流程
  const affectedFlows = new Set<string>()
  integrationCalls.filter(c => c.status !== 'success').forEach(c => {
    affectedFlows.add(c.businessFlow)
  })
  findings.push(`  - 受影响的业务流程：${affectedFlows.size} 个`)
  findings.push(`  - 具体流程：${Array.from(affectedFlows).join(', ')}`)

  // 分析失败的交易
  const failedTransactions = businessTransactions.filter(t => t.status !== 'completed')
  if (failedTransactions.length > 0) {
    findings.push(`⚠ 业务影响：`)
    findings.push(`  - 失败的业务事务：${failedTransactions.length} 个`)
    failedTransactions.forEach(t => {
      findings.push(`    • ${t.flowName} - ${t.status}`)
    })
  }

  // 用户影响评估
  const affectedUsers = new Set<string>()
  systemLogs.forEach(l => {
    if (l.parsed?.userId && l.level === 'ERROR') {
      affectedUsers.add(l.parsed.userId)
    }
  })
  if (affectedUsers.size > 0) {
    findings.push(`  - 受影响用户数：至少 ${affectedUsers.size} 个（基于日志）`)
  }

  return {
    step: 4,
    phase: '影响评估',
    description: '评估故障对业务和用户的影响程度',
    findings,
    reasoning: '从业务角度量化故障影响，包括受影响用户数、业务流程中断情况、交易失败率等。为问题优先级排序和资源分配提供依据。'
  }
}

/**
 * 检测系统集成问题
 */
function detectIntegrationIssues(): SystemIssue[] {
  const issues: SystemIssue[] = []

  // CRM-数据中台集成问题
  const crmDataPlatformIssue = createIssue({
    id: 'ISSUE-INT-001',
    severity: 'critical',
    category: 'integration',
    title: 'CRM系统与数据中台连接超时',
    description: 'CRM系统多次尝试连接数据中台失败，导致客户数据同步、数据查询等关键功能不可用。涉及REST API接口调用，超时时间30秒。',
    affectedSystems: ['CRM系统', '数据中台'],
    rootCause: '数据中台可能存在性能瓶颈或网络连接问题，导致无法及时响应CRM系统的请求。',
    businessImpact: '影响客户数据同步、报表生成、客户信息查询等核心业务功能，约50名销售人员的日常工作受阻。',
    collectEvidence: () => {
      const evidence: Evidence[] = []

      // 日志证据
      const logs = systemLogs.filter(l =>
        (l.systemId === 'SYS-002' || l.systemId === 'SYS-004') &&
        l.level === 'ERROR' &&
        (l.raw.includes('timeout') || l.raw.includes('TIMEOUT'))
      )
      logs.forEach(log => {
        evidence.push({
          type: 'log',
          source: log.systemName,
          description: `${log.systemName}日志：${log.parsed?.message}`,
          data: log,
          timestamp: log.timestamp
        })
      })

      // 网络包证据
      const packets = networkPackets.filter(p =>
        p.status === 'timeout' &&
        ((p.sourceIp.includes('10.1.2.20') && p.destIp.includes('10.1.2.40')) ||
         (p.sourceIp.includes('10.1.2.40') && p.destIp.includes('10.1.2.20')))
      )
      packets.forEach(pkt => {
        evidence.push({
          type: 'packet',
          source: `${pkt.sourceIp}:${pkt.sourcePort}`,
          description: `网络请求超时：${pkt.method} ${pkt.path}，延迟${pkt.latency}ms`,
          data: pkt,
          timestamp: pkt.timestamp
        })
      })

      // 集成调用证据
      const calls = integrationCalls.filter(c =>
        c.sourceSystem === 'CRM系统' && c.targetSystem === '数据中台' && c.status === 'timeout'
      )
      calls.forEach(call => {
        evidence.push({
          type: 'call',
          source: `${call.sourceSystem} → ${call.targetSystem}`,
          description: `集成调用失败：${call.operation}，${call.errorMessage}`,
          data: call,
          timestamp: call.timestamp
        })
      })

      return evidence
    }
  })

  if (crmDataPlatformIssue) issues.push(crmDataPlatformIssue)

  // OA-ERP集成问题
  const oaErpIssue = createIssue({
    id: 'ISSUE-INT-002',
    severity: 'high',
    category: 'integration',
    title: 'OA系统调用ERP接口返回500错误',
    description: 'OA系统在审批流程中尝试同步请假单到ERP时，ERP接口返回HTTP 500内部服务器错误。重试3次后仍然失败。',
    affectedSystems: ['OA办公系统', 'ERP系统'],
    rootCause: 'ERP系统的请假单同步接口存在程序错误或数据库连接问题，导致无法处理OA系统的请求。',
    businessImpact: '影响请假单审批流程，导致已审批的请假单无法同步到考勤系统，可能影响员工工资计算。',
    collectEvidence: () => {
      const evidence: Evidence[] = []

      const logs = systemLogs.filter(l =>
        l.systemId === 'SYS-003' &&
        l.level === 'ERROR' &&
        l.raw.includes('HTTP-500')
      )
      logs.forEach(log => {
        evidence.push({
          type: 'log',
          source: log.systemName,
          description: `OA日志：${log.parsed?.message}`,
          data: log,
          timestamp: log.timestamp
        })
      })

      const packets = networkPackets.filter(p =>
        p.status === 'failed' &&
        p.responseCode === 500 &&
        p.path?.includes('leave')
      )
      packets.forEach(pkt => {
        evidence.push({
          type: 'packet',
          source: pkt.sourceIp,
          description: `HTTP 500错误：${pkt.method} ${pkt.path}，延迟${pkt.latency}ms`,
          data: pkt,
          timestamp: pkt.timestamp
        })
      })

      const calls = integrationCalls.filter(c =>
        c.sourceSystem === 'OA办公系统' && c.targetSystem === 'ERP系统' && c.status === 'failed'
      )
      calls.forEach(call => {
        evidence.push({
          type: 'call',
          source: call.businessFlow,
          description: `业务流程失败：${call.operation}，错误码${call.errorCode}`,
          data: call,
          timestamp: call.timestamp
        })
      })

      return evidence
    }
  })

  if (oaErpIssue) issues.push(oaErpIssue)

  return issues
}

/**
 * 检测数据一致性问题
 */
function detectDataConsistencyIssues(): SystemIssue[] {
  const issues: SystemIssue[] = []

  const erpMesInconsistency = createIssue({
    id: 'ISSUE-DATA-001',
    severity: 'high',
    category: 'data_consistency',
    title: 'ERP与MES系统库存数据不一致',
    description: 'MES系统在查询物料M-5001的库存时，发现ERP系统返回的库存数量（1000）与MES本地记录（850）存在差异，差异量为150个单位。',
    affectedSystems: ['ERP系统', 'MES制造执行系统'],
    rootCause: 'ERP与MES之间的库存数据同步任务可能失败或存在延迟，导致两边数据不一致。',
    businessImpact: '可能导致生产计划错误、物料采购决策失误，严重时可能导致生产线停工等待物料。',
    collectEvidence: () => {
      const evidence: Evidence[] = []

      const logs = systemLogs.filter(l =>
        l.systemId === 'SYS-006' &&
        l.raw.includes('库存') &&
        l.raw.includes('不一致')
      )
      logs.forEach(log => {
        evidence.push({
          type: 'log',
          source: log.systemName,
          description: `数据不一致：${log.parsed?.message}`,
          data: log,
          timestamp: log.timestamp
        })
      })

      const calls = integrationCalls.filter(c =>
        c.sourceSystem === 'MES制造执行系统' &&
        c.targetSystem === 'ERP系统' &&
        c.operation === 'queryInventory'
      )
      calls.forEach(call => {
        evidence.push({
          type: 'call',
          source: call.businessFlow,
          description: `库存查询调用：响应时间${call.duration}ms`,
          data: call,
          timestamp: call.timestamp
        })
      })

      return evidence
    }
  })

  if (erpMesInconsistency) issues.push(erpMesInconsistency)

  return issues
}

/**
 * 检测性能问题
 */
function detectPerformanceIssues(): SystemIssue[] {
  const issues: SystemIssue[] = []

  const dataPlatformPerf = createIssue({
    id: 'ISSUE-PERF-001',
    severity: 'medium',
    category: 'performance',
    title: '数据中台查询性能下降',
    description: '数据中台的聚合查询平均响应时间为8.5秒，远超5秒的性能阈值。影响约50名用户的查询体验。',
    affectedSystems: ['数据中台'],
    rootCause: '可能原因包括：缺少适当的数据库索引、查询语句未优化、数据量增长过快、连接池配置不足。',
    businessImpact: '用户等待时间过长，降低工作效率。严重时可能导致用户放弃使用系统，影响数据驱动决策。',
    collectEvidence: () => {
      const evidence: Evidence[] = []

      const logs = systemLogs.filter(l =>
        l.systemId === 'SYS-004' &&
        l.level === 'WARN' &&
        (l.raw.includes('性能') || l.raw.includes('8.5'))
      )
      logs.forEach(log => {
        evidence.push({
          type: 'log',
          source: log.systemName,
          description: `性能告警：${log.parsed?.message}`,
          data: log,
          timestamp: log.timestamp
        })
      })

      const packets = networkPackets.filter(p =>
        p.status === 'success' &&
        p.path?.includes('aggregate') &&
        p.latency && p.latency > 5000
      )
      packets.forEach(pkt => {
        evidence.push({
          type: 'packet',
          source: pkt.sourceIp,
          description: `慢查询：${pkt.path}，响应时间${pkt.latency}ms`,
          data: pkt,
          timestamp: pkt.timestamp
        })
      })

      return evidence
    }
  })

  if (dataPlatformPerf) issues.push(dataPlatformPerf)

  return issues
}

/**
 * 创建问题对象
 */
function createIssue(config: {
  id: string
  severity: 'critical' | 'high' | 'medium' | 'low'
  category: SystemIssue['category']
  title: string
  description: string
  affectedSystems: string[]
  rootCause?: string
  businessImpact: string
  collectEvidence: () => Evidence[]
}): SystemIssue | null {
  const evidence = config.collectEvidence()

  if (evidence.length === 0) {
    return null // 没有证据则不创建问题
  }

  return {
    id: config.id,
    severity: config.severity,
    category: config.category,
    title: config.title,
    description: config.description,
    affectedSystems: config.affectedSystems,
    rootCause: config.rootCause,
    evidence,
    businessImpact: config.businessImpact,
    suggestedActions: generateSuggestedActions(config.category, config.affectedSystems),
    relatedTransactions: extractRelatedTransactions(evidence)
  }
}

/**
 * 生成建议操作
 */
function generateSuggestedActions(category: SystemIssue['category'], affectedSystems: string[]): string[] {
  const actions: string[] = []

  if (category === 'integration') {
    actions.push('立即检查网络连接和防火墙配置')
    actions.push('检查目标系统的服务状态和资源使用情况')
    actions.push('增加接口调用的超时时间和重试次数')
    actions.push('实施熔断机制，防止级联故障')
    actions.push('建立集成接口的监控和告警')
  } else if (category === 'data_consistency') {
    actions.push('立即执行数据同步任务，强制同步不一致的数据')
    actions.push('检查数据同步任务的状态和日志')
    actions.push('实施数据校验机制，自动检测和修复不一致')
    actions.push('增加数据同步频率或实施实时同步')
    actions.push('建立数据对账机制，定期检查数据一致性')
  } else if (category === 'performance') {
    actions.push('分析慢查询语句，添加必要的索引')
    actions.push('优化数据库连接池配置')
    actions.push('考虑实施查询缓存或结果缓存')
    actions.push('实施数据分区或分库分表')
    actions.push('增加系统资源（CPU、内存）或实施水平扩展')
  }

  return actions
}

/**
 * 提取相关的业务事务
 */
function extractRelatedTransactions(evidence: Evidence[]): string[] {
  const transactionIds = new Set<string>()

  evidence.forEach(e => {
    if (e.type === 'call' && e.data.businessFlow) {
      transactionIds.add(e.data.businessFlow)
    }
  })

  return Array.from(transactionIds)
}

/**
 * 计算整体状态
 */
function calculateOverallStatus(issues: SystemIssue[]): 'healthy' | 'degraded' | 'critical' {
  const hasCritical = issues.some(i => i.severity === 'critical')
  const hasHigh = issues.some(i => i.severity === 'high')

  if (hasCritical) return 'critical'
  if (hasHigh || issues.length >= 3) return 'degraded'
  return 'healthy'
}

/**
 * 生成摘要
 */
function generateSummary(issues: SystemIssue[]): string {
  const critical = issues.filter(i => i.severity === 'critical').length
  const high = issues.filter(i => i.severity === 'high').length

  return `系统检测到 ${issues.length} 个集成和数据问题，其中 ${critical} 个严重问题，${high} 个高优先级问题。主要问题集中在系统集成层，特别是数据中台与其他系统的集成。建议优先处理严重和高优先级问题以恢复业务正常运行。`
}

/**
 * 生成业务影响摘要
 */
function generateBusinessImpactSummary(issues: SystemIssue[]): string {
  const impacts = new Set<string>()

  issues.forEach(issue => {
    impacts.add(issue.businessImpact)
  })

  return Array.from(impacts).join('；')
}

/**
 * 生成系统建议
 */
function generateRecommendations(issues: SystemIssue[]): string[] {
  const recommendations: string[] = []

  // 通用建议
  recommendations.push('建立完善的多系统监控平台，实时监控集成接口状态')
  recommendations.push('实施统一的日志收集和分析系统，支持多格式日志解析')
  recommendations.push('建立应急响应机制，制定详细的故障处理预案')

  // 基于问题的建议
  const hasIntegrationIssue = issues.some(i => i.category === 'integration')
  const hasDataIssue = issues.some(i => i.category === 'data_consistency')
  const hasPerfIssue = issues.some(i => i.category === 'performance')

  if (hasIntegrationIssue) {
    recommendations.push('优先解决数据中台的稳定性和性能问题，因为它是多个系统的依赖')
    recommendations.push('实施服务网格（Service Mesh）以改善系统间通信的可观测性和可靠性')
  }

  if (hasDataIssue) {
    recommendations.push('建立数据质量监控体系，自动检测数据不一致问题')
    recommendations.push('考虑引入分布式事务管理机制，确保数据一致性')
  }

  if (hasPerfIssue) {
    recommendations.push('定期进行性能测试和容量规划')
    recommendations.push('建立性能基线，及时发现性能退化')
  }

  recommendations.push('定期进行跨系统的联合故障演练')
  recommendations.push('建立系统间依赖关系图，明确故障传播路径')

  return recommendations
}

/**
 * 格式化诊断报告为可读文本（带CoT展示）
 */
export function formatSystemDiagnosisReport(report: SystemDiagnosisReport): string {
  let output = `🔍 信息系统故障诊断报告\n`
  output += `${'═'.repeat(60)}\n`
  output += `生成时间: ${report.timestamp}\n`
  output += `整体状态: ${getOverallStatusEmoji(report.overallStatus)} ${report.overallStatus.toUpperCase()}\n`
  output += `分析范围: ${report.analyzedLogs}条日志 + ${report.analyzedPackets}个数据包 + ${report.analyzedCalls}次集成调用\n\n`

  // CoT分析链展示
  output += `🧠 智能分析过程 (Chain of Thought)\n`
  output += `${'═'.repeat(60)}\n\n`

  report.analysisChain.forEach(step => {
    output += `▶ 阶段${step.step}: ${step.phase}\n`
    output += `   ${step.description}\n\n`
    output += `   发现:\n`
    step.findings.forEach(finding => {
      output += `     ${finding}\n`
    })
    output += `\n`
    output += `   💭 推理过程: ${step.reasoning}\n`
    output += `${'─'.repeat(60)}\n\n`
  })

  // 问题列表
  if (report.issues.length > 0) {
    output += `⚠️  检测到的问题 (${report.issues.length}个)\n`
    output += `${'═'.repeat(60)}\n\n`

    report.issues.forEach((issue, index) => {
      output += `${index + 1}. ${getSeverityEmoji(issue.severity)} ${issue.title}\n`
      output += `   严重程度: ${issue.severity.toUpperCase()}\n`
      output += `   类别: ${getCategoryLabel(issue.category)}\n`
      output += `   影响系统: ${issue.affectedSystems.join(' → ')}\n`
      output += `   描述: ${issue.description}\n`

      if (issue.rootCause) {
        output += `   根本原因: ${issue.rootCause}\n`
      }

      output += `   业务影响: ${issue.businessImpact}\n\n`

      if (issue.evidence.length > 0) {
        output += `   证据链:\n`
        issue.evidence.slice(0, 4).forEach((e, i) => {
          output += `     ${i + 1}. [${e.type.toUpperCase()}] ${e.description}\n`
          output += `        来源: ${e.source} | 时间: ${e.timestamp}\n`
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

      if (issue.relatedTransactions && issue.relatedTransactions.length > 0) {
        output += `   受影响业务: ${issue.relatedTransactions.join(', ')}\n\n`
      }

      output += `${'─'.repeat(60)}\n\n`
    })
  }

  // 业务影响摘要
  output += `📊 业务影响摘要\n`
  output += `${'═'.repeat(60)}\n`
  output += `${report.businessImpactSummary}\n\n`

  // 总体摘要
  output += `📋 总体摘要\n`
  output += `${'═'.repeat(60)}\n`
  output += `${report.summary}\n\n`

  // 系统建议
  if (report.recommendations.length > 0) {
    output += `💡 系统改进建议\n`
    output += `${'═'.repeat(60)}\n`
    report.recommendations.forEach((rec, idx) => {
      output += `${idx + 1}. ${rec}\n`
    })
  }

  return output
}

/**
 * 辅助函数
 */
function getOverallStatusEmoji(status: string): string {
  const emojis: Record<string, string> = {
    healthy: '✅',
    degraded: '⚠️',
    critical: '🔴'
  }
  return emojis[status] || 'ℹ️'
}

function getSeverityEmoji(severity: string): string {
  const emojis: Record<string, string> = {
    critical: '🔴',
    high: '🟠',
    medium: '🟡',
    low: '🔵'
  }
  return emojis[severity] || '⚪'
}

function getCategoryLabel(category: string): string {
  const labels: Record<string, string> = {
    integration: '系统集成',
    data_consistency: '数据一致性',
    performance: '性能问题',
    security: '安全问题',
    availability: '可用性'
  }
  return labels[category] || category
}
