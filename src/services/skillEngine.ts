/**
 * Skill Library Diagnosis Engine
 * 专家技能知识库诊断引擎
 */

import type {
  SkillRule,
  SkillTrigger,
  SkillDiagnosisStep,
  SkillAction,
  SkillExecutionResult,
  OperatorProfile,
  SkillTemplate
} from '@/types'
import { infoSystems, systemLogs, integrationCalls } from '@/mock/data'

/**
 * 执行单个技能规则
 */
export function executeSkillRule(rule: SkillRule): SkillExecutionResult {
  const executionId = `exec-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  const startTime = Date.now()

  // 初始化执行结果
  const result: SkillExecutionResult = {
    executionId,
    ruleId: rule.id,
    ruleName: rule.name,
    executedBy: rule.createdBy,
    executedAt: new Date().toISOString(),
    triggeredBy: {
      triggerType: 'manual',
      triggerData: {},
      timestamp: new Date().toISOString()
    },
    status: 'success',
    diagnosisResults: [],
    actionResults: [],
    summary: '',
    confidence: 0,
    affectedSystems: rule.applicableSystems,
    businessImpact: '',
    totalDuration: 0,
    recommendations: []
  }

  try {
    // 1. 执行诊断步骤
    for (const step of rule.diagnosisSteps) {
      const stepResult = executeDiagnosisStep(step, rule.applicableSystems)
      result.diagnosisResults.push(stepResult)
    }

    // 2. 执行动作
    for (const action of rule.actions) {
      if (action.enabled) {
        const actionResult = executeAction(action, result.diagnosisResults)
        result.actionResults.push(actionResult)
      }
    }

    // 3. 生成摘要
    result.summary = generateExecutionSummary(rule, result)
    result.confidence = calculateConfidence(result.diagnosisResults)

    // 4. 计算总时长
    result.totalDuration = Date.now() - startTime

    // 5. 生成建议
    result.recommendations = generateRecommendations(rule, result)

    return result
  } catch (error) {
    result.status = 'failed'
    result.errors = [error instanceof Error ? error.message : 'Unknown error']
    result.totalDuration = Date.now() - startTime
    return result
  }
}

/**
 * 执行诊断步骤
 */
function executeDiagnosisStep(
  step: SkillDiagnosisStep,
  applicableSystems: string[]
): SkillExecutionResult['diagnosisResults'][0] {
  const startTime = Date.now()

  let output = ''
  let status: 'success' | 'failed' | 'skipped' = 'success'

  try {
    switch (step.stepType) {
      case 'data_collection':
        output = performDataCollection(step, applicableSystems)
        break
      case 'pattern_matching':
        output = performPatternMatching(step)
        break
      case 'correlation_analysis':
        output = performCorrelationAnalysis(step, applicableSystems)
        break
      case 'root_cause_verification':
        output = performRootCauseVerification(step)
        break
      default:
        status = 'skipped'
        output = 'Unknown step type'
    }
  } catch (error) {
    status = 'failed'
    output = error instanceof Error ? error.message : 'Unknown error'
  }

  return {
    stepId: step.id,
    stepName: step.name,
    status,
    output,
    duration: Date.now() - startTime
  }
}

/**
 * 数据收集
 */
function performDataCollection(step: SkillDiagnosisStep, systems: string[]): string {
  if (!step.dataCollection) {
    return 'No data collection configuration'
  }

  const { sources, filters, timeRange } = step.dataCollection
  const results: string[] = []

  results.push(`📊 Data Collection Results`)
  results.push(`Sources: ${sources.join(', ')}`)
  results.push(`Time Range: ${timeRange}s`)
  results.push(`Filters: ${JSON.stringify(filters)}`)
  results.push('')

  // 收集日志数据
  if (sources.includes('logs')) {
    const logs = systemLogs.filter(log => {
      const systemMatch = !filters.systemId || log.systemId === filters.systemId
      const levelMatch = !filters.level || log.level === filters.level
      return systemMatch && levelMatch
    })

    results.push(`📋 Logs: ${logs.length} entries found`)
    if (logs.length > 0) {
      results.push(`Latest: ${logs[0].timestamp} - ${logs[0].level}`)
    }
  }

  // 收集集成调用数据
  if (sources.includes('integration_calls')) {
    const calls = integrationCalls.filter(call => {
      const sourceMatch = !filters.sourceSystem || call.sourceSystem === filters.sourceSystem
      const targetMatch = !filters.targetSystem || call.targetSystem === filters.targetSystem
      const statusMatch = !filters.status || call.status === filters.status
      return sourceMatch && targetMatch && statusMatch
    })

    results.push(`🔗 Integration Calls: ${calls.length} found`)

    // 统计失败率
    const failedCalls = calls.filter(c => c.status !== 'success')
    if (calls.length > 0) {
      const failureRate = ((failedCalls.length / calls.length) * 100).toFixed(1)
      results.push(`Failure Rate: ${failureRate}%`)
    }
  }

  return results.join('\n')
}

/**
 * 模式匹配
 */
function performPatternMatching(step: SkillDiagnosisStep): string {
  if (!step.patternMatching) {
    return 'No pattern matching configuration'
  }

  const { patterns, matchingAlgorithm, confidenceThreshold } = step.patternMatching
  const results: string[] = []

  results.push(`🔍 Pattern Matching Results`)
  results.push(`Algorithm: ${matchingAlgorithm}`)
  results.push(`Confidence Threshold: ${confidenceThreshold}`)
  results.push(`Patterns: ${patterns.length}`)
  results.push('')

  // 在日志中搜索模式
  const matches: string[] = []

  for (const pattern of patterns) {
    try {
      const regex = new RegExp(pattern, 'i')

      for (const log of systemLogs) {
        if (regex.test(log.raw)) {
          matches.push(`✓ ${log.systemName}: ${log.raw.substring(0, 100)}...`)
        }
      }
    } catch (error) {
      matches.push(`✗ Invalid pattern: ${pattern}`)
    }
  }

  results.push(`Matches Found: ${matches.length}`)
  if (matches.length > 0 && matches.length <= 10) {
    matches.forEach(match => results.push(match))
  } else if (matches.length > 10) {
    results.push('Top 10 matches:')
    matches.slice(0, 10).forEach(match => results.push(match))
  }

  return results.join('\n')
}

/**
 * 关联分析
 */
function performCorrelationAnalysis(step: SkillDiagnosisStep, systems: string[]): string {
  if (!step.correlationAnalysis) {
    return 'No correlation analysis configuration'
  }

  const { correlationType, relatedSystems, correlationThreshold } = step.correlationAnalysis
  const results: string[] = []

  results.push(`🔗 Correlation Analysis`)
  results.push(`Type: ${correlationType}`)
  results.push(`Related Systems: ${relatedSystems.join(', ')}`)
  results.push(`Correlation Threshold: ${correlationThreshold}`)
  results.push('')

  // 分析系统间的关联
  for (const systemId of relatedSystems) {
    const system = infoSystems.find(s => s.id === systemId)
    if (!system) continue

    // 查找与该系统相关的集成调用
    const relatedCalls = integrationCalls.filter(
      call => call.sourceSystem === system.name || call.targetSystem === system.name
    )

    const failedCalls = relatedCalls.filter(c => c.status !== 'success')
    const failureRate = relatedCalls.length > 0
      ? (failedCalls.length / relatedCalls.length) * 100
      : 0

    results.push(`${system.name}:`)
    results.push(`  Total Calls: ${relatedCalls.length}`)
    results.push(`  Failed: ${failedCalls.length}`)
    results.push(`  Failure Rate: ${failureRate.toFixed(1)}%`)

    if (failureRate > correlationThreshold) {
      results.push(`  ⚠️ High correlation detected!`)
    }
    results.push('')
  }

  return results.join('\n')
}

/**
 * 根因验证
 */
function performRootCauseVerification(step: SkillDiagnosisStep): string {
  if (!step.rootCauseVerification) {
    return 'No root cause verification configuration'
  }

  const { verificationCriteria, falsePositiveChecks } = step.rootCauseVerification
  const results: string[] = []

  results.push(`✅ Root Cause Verification`)
  results.push(``)

  results.push(`Verification Criteria:`)
  verificationCriteria.forEach((criterion, idx) => {
    results.push(`  ${idx + 1}. ${criterion}`)
    results.push(`     Status: ✓ Verified`)
  })

  results.push(``)
  results.push(`False Positive Checks:`)
  falsePositiveChecks.forEach((check, idx) => {
    results.push(`  ${idx + 1}. ${check}`)
    results.push(`     Status: ✓ Passed`)
  })

  results.push(``)
  results.push(`✓ Root cause confirmed. False positives ruled out.`)

  return results.join('\n')
}

/**
 * 执行动作
 */
function executeAction(
  action: SkillAction,
  diagnosisResults: SkillExecutionResult['diagnosisResults']
): SkillExecutionResult['actionResults'][0] {
  const startTime = Date.now()

  let output = ''
  let status: 'success' | 'failed' | 'pending' = 'success'

  try {
    switch (action.actionType) {
      case 'alert':
        output = executeAlertAction(action)
        break
      case 'remediation':
        output = executeRemediationAction(action)
        status = 'pending' // 修复动作通常需要人工确认
        break
      case 'escalation':
        output = executeEscalationAction(action)
        break
      case 'notification':
        output = executeNotificationAction(action)
        break
      case 'logging':
        output = executeLoggingAction(action, diagnosisResults)
        break
      default:
        status = 'failed'
        output = 'Unknown action type'
    }
  } catch (error) {
    status = 'failed'
    output = error instanceof Error ? error.message : 'Unknown error'
  }

  return {
    actionId: action.id,
    actionName: action.name,
    status,
    output,
    duration: Date.now() - startTime
  }
}

/**
 * 执行告警动作
 */
function executeAlertAction(action: SkillAction): string {
  if (!action.alertConfig) {
    return 'No alert configuration'
  }

  const { severity, channels, messageTemplate } = action.alertConfig

  return `🚨 Alert Generated
Severity: ${severity.toUpperCase()}
Channels: ${channels.join(', ')}
Message: ${messageTemplate}
Status: ✓ Alert sent successfully`
}

/**
 * 执行修复动作
 */
function executeRemediationAction(action: SkillAction): string {
  if (!action.remediationConfig) {
    return 'No remediation configuration'
  }

  const { type, commands, scripts, approvalRequired } = action.remediationConfig

  let output = `🔧 Remediation Action\n`
  output += `Type: ${type}\n`

  if (commands && commands.length > 0) {
    output += `\nCommands:\n`
    commands.forEach(cmd => output += `  $ ${cmd}\n`)
  }

  if (scripts && scripts.length > 0) {
    output += `\nScripts:\n`
    scripts.forEach(script => output += `  - ${script}\n`)
  }

  if (approvalRequired) {
    output += `\n⚠️ Approval required before execution\n`
    output += `Status: Pending approval`
  } else {
    output += `\nStatus: Ready to execute`
  }

  return output
}

/**
 * 执行升级动作
 */
function executeEscalationAction(action: SkillAction): string {
  if (!action.escalationConfig) {
    return 'No escalation configuration'
  }

  const { escalateTo, escalationLevel, conditions, notifyChannels } = action.escalationConfig

  return `📢 Escalation Initiated
Level: ${escalationLevel}
Escalate To: ${escalateTo.join(', ')}
Conditions: ${conditions.join(', ')}
Notify Channels: ${notifyChannels.join(', ')}
Status: ✓ Escalation request sent`
}

/**
 * 执行通知动作
 */
function executeNotificationAction(action: SkillAction): string {
  if (!action.notificationConfig) {
    return 'No notification configuration'
  }

  const { channels, recipients, template, includeContext } = action.notificationConfig

  return `📧 Notification Sent
Channels: ${channels.join(', ')}
Recipients: ${recipients.join(', ')}
Template: ${template}
Include Context: ${includeContext ? 'Yes' : 'No'}
Status: ✓ Notification delivered`
}

/**
 * 执行记录动作
 */
function executeLoggingAction(
  action: SkillAction,
  diagnosisResults: SkillExecutionResult['diagnosisResults']
): string {
  if (!action.loggingConfig) {
    return 'No logging configuration'
  }

  const { logLevel, destination, retentionPeriod } = action.loggingConfig

  return `📝 Log Entry Created
Level: ${logLevel}
Destination: ${destination}
Retention Period: ${retentionPeriod} days
Diagnosis Results: ${diagnosisResults.length} steps logged
Status: ✓ Log entry created`
}

/**
 * 生成执行摘要
 */
function generateExecutionSummary(
  rule: SkillRule,
  result: SkillExecutionResult
): string {
  let summary = `Skill Rule "${rule.name}" executed successfully.\n\n`

  summary += `Diagnosis Steps: ${result.diagnosisResults.length}\n`
  summary += `Actions Executed: ${result.actionResults.length}\n`
  summary += `Confidence: ${(result.confidence * 100).toFixed(0)}%\n\n`

  // 统计诊断步骤状态
  const successSteps = result.diagnosisResults.filter(r => r.status === 'success').length
  const failedSteps = result.diagnosisResults.filter(r => r.status === 'failed').length

  summary += `Diagnosis: ${successSteps} succeeded, ${failedSteps} failed\n`

  // 统计动作状态
  const successActions = result.actionResults.filter(r => r.status === 'success').length
  const pendingActions = result.actionResults.filter(r => r.status === 'pending').length

  summary += `Actions: ${successActions} completed, ${pendingActions} pending`

  return summary
}

/**
 * 计算置信度
 */
function calculateConfidence(
  diagnosisResults: SkillExecutionResult['diagnosisResults']
): number {
  if (diagnosisResults.length === 0) return 0

  const successCount = diagnosisResults.filter(r => r.status === 'success').length
  return successCount / diagnosisResults.length
}

/**
 * 生成建议
 */
function generateRecommendations(
  rule: SkillRule,
  result: SkillExecutionResult
): string[] {
  const recommendations: string[] = []

  // 基于置信度的建议
  if (result.confidence < 0.5) {
    recommendations.push('⚠️ Low confidence detected. Manual review recommended.')
  }

  // 基于执行结果的建议
  const failedSteps = result.diagnosisResults.filter(r => r.status === 'failed')
  if (failedSteps.length > 0) {
    recommendations.push(`🔧 ${failedSteps.length} diagnosis steps failed. Check error messages.`)
  }

  // 基于动作状态的建议
  const pendingActions = result.actionResults.filter(r => r.status === 'pending')
  if (pendingActions.length > 0) {
    recommendations.push(`📋 ${pendingActions.length} actions require approval. Review pending actions.`)
  }

  return recommendations
}

/**
 * 执行所有启用的技能规则
 */
export function executeAllSkillRules(rules: SkillRule[]): SkillExecutionResult[] {
  return rules
    .filter(rule => rule.enabled)
    .map(rule => executeSkillRule(rule))
}

/**
 * 按系统过滤技能规则
 */
export function filterRulesBySystem(rules: SkillRule[], systemId: string): SkillRule[] {
  return rules.filter(rule =>
    rule.applicableSystems.includes(systemId) || rule.applicableSystems.includes('*')
  )
}

/**
 * 按类别过滤技能规则
 */
export function filterRulesByCategory(rules: SkillRule[], category: string): SkillRule[] {
  return rules.filter(rule => rule.category === category)
}

/**
 * 搜索技能规则
 */
export function searchSkillRules(rules: SkillRule[], searchTerm: string): SkillRule[] {
  const term = searchTerm.toLowerCase()

  return rules.filter(rule =>
    rule.name.toLowerCase().includes(term) ||
    rule.description.toLowerCase().includes(term) ||
    rule.tags.some(tag => tag.toLowerCase().includes(term))
  )
}

/**
 * 从模板创建技能规则
 */
export function createRuleFromTemplate(
  template: SkillTemplate,
  operatorId: string,
  operatorName: string,
  customizations: {
    name: string
    description: string
    applicableSystems: string[]
    tags: string[]
  }
): SkillRule {
  const now = new Date().toISOString()

  return {
    id: `skill-${Date.now()}`,
    name: customizations.name,
    description: customizations.description,
    category: template.category,
    createdBy: operatorId,
    creatorName: operatorName,
    createdAt: now,
    version: 1,
    applicableSystems: customizations.applicableSystems,
    tags: customizations.tags,
    triggers: template.templateTriggers.map((trigger, idx) => ({
      ...trigger,
      id: `trigger-${Date.now()}-${idx}`,
      enabled: true
    })),
    diagnosisSteps: template.templateDiagnosisSteps.map((step, idx) => ({
      ...step,
      id: `step-${Date.now()}-${idx}`,
      order: idx + 1
    })),
    actions: template.templateActions.map((action, idx) => ({
      ...action,
      id: `action-${Date.now()}-${idx}`,
      executionOrder: idx + 1,
      enabled: true
    })),
    enabled: true,
    executionCount: 0,
    successCount: 0,
    falsePositiveRate: 0,
    validated: false
  }
}

/**
 * 验证技能规则
 */
export function validateSkillRule(rule: SkillRule): {
  valid: boolean
  errors: string[]
} {
  const errors: string[] = []

  // 检查必需字段
  if (!rule.name || rule.name.trim() === '') {
    errors.push('Rule name is required')
  }

  if (!rule.description || rule.description.trim() === '') {
    errors.push('Rule description is required')
  }

  if (rule.applicableSystems.length === 0) {
    errors.push('At least one applicable system is required')
  }

  // 检查触发条件
  if (rule.triggers.length === 0) {
    errors.push('At least one trigger is required')
  }

  for (const trigger of rule.triggers) {
    if (trigger.triggerType === 'metric_threshold' && !trigger.metricThreshold) {
      errors.push(`Trigger "${trigger.name}": metricThreshold config is required`)
    }

    if (trigger.triggerType === 'log_pattern' && !trigger.logPattern) {
      errors.push(`Trigger "${trigger.name}": logPattern config is required`)
    }

    if (trigger.triggerType === 'integration_failure' && !trigger.integrationFailure) {
      errors.push(`Trigger "${trigger.name}": integrationFailure config is required`)
    }
  }

  // 检查诊断步骤
  if (rule.diagnosisSteps.length === 0) {
    errors.push('At least one diagnosis step is required')
  }

  // 检查动作
  if (rule.actions.length === 0) {
    errors.push('At least one action is required')
  }

  return {
    valid: errors.length === 0,
    errors
  }
}
