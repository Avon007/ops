/**
 * Full-link Monitoring Mock Data
 * 全链路监测 Mock 数据
 */

import type {
  Trace,
  ServiceMetrics,
  DependencyGraph,
  Anomaly,
  CapacityForecast,
  SLAMetric,
  Alert,
  ChangeRecord,
  Insight
} from '@/types'

// ==================== Distributed Tracing (分布式追踪) ====================
export const traces: Trace[] = [
  // 成功的订单流程
  {
    id: 'TRACE-001',
    traceId: 'trace-order-success-001',
    timestamp: '2025-01-29T15:30:00.000Z',
    duration: 2450,
    status: 'success',
    userId: 'user123',
    businessFlow: '订单到现金',
    entrySystem: 'ERP系统',
    tags: {
      businessType: 'order',
      channel: 'web',
      region: 'cn-north'
    },
    spans: [
      {
        spanId: 'span-1',
        system: 'ERP系统',
        operation: 'createOrder',
        startTime: '2025-01-29T15:30:00.000Z',
        duration: 200,
        status: 'success',
        tags: { orderId: 'ORD-20250129-001' },
        logs: [],
        metrics: { cpuUsage: 45, memoryUsage: 60, dbQueryCount: 3 }
      },
      {
        spanId: 'span-2',
        parentSpanId: 'span-1',
        system: '数据中台',
        operation: 'validateCustomer',
        startTime: '2025-01-29T15:30:00.200Z',
        duration: 350,
        status: 'success',
        tags: { customerId: 'C-001' },
        logs: [],
        metrics: { cpuUsage: 55, memoryUsage: 70, cacheHitRate: 85 }
      },
      {
        spanId: 'span-3',
        parentSpanId: 'span-1',
        system: '支付网关',
        operation: 'processPayment',
        startTime: '2025-01-29T15:30:00.550Z',
        duration: 1800,
        status: 'success',
        tags: { paymentMethod: 'wechat', amount: '5600.00' },
        logs: [
          { timestamp: '2025-01-29T15:30:01.000Z', level: 'info', message: '支付请求已发送' },
          { timestamp: '2025-01-29T15:30:02.350Z', level: 'info', message: '支付成功' }
        ],
        metrics: { cpuUsage: 35, memoryUsage: 50, networkIo: 1024 }
      },
      {
        spanId: 'span-4',
        parentSpanId: 'span-1',
        system: 'CRM系统',
        operation: 'updateCustomerPoints',
        startTime: '2025-01-29T15:30:02.350Z',
        duration: 100,
        status: 'success',
        tags: {},
        logs: [],
        metrics: { cpuUsage: 40, memoryUsage: 55 }
      }
    ]
  },

  // 失败的请假审批流程
  {
    id: 'TRACE-002',
    traceId: 'trace-leave-fail-001',
    timestamp: '2025-01-29T15:18:00.000Z',
    duration: 30000,
    status: 'timeout',
    userId: 'user456',
    businessFlow: '请假审批',
    entrySystem: 'OA办公系统',
    tags: {
      businessType: 'leave',
      leaveType: 'annual'
    },
    spans: [
      {
        spanId: 'span-5',
        system: 'OA办公系统',
        operation: 'approveLeave',
        startTime: '2025-01-29T15:18:00.000Z',
        duration: 200,
        status: 'success',
        tags: { leaveId: 'LV-001' },
        logs: [],
        metrics: { cpuUsage: 30, memoryUsage: 45 }
      },
      {
        spanId: 'span-6',
        parentSpanId: 'span-5',
        system: 'OA办公系统',
        operation: 'syncToERP',
        startTime: '2025-01-29T15:18:00.200Z',
        duration: 29800,
        status: 'timeout',
        tags: { targetSystem: 'ERP系统' },
        logs: [
          { timestamp: '2025-01-29T15:18:05.000Z', level: 'warn', message: '首次重试' },
          { timestamp: '2025-01-29T15:18:15.000Z', level: 'warn', message: '第二次重试' },
          { timestamp: '2025-01-29T15:18:25.000Z', level: 'error', message: '超时，放弃重试' }
        ],
        metrics: { cpuUsage: 65, memoryUsage: 70, networkIo: 512 }
      }
    ]
  },

  // 客户数据同步失败
  {
    id: 'TRACE-003',
    traceId: 'trace-sync-fail-001',
    timestamp: '2025-01-29T15:21:15.000Z',
    duration: 30000,
    status: 'timeout',
    businessFlow: '客户数据同步',
    entrySystem: 'CRM系统',
    tags: {
      syncType: 'full',
      recordCount: '150'
    },
    spans: [
      {
        spanId: 'span-7',
        system: 'CRM系统',
        operation: 'initiateSync',
        startTime: '2025-01-29T15:21:15.000Z',
        duration: 100,
        status: 'success',
        tags: {},
        logs: [],
        metrics: { cpuUsage: 40, memoryUsage: 55 }
      },
      {
        spanId: 'span-8',
        parentSpanId: 'span-7',
        system: '数据中台',
        operation: 'receiveData',
        startTime: '2025-01-29T15:21:15.100Z',
        duration: 29900,
        status: 'timeout',
        tags: { operation: 'syncCustomerData' },
        logs: [
          { timestamp: '2025-01-29T15:21:20.000Z', level: 'warn', message: '连接超时' },
          { timestamp: '2025-01-29T15:21:30.000Z', level: 'error', message: '同步失败' }
        ],
        metrics: { cpuUsage: 75, memoryUsage: 80, networkIo: 2048 }
      }
    ]
  }
]

// ==================== Service Metrics (服务性能指标) ====================
export const serviceMetrics: ServiceMetrics[] = [
  {
    systemId: 'SYS-001',
    systemName: 'ERP系统',
    timestamp: '2025-01-29T15:30:00.000Z',
    timeframe: '5m',
    requestCount: 2450,
    requestSuccessRate: 98.5,
    requestErrorRate: 1.5,
    requestLatency: { p50: 120, p95: 350, p99: 800, avg: 180 },
    cpuUsage: 67,
    memoryUsage: 72,
    diskUsage: 45,
    networkIn: 15.6,
    networkOut: 12.3,
    activeUsers: 145,
    transactionCount: 890,
    upstreamCallCount: 120,
    upstreamFailureRate: 0.5,
    downstreamCallCount: 890,
    downstreamFailureRate: 1.2
  },
  {
    systemId: 'SYS-002',
    systemName: 'CRM系统',
    timestamp: '2025-01-29T15:30:00.000Z',
    timeframe: '5m',
    requestCount: 890,
    requestSuccessRate: 92.3,
    requestErrorRate: 7.7,
    requestLatency: { p50: 350, p95: 1200, p99: 3500, avg: 580 },
    cpuUsage: 78,
    memoryUsage: 85,
    diskUsage: 52,
    networkIn: 8.5,
    networkOut: 6.2,
    activeUsers: 52,
    transactionCount: 320,
    upstreamCallCount: 45,
    upstreamFailureRate: 12.5,
    downstreamCallCount: 320,
    downstreamFailureRate: 7.7
  },
  {
    systemId: 'SYS-003',
    systemName: 'OA办公系统',
    timestamp: '2025-01-29T15:30:00.000Z',
    timeframe: '5m',
    requestCount: 560,
    requestSuccessRate: 95.5,
    requestErrorRate: 4.5,
    requestLatency: { p50: 180, p95: 560, p99: 1200, avg: 280 },
    cpuUsage: 45,
    memoryUsage: 55,
    diskUsage: 38,
    networkIn: 3.2,
    networkOut: 2.8,
    activeUsers: 85,
    transactionCount: 180,
    upstreamCallCount: 180,
    upstreamFailureRate: 3.5,
    downstreamCallCount: 0,
    downstreamFailureRate: 0
  },
  {
    systemId: 'SYS-004',
    systemName: '数据中台',
    timestamp: '2025-01-29T15:30:00.000Z',
    timeframe: '5m',
    requestCount: 3450,
    requestSuccessRate: 89.2,
    requestErrorRate: 10.8,
    requestLatency: { p50: 450, p95: 2500, p99: 8000, avg: 1200 },
    cpuUsage: 92,
    memoryUsage: 88,
    diskUsage: 65,
    networkIn: 45.6,
    networkOut: 38.9,
    activeUsers: 120,
    transactionCount: 1200,
    upstreamCallCount: 0,
    upstreamFailureRate: 0,
    downstreamCallCount: 1200,
    downstreamFailureRate: 10.8
  },
  {
    systemId: 'SYS-005',
    systemName: '支付网关',
    timestamp: '2025-01-29T15:30:00.000Z',
    timeframe: '5m',
    requestCount: 450,
    requestSuccessRate: 99.2,
    requestErrorRate: 0.8,
    requestLatency: { p50: 800, p95: 2000, p99: 3500, avg: 1100 },
    cpuUsage: 42,
    memoryUsage: 48,
    diskUsage: 25,
    networkIn: 12.5,
    networkOut: 11.8,
    activeUsers: 0,
    transactionCount: 450,
    businessValue: 125000,
    upstreamCallCount: 450,
    upstreamFailureRate: 0.8,
    downstreamCallCount: 0,
    downstreamFailureRate: 0
  },
  {
    systemId: 'SYS-006',
    systemName: 'MES制造执行系统',
    timestamp: '2025-01-29T15:30:00.000Z',
    timeframe: '5m',
    requestCount: 320,
    requestSuccessRate: 96.8,
    requestErrorRate: 3.2,
    requestLatency: { p50: 150, p95: 450, p99: 900, avg: 220 },
    cpuUsage: 38,
    memoryUsage: 42,
    diskUsage: 30,
    networkIn: 5.6,
    networkOut: 4.2,
    activeUsers: 25,
    transactionCount: 85,
    upstreamCallCount: 85,
    upstreamFailureRate: 1.5,
    downstreamCallCount: 0,
    downstreamFailureRate: 0
  }
]

// ==================== Dependency Graph (依赖关系图) ====================
export const dependencyGraph: DependencyGraph = {
  nodes: [
    {
      id: 'SYS-001',
      name: 'ERP系统',
      type: 'ERP',
      status: 'healthy',
      metrics: { requestCount: 2450, errorRate: 1.5, avgLatency: 180 }
    },
    {
      id: 'SYS-002',
      name: 'CRM系统',
      type: 'CRM',
      status: 'warning',
      metrics: { requestCount: 890, errorRate: 7.7, avgLatency: 580 }
    },
    {
      id: 'SYS-003',
      name: 'OA办公系统',
      type: 'OA',
      status: 'healthy',
      metrics: { requestCount: 560, errorRate: 4.5, avgLatency: 280 }
    },
    {
      id: 'SYS-004',
      name: '数据中台',
      type: 'DATA_PLATFORM',
      status: 'error',
      metrics: { requestCount: 3450, errorRate: 10.8, avgLatency: 1200 }
    },
    {
      id: 'SYS-005',
      name: '支付网关',
      type: 'PAYMENT',
      status: 'healthy',
      metrics: { requestCount: 450, errorRate: 0.8, avgLatency: 1100 }
    },
    {
      id: 'SYS-006',
      name: 'MES制造执行系统',
      type: 'MES',
      status: 'healthy',
      metrics: { requestCount: 320, errorRate: 3.2, avgLatency: 220 }
    }
  ],
  edges: [
    { source: 'SYS-001', target: 'SYS-004', type: 'REST', metrics: { requestCount: 120, errorRate: 5.0, avgLatency: 450 }, status: 'warning' },
    { source: 'SYS-002', target: 'SYS-004', type: 'REST', metrics: { requestCount: 45, errorRate: 12.5, avgLatency: 3000 }, status: 'error' },
    { source: 'SYS-002', target: 'SYS-005', type: 'REST', metrics: { requestCount: 89, errorRate: 0.5, avgLatency: 1100 }, status: 'healthy' },
    { source: 'SYS-003', target: 'SYS-001', type: 'REST', metrics: { requestCount: 180, errorRate: 3.5, avgLatency: 350 }, status: 'warning' },
    { source: 'SYS-004', target: 'SYS-002', type: 'MQ', metrics: { requestCount: 56, errorRate: 8.9, avgLatency: 200 }, status: 'error' },
    { source: 'SYS-001', target: 'SYS-005', type: 'REST', metrics: { requestCount: 450, errorRate: 0.8, avgLatency: 1800 }, status: 'healthy' },
    { source: 'SYS-001', target: 'SYS-002', type: 'REST', metrics: { requestCount: 28, errorRate: 0, avgLatency: 120 }, status: 'healthy' },
    { source: 'SYS-006', target: 'SYS-001', type: 'SOAP', metrics: { requestCount: 85, errorRate: 1.5, avgLatency: 450 }, status: 'healthy' },
    { source: 'SYS-006', target: 'SYS-004', type: 'REST', metrics: { requestCount: 42, errorRate: 2.8, avgLatency: 380 }, status: 'healthy' }
  ],
  timestamp: '2025-01-29T15:30:00.000Z'
}

// ==================== Anomalies (异常检测) ====================
export const anomalies: Anomaly[] = [
  {
    id: 'ANOMALY-001',
    timestamp: '2025-01-29T15:28:00.000Z',
    system: '数据中台',
    metricName: 'errorRate',
    severity: 'critical',
    type: 'spike',
    currentValue: 10.8,
    expectedValue: 2.5,
    deviation: 8.3,
    description: '错误率突然激增432%，超出正常基线',
    relatedTraces: ['trace-sync-fail-001']
  },
  {
    id: 'ANOMALY-002',
    timestamp: '2025-01-29T15:25:00.000Z',
    system: 'CRM系统',
    metricName: 'latency',
    severity: 'high',
    type: 'trend',
    currentValue: 580,
    expectedValue: 220,
    deviation: 360,
    description: '平均响应时间持续上升，增长趋势明显'
  },
  {
    id: 'ANOMALY-003',
    timestamp: '2025-01-29T15:20:00.000Z',
    system: '数据中台',
    metricName: 'cpuUsage',
    severity: 'high',
    type: 'spike',
    currentValue: 92,
    expectedValue: 65,
    deviation: 27,
    description: 'CPU使用率异常飙升，可能导致性能瓶颈'
  },
  {
    id: 'ANOMALY-004',
    timestamp: '2025-01-29T15:15:00.000Z',
    system: 'OA办公系统',
    metricName: 'requestCount',
    severity: 'medium',
    type: 'drop',
    currentValue: 560,
    expectedValue: 890,
    deviation: -330,
    description: '请求量下降37%，可能存在连接问题'
  }
]

// ==================== Capacity Forecasts (容量预测) ====================
export const capacityForecasts: CapacityForecast[] = [
  {
    systemId: 'SYS-004',
    systemName: '数据中台',
    metricType: 'cpu',
    currentValue: 92,
    forecastData: [
      { date: '2025-01-30', predictedValue: 94, confidence: 0.92 },
      { date: '2025-01-31', predictedValue: 96, confidence: 0.88 },
      { date: '2025-02-01', predictedValue: 98, confidence: 0.85 },
      { date: '2025-02-02', predictedValue: 100, confidence: 0.80 },
      { date: '2025-02-03', predictedValue: 102, confidence: 0.75 }
    ],
    recommendedActions: [
      '建议立即进行水平扩展，增加2-3个实例',
      '优化慢查询，添加数据库索引',
      '考虑实施查询缓存策略',
      '评估是否需要升级CPU配置'
    ],
    predictedExhaustionDate: '2025-02-03'
  },
  {
    systemId: 'SYS-002',
    systemName: 'CRM系统',
    metricType: 'memory',
    currentValue: 85,
    forecastData: [
      { date: '2025-01-30', predictedValue: 86, confidence: 0.90 },
      { date: '2025-01-31', predictedValue: 87, confidence: 0.87 },
      { date: '2025-02-01', predictedValue: 88, confidence: 0.84 },
      { date: '2025-02-02', predictedValue: 89, confidence: 0.81 },
      { date: '2025-02-03', predictedValue: 90, confidence: 0.78 }
    ],
    recommendedActions: [
      '检查内存泄漏问题',
      '调整JVM堆内存配置',
      '优化缓存策略，减少内存占用',
      '考虑实施内存监控和告警'
    ]
  },
  {
    systemId: 'SYS-004',
    systemName: '数据中台',
    metricType: 'throughput',
    currentValue: 3450,
    forecastData: [
      { date: '2025-01-30', predictedValue: 3600, confidence: 0.88 },
      { date: '2025-01-31', predictedValue: 3750, confidence: 0.85 },
      { date: '2025-02-01', predictedValue: 3900, confidence: 0.82 },
      { date: '2025-02-02', predictedValue: 4050, confidence: 0.78 },
      { date: '2025-02-03', predictedValue: 4200, confidence: 0.75 }
    ],
    recommendedActions: [
      '提前扩容以应对流量增长',
      '优化数据库连接池配置',
      '实施读写分离减轻主库压力'
    ]
  }
]

// ==================== SLA Metrics ====================
export const slaMetrics: SLAMetric[] = [
  {
    id: 'SLA-001',
    serviceName: 'ERP系统',
    slaTarget: 99.9,
    currentValue: 99.2,
    status: 'compliant',
    measurementPeriod: '本月',
    incidents: [
      { timestamp: '2025-01-28T14:30:00Z', duration: 300, impact: 'medium', description: '数据库连接池耗尽' }
    ]
  },
  {
    id: 'SLA-002',
    serviceName: 'CRM系统',
    slaTarget: 99.5,
    currentValue: 92.3,
    status: 'breached',
    measurementPeriod: '本月',
    incidents: [
      { timestamp: '2025-01-29T15:20:00Z', duration: 1800, impact: 'high', description: '数据中台连接超时' },
      { timestamp: '2025-01-29T14:00:00Z', duration: 600, impact: 'medium', description: '性能下降' }
    ]
  },
  {
    id: 'SLA-003',
    serviceName: '支付网关',
    slaTarget: 99.99,
    currentValue: 99.8,
    status: 'compliant',
    measurementPeriod: '本月',
    incidents: []
  },
  {
    id: 'SLA-004',
    serviceName: '数据中台',
    slaTarget: 99.0,
    currentValue: 89.2,
    status: 'breached',
    measurementPeriod: '本月',
    incidents: [
      { timestamp: '2025-01-29T15:21:00Z', duration: 3600, impact: 'critical', description: '服务全面降级' },
      { timestamp: '2025-01-29T12:00:00Z', duration: 900, impact: 'high', description: '查询超时' },
      { timestamp: '2025-01-28T16:00:00Z', duration: 1200, impact: 'high', description: '性能瓶颈' }
    ]
  }
]

// ==================== Alerts ====================
export const alerts: Alert[] = [
  {
    id: 'ALERT-001',
    timestamp: '2025-01-29T15:28:00.000Z',
    severity: 'critical',
    status: 'active',
    source: '数据中台',
    title: '错误率超出阈值',
    description: '数据中台错误率达到10.8%，远超2%的告警阈值',
    affectedSystems: ['CRM系统', 'ERP系统', 'MES制造执行系统'],
    metricName: 'errorRate',
    threshold: 2,
    currentValue: 10.8,
    suggestedActions: [
      '立即检查数据中台服务状态',
      '查看慢查询日志',
      '检查数据库连接池',
      '考虑触发应急扩容流程'
    ]
  },
  {
    id: 'ALERT-002',
    timestamp: '2025-01-29T15:25:00.000Z',
    severity: 'warning',
    status: 'active',
    source: 'CRM系统',
    title: '响应时间超标',
    description: 'CRM系统平均响应时间580ms，超过300ms阈值',
    affectedSystems: ['CRM系统'],
    metricName: 'latency',
    threshold: 300,
    currentValue: 580,
    suggestedActions: [
      '检查数据中台连接状态',
      '分析慢查询',
      '查看缓存命中率'
    ]
  },
  {
    id: 'ALERT-003',
    timestamp: '2025-01-29T15:20:00.000Z',
    severity: 'critical',
    status: 'active',
    source: '数据中台',
    title: 'CPU使用率过高',
    description: '数据中台CPU使用率达到92%，接近容量上限',
    affectedSystems: ['数据中台'],
    metricName: 'cpuUsage',
    threshold: 80,
    currentValue: 92,
    suggestedActions: [
      '立即进行水平扩展',
      '检查是否有资源泄漏',
      '分析是否有异常任务消耗CPU'
    ],
    relatedAlerts: ['ALERT-001']
  },
  {
    id: 'ALERT-004',
    timestamp: '2025-01-29T15:18:00.000Z',
    severity: 'warning',
    status: 'acknowledged',
    source: 'OA办公系统',
    title: 'ERP接口调用失败',
    description: 'OA系统调用ERP接口返回500错误',
    affectedSystems: ['OA办公系统', 'ERP系统'],
    suggestedActions: [
      '检查ERP接口服务状态',
      '查看ERP系统错误日志',
      '重试失败的事务'
    ]
  }
]

// ==================== Change Records ====================
export const changeRecords: ChangeRecord[] = [
  {
    id: 'CHANGE-001',
    timestamp: '2025-01-29T10:00:00.000Z',
    type: 'deployment',
    system: '数据中台',
    description: '数据中台V3.1升级到V3.2，添加新的数据聚合功能',
    status: 'completed',
    executedBy: '运维团队',
    approvedBy: '技术总监',
    impact: 'high',
    preChangeMetrics: { cpuUsage: 65, memoryUsage: 70, errorRate: 2.5 },
    postChangeMetrics: { cpuUsage: 92, memoryUsage: 88, errorRate: 10.8 },
    relatedIncidents: ['ALERT-001', 'ALERT-003']
  },
  {
    id: 'CHANGE-002',
    timestamp: '2025-01-28T14:00:00.000Z',
    type: 'config_change',
    system: 'CRM系统',
    description: '调整数据库连接池配置，最大连接数从50增加到80',
    status: 'completed',
    executedBy: 'DBA团队',
    approvedBy: '系统管理员',
    impact: 'low',
    preChangeMetrics: { dbConnectionPool: 50 },
    postChangeMetrics: { dbConnectionPool: 80 }
  },
  {
    id: 'CHANGE-003',
    timestamp: '2025-01-29T15:35:00.000Z',
    type: 'emergency_fix',
    system: '数据中台',
    description: '紧急修复CPU使用率过高问题，回滚到V3.1版本',
    status: 'pending',
    executedBy: '待定',
    approvedBy: '待定',
    impact: 'high'
  }
]

// ==================== Insights (数据洞察) ====================
export const insights: Insight[] = [
  {
    id: 'INSIGHT-001',
    type: 'performance',
    severity: 'critical',
    title: '数据中台性能严重下降',
    description: '数据中台在最近一次部署后，性能指标全面恶化。错误率从2.5%上升到10.8%，平均响应时间从450ms上升到1200ms。这与今天10:00的版本发布高度相关。',
    affectedSystems: ['数据中台', 'CRM系统', 'ERP系统'],
    metrics: [
      { name: '错误率', currentValue: 10.8, baselineValue: 2.5, change: 332, trend: 'up' },
      { name: '响应时间', currentValue: 1200, baselineValue: 450, change: 167, trend: 'up' },
      { name: 'CPU使用率', currentValue: 92, baselineValue: 65, change: 42, trend: 'up' }
    ],
    recommendations: [
      '强烈建议立即回滚到V3.1版本',
      '深入分析V3.2版本的性能问题根源',
      '在测试环境验证后再发布到生产环境',
      '建立更完善的性能回归测试'
    ],
    confidence: 0.95,
    generatedAt: '2025-01-29T15:30:00.000Z'
  },
  {
    id: 'INSIGHT-002',
    type: 'capacity',
    severity: 'warning',
    title: '数据中台容量即将耗尽',
    description: '基于当前增长趋势，数据中台CPU容量将在3-4天内耗尽。建议立即进行容量规划并执行扩容操作。',
    affectedSystems: ['数据中台'],
    metrics: [
      { name: 'CPU使用率', currentValue: 92, baselineValue: 65, change: 42, trend: 'up' },
      { name: '请求量', currentValue: 3450, baselineValue: 2800, change: 23, trend: 'up' }
    ],
    recommendations: [
      '立即进行水平扩展，增加2-3个实例',
      '优化慢查询减少CPU消耗',
      '实施自动扩缩容策略',
      '建立容量预测和提前扩容机制'
    ],
    confidence: 0.88,
    generatedAt: '2025-01-29T15:30:00.000Z'
  },
  {
    id: 'INSIGHT-003',
    type: 'reliability',
    severity: 'critical',
    title: 'CRM系统SLA违约',
    description: 'CRM系统本月SLA目标为99.5%，当前仅92.3%，已严重违约。主要原因是数据中台性能问题导致。',
    affectedSystems: ['CRM系统', '数据中台'],
    metrics: [
      { name: '可用性', currentValue: 92.3, baselineValue: 99.5, change: -7.2, trend: 'down' },
      { name: '错误率', currentValue: 7.7, baselineValue: 0.5, change: 1440, trend: 'up' }
    ],
    recommendations: [
      '优先解决数据中台性能问题',
      '向受影响用户通报情况',
      '建立SLA补偿机制',
      '加强变更管理和发布审核'
    ],
    confidence: 0.92,
    generatedAt: '2025-01-29T15:30:00.000Z'
  },
  {
    id: 'INSIGHT-004',
    type: 'trend',
    severity: 'info',
    title: '支付系统表现稳定',
    description: '支付网关系统表现优秀，成功率达到99.2%，响应时间稳定在1.1秒左右。本月处理业务价值12.5万元。',
    affectedSystems: ['支付网关'],
    metrics: [
      { name: '成功率', currentValue: 99.2, baselineValue: 99.0, change: 0.2, trend: 'stable' },
      { name: '响应时间', currentValue: 1100, baselineValue: 1050, change: 5, trend: 'stable' }
    ],
    recommendations: [
      '继续保持当前运维水平',
      '可作为其他系统的性能基准'
    ],
    confidence: 0.85,
    generatedAt: '2025-01-29T15:30:00.000Z'
  }
]
