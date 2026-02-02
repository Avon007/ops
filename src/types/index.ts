/**
 * Type Definitions for Information System Operations Assistant
 * 信息系统运维助手类型定义
 */

// Information System Types
export interface InfoSystem {
  id: string
  name: string
  type: 'ERP' | 'CRM' | 'OA' | 'DATA_PLATFORM' | 'PAYMENT' | 'MES' | 'WMS'
  version: string
  status: 'normal' | 'degraded' | 'down'
  owner: string
  endpoint: string
  dependencies: string[] // 依赖的其他系统ID
}

// Log Entry Types - 支持多种日志格式
export interface SystemLog {
  id: string
  systemId: string
  systemName: string
  timestamp: string
  level: 'INFO' | 'WARN' | 'ERROR' | 'DEBUG'
  format: 'json' | 'xml' | 'csv' | 'custom' | 'syslog'
  raw: string // 原始日志
  parsed?: LogData // 解析后的结构化数据
}

export interface LogData {
  message: string
  module?: string
  transactionId?: string
  userId?: string
  errorCode?: string
  duration?: number
  metadata?: Record<string, any>
}

// Network Packet Types
export interface NetworkPacket {
  id: string
  timestamp: string
  protocol: 'HTTP' | 'HTTPS' | 'TCP' | 'FTP' | 'SOAP' | 'REST'
  sourceIp: string
  sourcePort: number
  destIp: string
  destPort: number
  size: number
  direction: 'inbound' | 'outbound'
  status: 'success' | 'failed' | 'timeout' | 'refused'
  method?: string // HTTP方法
  path?: string // HTTP路径
  responseCode?: number
  latency?: number
  payload?: string
  headers?: Record<string, string>
}

// System Integration Call Types
export interface IntegrationCall {
  id: string
  timestamp: string
  sourceSystem: string
  targetSystem: string
  interfaceType: 'REST_API' | 'SOAP' | 'MQ' | 'FILE_TRANSFER' | 'DATABASE'
  operation: string
  businessFlow: string // 所属业务流程
  status: 'success' | 'failed' | 'partial' | 'timeout'
  duration: number
  requestSize: number
  responseSize: number
  errorCode?: string
  errorMessage?: string
  retryCount?: number
}

// Business Transaction Types
export interface BusinessTransaction {
  id: string
  flowId: string
  flowName: string
  timestamp: string
  status: 'completed' | 'failed' | 'pending' | 'rolled_back'
  steps: TransactionStep[]
  totalTime: number
  userId?: string
}

export interface TransactionStep {
  stepId: string
  system: string
  operation: string
  status: 'success' | 'failed' | 'skipped'
  duration: number
  error?: string
}

// Issue Types for Information Systems
export interface SystemIssue {
  id: string
  severity: 'critical' | 'high' | 'medium' | 'low'
  category: 'integration' | 'data_consistency' | 'performance' | 'security' | 'availability' | 'network_block' | 'firewall_block'
  title: string
  description: string
  affectedSystems: string[]
  rootCause?: string
  evidence: Evidence[]
  businessImpact: string
  suggestedActions: string[]
  relatedTransactions?: string[]
}

// Network Security Device - 安全隔离装置
export interface SecurityDevice {
  id: string
  name: string
  type: 'firewall' | 'ids' | 'ips' | 'proxy' | 'vpn_gateway' | 'security_gateway'
  vendor: string
  model: string
  version: string
  status: 'online' | 'offline' | 'degraded' | 'blocked'
  ipAddress: string
  managedSystems: string[] // 管理的系统ID
  rules: SecurityRule[]
  blockedConnections: BlockedConnection[]
  lastConfigChange: string
}

// Security Rule - 安全规则
export interface SecurityRule {
  id: string
  ruleId: string
  name: string
  ruleType: 'allow' | 'deny' | 'reject' | 'monitor'
  direction: 'inbound' | 'outbound' | 'bidirectional'
  sourceAddress: string
  sourcePort: number | string
  destinationAddress: string
  destinationPort: number | string
  protocol: 'TCP' | 'UDP' | 'ICMP' | 'ANY'
  enabled: boolean
  hitCount: number // 命中次数
  lastHit: string
  createdAt: string
  createdBy: string
}

// Blocked Connection - 被阻断的连接
export interface BlockedConnection {
  id: string
  timestamp: string
  deviceId: string
  deviceName: string
  ruleId: string
  ruleName: string
  sourceIp: string
  sourcePort: number
  destinationIp: string
  destinationPort: number
  protocol: 'TCP' | 'UDP' | 'ICMP'
  blockReason: string
  action: 'blocked' | 'dropped' | 'rejected'
  severity: 'info' | 'warning' | 'critical'
  attemptCount: number // 尝试次数
  firstAttempt: string
  lastAttempt: string
}

// Port Block Issue - 端口阻塞问题
export interface PortBlockIssue {
  id: string
  timestamp: string
  systemName: string
  systemType: string
  portType: 'network_port' | 'application_port' | 'database_port' | 'service_port'
  portNumber: number
  protocol: 'TCP' | 'UDP'
  status: 'blocked' | 'filtered' | 'timeout' | 'refused'
  blockReason: string
  affectedService: string
  impactScope: string[] // 受影响的服务列表
  detectionMethod: 'port_scan' | 'connection_test' | 'timeout_detection' | 'log_analysis'
  relatedDevices: string[] // 相关的安全设备
  suggestedActions: string[]
  resolved: boolean
  resolvedAt?: string
  resolutionNotes?: string
}

// Network Diagnostic Result - 网络诊断结果
export interface NetworkDiagnostic {
  id: string
  timestamp: string
  sourceIp: string
  targetIp: string
  targetPort: number
  testType: 'ping' | 'traceroute' | 'port_scan' | 'telnet' | 'curl' | 'nslookup'
  result: 'success' | 'failed' | 'timeout' | 'partial'
  details: {
    latency?: number
    hopCount?: number
    packetLoss?: number
    reachable?: boolean
    openPorts?: number[]
    error?: string
  }
  intermediateHops?: {
    hopNumber: number
    ipAddress: string
    hostname?: string
    latency: number
  }[]
}

export interface Evidence {
  type: 'log' | 'packet' | 'call' | 'metric'
  source: string
  description: string
  data: any
  timestamp: string
}

// Diagnosis Report for Information Systems
export interface SystemDiagnosisReport {
  id: string
  timestamp: string
  overallStatus: 'healthy' | 'degraded' | 'critical'
  summary: string
  issues: SystemIssue[]
  analysisChain: AnalysisStep[] // CoT分析链
  analyzedLogs: number
  analyzedPackets: number
  analyzedCalls: number
  recommendations: string[]
  businessImpactSummary: string
}

export interface AnalysisStep {
  step: number
  phase: string // "数据收集" | "模式识别" | "根因分析" | "影响评估"
  description: string
  findings: string[]
  reasoning: string
}

// Message Types for Chat
export interface ChatMessage {
  id: string
  role: 'assistant' | 'user'
  content: string
  timestamp: string
  analysisResult?: SystemDiagnosisReport
  thinkingProcess?: AnalysisStep[]
}

// Server Types (保留用于基础设施监控)
export interface Server {
  id: string
  name: string
  ip: string
  status: 'online' | 'warning' | 'offline'
  uptime: string
  load: number[]
  cpu: number
  memory: number
  disk: number
}

// Metric Types
export interface Metric {
  label: string
  value: string | number
  change: number
  changeType: 'up' | 'down' | 'stable'
  status: 'positive' | 'warning' | 'info'
}

// Activity Log Types
export interface Activity {
  id: string
  title: string
  description: string
  type: 'success' | 'warning' | 'info'
  badge: string
  timestamp: string
}

// Quick Command Types
export interface QuickCommand {
  id: string
  label: string
  icon: string
  action: string
}

// Dialog Types
export interface DialogState {
  isOpen: boolean
  title: string
  message: string
  type: 'info' | 'warning' | 'success' | 'error'
  onConfirm?: () => void
  onCancel?: () => void
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}

// Command Types for AI Assistant
export interface Command {
  type: 'status' | 'restart' | 'deploy' | 'logs' | 'help' | 'analyze' | 'diagnose' | 'trace' | 'data_analysis' | 'capacity' | 'sla' | 'topology' | 'skill' | 'view_skills' | 'execute_skills' | 'port_block' | 'security'
  target?: string
  params?: Record<string, any>
}

// Navigation Types
export interface NavItem {
  id: string
  label: string
  icon: string
  active: boolean
}

// ==================== Full-link Monitoring Types ====================

// Distributed Tracing - 分布式追踪
export interface Trace {
  id: string
  traceId: string
  timestamp: string
  duration: number
  status: 'success' | 'error' | 'timeout'
  userId?: string
  businessFlow: string
  entrySystem: string
  faultType?: string
  spans: Span[]
  tags: Record<string, string>
}

export interface Span {
  spanId: string
  parentSpanId?: string
  system: string
  operation: string
  startTime: string
  duration: number
  status: 'success' | 'error' | 'timeout'
  tags: Record<string, string>
  logs: SpanLog[]
  metrics: SpanMetrics
}

export interface SpanLog {
  timestamp: string
  level: 'info' | 'warn' | 'error'
  message: string
}

export interface SpanMetrics {
  cpuUsage?: number
  memoryUsage?: number
  dbQueryCount?: number
  cacheHitRate?: number
  networkIo?: number
}

// Timeline Event - 时间线事件
export interface TimelineEvent {
  timestamp: string
  type: 'info' | 'warning' | 'error' | 'user_action' | 'metric' | 'alert'
  event: string
  details?: string
}

// Analysis Result - 分析结果
export interface AnalysisResult {
  summary: string
  keyFindings: Finding[]
  bottlenecks?: Bottleneck[]
  recommendations?: Recommendation[]
  timestamp?: string
  overallHealth?: string
  relatedInsights?: any[]
}

export interface Finding {
  severity: 'critical' | 'high' | 'medium' | 'low' | 'warning'
  title: string
  description: string
  category?: string
  metrics?: any
  impact?: string
}

export interface Bottleneck {
  system: string
  operation: string
  description: string
  currentValue: number
  baselineValue: number
  type?: string
  impactLevel?: string
  suggestedActions?: string[]
}

export interface Recommendation {
  priority: 'urgent' | 'high' | 'medium' | 'low'
  title: string
  description: string
  expectedBenefit?: string
  category?: string
  effort?: string
}

// Service Performance Metrics - 服务性能指标
export interface ServiceMetrics {
  systemId: string
  systemName: string
  timestamp: string
  timeframe: '1m' | '5m' | '15m' | '1h' | '1d'

  // Request metrics
  requestCount: number
  requestSuccessRate: number
  requestErrorRate: number
  requestLatency: {
    p50: number
    p95: number
    p99: number
    avg: number
  }

  // Resource metrics
  cpuUsage: number
  memoryUsage: number
  diskUsage: number
  networkIn: number
  networkOut: number

  // Business metrics
  activeUsers: number
  transactionCount: number
  businessValue?: number

  // Integration metrics
  upstreamCallCount: number
  upstreamFailureRate: number
  downstreamCallCount: number
  downstreamFailureRate: number
}

// Dependency Graph - 依赖关系图
export interface DependencyNode {
  id: string
  name: string
  type: string
  status: 'healthy' | 'warning' | 'error'
  metrics: {
    requestCount: number
    errorRate: number
    avgLatency: number
  }
}

export interface DependencyEdge {
  source: string
  target: string
  type: 'REST' | 'SOAP' | 'MQ' | 'DATABASE' | 'FILE'
  metrics: {
    requestCount: number
    errorRate: number
    avgLatency: number
  }
  status: 'healthy' | 'warning' | 'error'
}

export interface DependencyGraph {
  nodes: DependencyNode[]
  edges: DependencyEdge[]
  timestamp: string
}

// Performance Baseline - 性能基线
export interface PerformanceBaseline {
  systemId: string
  metricName: string
  baselineValue: number
  thresholdWarning: number
  thresholdCritical: number
  calculatedFrom: string
  calculatedAt: string
}

// Anomaly Detection - 异常检测
export interface Anomaly {
  id: string
  timestamp: string
  system: string
  metricName: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  type: 'spike' | 'drop' | 'trend' | 'pattern'
  currentValue: number
  expectedValue: number
  deviation: number
  description: string
  relatedTraces?: string[]
}

// Capacity Planning - 容量规划
export interface CapacityForecast {
  systemId: string
  systemName: string
  metricType: 'cpu' | 'memory' | 'storage' | 'throughput'
  currentValue: number
  forecastData: ForecastPoint[]
  recommendedActions: string[]
  predictedExhaustionDate?: string
}

export interface ForecastPoint {
  date: string
  predictedValue: number
  confidence: number
}

// SLA Monitoring - SLA监控
export interface SLAMetric {
  id: string
  serviceName: string
  slaTarget: number // 目标值（百分比）
  currentValue: number
  status: 'compliant' | 'warning' | 'breached'
  measurementPeriod: string
  incidents: SLAIncident[]
}

export interface SLAIncident {
  timestamp: string
  duration: number
  impact: string
  description: string
}

// Alert - 告警
export interface Alert {
  id: string
  timestamp: string
  severity: 'info' | 'warning' | 'critical' | 'emergency'
  status: 'active' | 'acknowledged' | 'resolved'
  source: string
  title: string
  description: string
  affectedSystems: string[]
  metricName?: string
  threshold?: number
  currentValue?: number
  suggestedActions?: string[]
  relatedAlerts?: string[]
}

// Change Management - 变更管理
export interface ChangeRecord {
  id: string
  timestamp: string
  type: 'deployment' | 'config_change' | 'emergency_fix' | 'planned_maintenance'
  system: string
  description: string
  status: 'pending' | 'in_progress' | 'completed' | 'rolled_back'
  executedBy: string
  approvedBy: string
  impact: 'low' | 'medium' | 'high'
  preChangeMetrics?: Record<string, number>
  postChangeMetrics?: Record<string, number>
  relatedIncidents?: string[]
}

// Insight - 数据分析洞察
export interface Insight {
  id: string
  type: 'performance' | 'reliability' | 'capacity' | 'security' | 'trend'
  severity: 'info' | 'warning' | 'critical'
  title: string
  description: string
  affectedSystems: string[]
  metrics: {
    name: string
    currentValue: number
    baselineValue: number
    change: number
    trend: 'up' | 'down' | 'stable'
  }[]
  recommendations: string[]
  confidence: number
  generatedAt: string
}

// ==================== Skill Library Types - 专家技能知识库 ====================

// 技能触发条件
export interface SkillTrigger {
  id: string
  name: string
  description: string

  // 触发类型
  triggerType: 'metric_threshold' | 'log_pattern' | 'integration_failure' | 'custom'

  // 指标阈值触发
  metricThreshold?: {
    systemId: string
    metricName: string // 'cpu' | 'memory' | 'errorRate' | 'latency'
    operator: '>' | '<' | '>=' | '<=' | '==' | '!='
    threshold: number
    duration?: number // 持续时间（秒）
  }

  // 日志模式触发
  logPattern?: {
    systemId?: string
    logLevel?: ('ERROR' | 'WARN' | 'DEBUG')[]
    pattern: string // 正则表达式
    occurrenceThreshold?: number // 出现次数阈值
    timeWindow?: number // 时间窗口（秒）
  }

  // 集成失败触发
  integrationFailure?: {
    sourceSystem: string
    targetSystem: string
    operation?: string
    errorRate?: number // 错误率阈值（百分比）
    failureCount?: number // 失败次数阈值
    timeWindow?: number // 时间窗口（秒）
  }

  // 自定义触发条件
  customCondition?: {
    expression: string // 自定义表达式
    parameters?: Record<string, any>
  }

  enabled: boolean
}

// 诊断步骤
export interface SkillDiagnosisStep {
  id: string
  name: string
  description: string
  order: number

  // 步骤类型
  stepType: 'data_collection' | 'pattern_matching' | 'correlation_analysis' | 'root_cause_verification'

  // 数据收集
  dataCollection?: {
    sources: ('logs' | 'metrics' | 'traces' | 'network_packets' | 'integration_calls')[]
    filters: Record<string, any>
    timeRange: number // 时间范围（秒）
  }

  // 模式匹配
  patternMatching?: {
    patterns: string[]
    matchingAlgorithm: 'regex' | 'fuzzy' | 'semantic'
    confidenceThreshold: number
  }

  // 关联分析
  correlationAnalysis?: {
    correlationType: 'temporal' | 'causal' | 'dependency'
    relatedSystems: string[]
    correlationThreshold: number
  }

  // 根因验证
  rootCauseVerification?: {
    verificationCriteria: string[]
    falsePositiveChecks: string[]
  }

  expectedOutput: string
}

// 执行动作
export interface SkillAction {
  id: string
  name: string
  description: string
  actionType: 'alert' | 'remediation' | 'escalation' | 'notification' | 'logging'

  // 告警动作
  alertConfig?: {
    severity: 'info' | 'warning' | 'critical' | 'emergency'
    channels: ('dashboard' | 'email' | 'sms' | 'webhook')[]
    messageTemplate: string
    recipients?: string[]
  }

  // 修复动作
  remediationConfig?: {
    type: 'auto' | 'manual' | 'semi_auto'
    commands?: string[]
    scripts?: string[]
    rollbackPlan?: string
    approvalRequired: boolean
  }

  // 升级动作
  escalationConfig?: {
    escalateTo: string[] // 升级到的角色或人员
    escalationLevel: number
    conditions: string[]
    notifyChannels: ('email' | 'sms' | 'call')[]
  }

  // 通知动作
  notificationConfig?: {
    channels: ('email' | 'slack' | 'teams' | 'webhook')[]
    recipients: string[]
    template: string
    includeContext: boolean
  }

  // 记录动作
  loggingConfig?: {
    logLevel: 'INFO' | 'WARN' | 'ERROR'
    destination: 'system_log' | 'audit_log' | 'incident_ticket'
    retentionPeriod: number // 保留期（天）
  }

  executionOrder: number
  enabled: boolean
}

// 技能规则
export interface SkillRule {
  id: string
  name: string
  description: string
  category: 'performance' | 'availability' | 'integration' | 'security' | 'capacity' | 'custom'

  // 创建者信息
  createdBy: string // 运维人员ID
  creatorName: string
  createdAt: string

  // 修改信息
  modifiedBy?: string
  modifiedAt?: string
  version: number

  // 适用范围
  applicableSystems: string[] // 适用的系统ID
  tags: string[]

  // 触发条件（支持多个，OR关系）
  triggers: SkillTrigger[]

  // 诊断步骤（按顺序执行）
  diagnosisSteps: SkillDiagnosisStep[]

  // 执行动作
  actions: SkillAction[]

  // 元数据
  enabled: boolean
  executionCount: number // 执行次数
  successCount: number // 成功次数
  falsePositiveRate: number // 误报率

  // 验证和评审
  validated: boolean
  validatedBy?: string
  validatedAt?: string
  lastExecutedAt?: string

  // 文档
  documentation?: string
  examples?: string[]
}

// 运维人员档案
export interface OperatorProfile {
  id: string
  name: string
  email: string
  role: 'junior' | 'senior' | 'expert' | 'architect'
  specializations: string[] // 专长领域
  createdAt: string

  // 技能库
  skillRules: SkillRule[]

  // 统计信息
  totalSkills: number
  activeSkills: number
  totalExecutions: number
  averageSuccessRate: number

  // 偏好设置
  preferences: {
    defaultSeverity: 'info' | 'warning' | 'critical'
    notificationChannels: string[]
    language: 'zh-CN' | 'en-US'
  }
}

// 技能模板
export interface SkillTemplate {
  id: string
  name: string
  description: string
  category: 'performance' | 'availability' | 'integration' | 'security' | 'capacity'

  // 预定义的触发条件
  templateTriggers: Omit<SkillTrigger, 'id'>[]

  // 预定义的诊断步骤
  templateDiagnosisSteps: Omit<SkillDiagnosisStep, 'id'>[]

  // 预定义的动作
  templateActions: Omit<SkillAction, 'id'>[]

  // 适用场景
  useCases: string[]

  // 使用统计
  usageCount: number

  // 创建者
  createdBy: string
  createdAt: string

  // 是否为系统模板
  isSystemTemplate: boolean
}

// 技能执行结果
export interface SkillExecutionResult {
  executionId: string
  ruleId: string
  ruleName: string
  executedBy: string
  executedAt: string

  // 触发信息
  triggeredBy: {
    triggerType: string
    triggerData: Record<string, any>
    timestamp: string
  }

  // 执行状态
  status: 'success' | 'partial_success' | 'failed' | 'false_positive'

  // 诊断结果
  diagnosisResults: {
    stepId: string
    stepName: string
    status: 'success' | 'failed' | 'skipped'
    output: string
    duration: number
  }[]

  // 动作执行结果
  actionResults: {
    actionId: string
    actionName: string
    status: 'success' | 'failed' | 'pending'
    output: string
    duration: number
  }[]

  // 总体结果
  summary: string
  confidence: number

  // 影响范围
  affectedSystems: string[]
  businessImpact: string

  // 执行时长
  totalDuration: number

  // 错误信息
  errors?: string[]

  // 后续建议
  recommendations?: string[]
}

// 技能执行历史
export interface SkillExecutionHistory {
  id: string
  executions: SkillExecutionResult[]
  totalPages: number
  currentPage: number
  pageSize: number
  totalCount: number
}

// ==================== UI Configuration Types - 页面布局个性化配置 ====================

// 布局模式
export type LayoutMode = 'default' | 'compact' | 'spacious' | 'sidebar-left' | 'sidebar-right' | 'no-sidebar'

// 卡片大小
export type CardSize = 'small' | 'medium' | 'large' | 'auto'

// 布局配置
export interface LayoutConfig {
  mode: LayoutMode
  sidebarWidth: number
  sidebarCollapsed: boolean
  showHeader: boolean
  showFooter: boolean
  cardSize: CardSize
  cardsPerRow: number
  gapSize: 'small' | 'medium' | 'large'
}

// 显示配置
export interface DisplayConfig {
  showSystemStatus: boolean
  showMetrics: boolean
  showCharts: boolean
  showLogs: boolean
  showAlerts: boolean
  compactMode: boolean
  animationsEnabled: boolean
  transitionsEnabled: boolean
}

// 字体配置
export interface FontConfig {
  size: 'small' | 'medium' | 'large' | 'extra-large'
  family: string
  lineHeight: number
}

// 个性化配置
export interface UserPreferences {
  layout: LayoutConfig
  display: DisplayConfig
  font: FontConfig
  language: 'zh-CN' | 'en-US'
  timezone: string
  dateFormat: 'YYYY-MM-DD' | 'MM/DD/YYYY' | 'DD/MM/YYYY'
  timeFormat: '24h' | '12h'
  notifications: {
    enabled: boolean
    sound: boolean
    desktop: boolean
    position: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'
  }
  dataRefresh: {
    interval: number // seconds
    autoRefresh: boolean
  }
}
