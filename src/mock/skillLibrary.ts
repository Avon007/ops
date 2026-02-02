/**
 * Mock Data for Skill Library
 * 专家技能知识库模拟数据
 */

import type {
  OperatorProfile,
  SkillRule,
  SkillTemplate,
  SkillExecutionResult
} from '@/types'

// 运维人员档案
export const operatorProfiles: OperatorProfile[] = [
  {
    id: 'op-001',
    name: '张三',
    email: 'zhangsan@example.com',
    role: 'expert',
    specializations: ['系统集成', '性能优化', '故障诊断'],
    createdAt: '2024-01-15T08:00:00Z',
    skillRules: [],
    totalSkills: 3,
    activeSkills: 2,
    totalExecutions: 156,
    averageSuccessRate: 0.92,
    preferences: {
      defaultSeverity: 'warning',
      notificationChannels: ['email', 'slack'],
      language: 'zh-CN'
    }
  },
  {
    id: 'op-002',
    name: '李四',
    email: 'lisi@example.com',
    role: 'senior',
    specializations: ['数据库管理', '容量规划', '安全审计'],
    createdAt: '2024-02-20T08:00:00Z',
    skillRules: [],
    totalSkills: 2,
    activeSkills: 2,
    totalExecutions: 89,
    averageSuccessRate: 0.88,
    preferences: {
      defaultSeverity: 'critical',
      notificationChannels: ['email', 'sms'],
      language: 'zh-CN'
    }
  },
  {
    id: 'op-003',
    name: '王五',
    email: 'wangwu@example.com',
    role: 'architect',
    specializations: ['架构设计', '全链路监控', '根因分析'],
    createdAt: '2024-03-10T08:00:00Z',
    skillRules: [],
    totalSkills: 1,
    activeSkills: 1,
    totalExecutions: 234,
    averageSuccessRate: 0.95,
    preferences: {
      defaultSeverity: 'info',
      notificationChannels: ['email'],
      language: 'zh-CN'
    }
  }
]

// 技能规则
export const skillRules: SkillRule[] = [
  {
    id: 'skill-001',
    name: 'ERP系统CPU高负载诊断',
    description: '当ERP系统CPU使用率超过90%持续5分钟时，自动诊断CPU高负载原因，并提供优化建议',
    category: 'performance',
    createdBy: 'op-001',
    creatorName: '张三',
    createdAt: '2024-06-15T10:30:00Z',
    modifiedBy: 'op-001',
    modifiedAt: '2024-06-20T14:22:00Z',
    version: 2,
    applicableSystems: ['sys-001'],
    tags: ['CPU', '性能', 'ERP', '资源优化'],
    triggers: [
      {
        id: 'trigger-001',
        name: 'CPU使用率告警',
        description: 'CPU使用率超过90%',
        triggerType: 'metric_threshold',
        metricThreshold: {
          systemId: 'sys-001',
          metricName: 'cpu',
          operator: '>',
          threshold: 90,
          duration: 300
        },
        enabled: true
      }
    ],
    diagnosisSteps: [
      {
        id: 'step-001',
        name: '收集系统指标',
        description: '收集CPU、内存、磁盘IO等系统指标数据',
        order: 1,
        stepType: 'data_collection',
        dataCollection: {
          sources: ['metrics', 'logs'],
          filters: { systemId: 'sys-001' },
          timeRange: 600
        },
        expectedOutput: '系统指标数据收集完成'
      },
      {
        id: 'step-002',
        name: '分析高CPU进程',
        description: '识别导致CPU高负载的进程和操作',
        order: 2,
        stepType: 'pattern_matching',
        patternMatching: {
          patterns: ['high cpu usage', 'cpu spike', 'process overload'],
          matchingAlgorithm: 'semantic',
          confidenceThreshold: 0.7
        },
        expectedOutput: '高CPU进程识别完成'
      },
      {
        id: 'step-003',
        name: '根因验证',
        description: '验证CPU高负载的根本原因',
        order: 3,
        stepType: 'root_cause_verification',
        rootCauseVerification: {
          verificationCriteria: [
            '检查是否有异常进程',
            '检查是否有死循环',
            '检查是否有并发问题'
          ],
          falsePositiveChecks: [
            '确认不是正常业务高峰期',
            '确认不是定时任务执行'
          ]
        },
        expectedOutput: '根因确认完成'
      }
    ],
    actions: [
      {
        id: 'action-001',
        name: '发送告警',
        description: '向运维团队发送CPU高负载告警',
        actionType: 'alert',
        alertConfig: {
          severity: 'critical',
          channels: ['dashboard', 'email'],
          messageTemplate: 'ERP系统CPU使用率达到{cpu}%，超过90%阈值',
          recipients: ['ops-team@example.com']
        },
        executionOrder: 1,
        enabled: true
      },
      {
        id: 'action-002',
        name: '记录诊断日志',
        description: '将诊断过程记录到审计日志',
        actionType: 'logging',
        loggingConfig: {
          logLevel: 'WARN',
          destination: 'audit_log',
          retentionPeriod: 90
        },
        executionOrder: 2,
        enabled: true
      }
    ],
    enabled: true,
    executionCount: 45,
    successCount: 42,
    falsePositiveRate: 0.07,
    validated: true,
    validatedBy: 'op-003',
    validatedAt: '2024-06-20T15:00:00Z',
    lastExecutedAt: '2024-06-25T09:15:00Z',
    documentation: '此技能规则用于诊断ERP系统CPU高负载问题。重点关注进程级别资源使用情况。',
    examples: [
      'ERP系统CPU使用率达到95%时触发',
      '自动识别Top 5高CPU进程',
      '生成性能优化建议'
    ]
  },
  {
    id: 'skill-002',
    name: '系统集成超时检测',
    description: '检测系统间集成调用超时问题，分析超时原因并提供解决方案',
    category: 'integration',
    createdBy: 'op-001',
    creatorName: '张三',
    createdAt: '2024-07-01T08:00:00Z',
    version: 1,
    applicableSystems: ['sys-001', 'sys-002', 'sys-003'],
    tags: ['集成', '超时', '网络', 'RPC'],
    triggers: [
      {
        id: 'trigger-002',
        name: '集成调用超时',
        description: '集成调用响应时间超过30秒',
        triggerType: 'integration_failure',
        integrationFailure: {
          sourceSystem: 'ERP',
          targetSystem: 'CRM',
          errorRate: 20,
          timeWindow: 300
        },
        enabled: true
      }
    ],
    diagnosisSteps: [
      {
        id: 'step-004',
        name: '收集集成调用数据',
        description: '收集系统间集成调用的详细数据',
        order: 1,
        stepType: 'data_collection',
        dataCollection: {
          sources: ['integration_calls', 'traces'],
          filters: {},
          timeRange: 600
        },
        expectedOutput: '集成调用数据收集完成'
      },
      {
        id: 'step-005',
        name: '分析超时模式',
        description: '识别超时发生的模式和规律',
        order: 2,
        stepType: 'pattern_matching',
        patternMatching: {
          patterns: ['timeout', 'connection reset', 'slow response'],
          matchingAlgorithm: 'regex',
          confidenceThreshold: 0.8
        },
        expectedOutput: '超时模式分析完成'
      },
      {
        id: 'step-006',
        name: '关联分析',
        description: '分析超时与系统状态、网络状况的关联性',
        order: 3,
        stepType: 'correlation_analysis',
        correlationAnalysis: {
          correlationType: 'temporal',
          relatedSystems: ['sys-001', 'sys-002', 'sys-003'],
          correlationThreshold: 0.6
        },
        expectedOutput: '关联分析完成'
      }
    ],
    actions: [
      {
        id: 'action-003',
        name: '发送超时告警',
        description: '向相关团队发送集成超时告警',
        actionType: 'alert',
        alertConfig: {
          severity: 'warning',
          channels: ['dashboard', 'email', 'webhook'],
          messageTemplate: '{source}到{target}的集成调用超时率达到{rate}%',
          recipients: ['integration-team@example.com']
        },
        executionOrder: 1,
        enabled: true
      },
      {
        id: 'action-004',
        name: '自动重试建议',
        description: '生成自动重试配置建议',
        actionType: 'remediation',
        remediationConfig: {
          type: 'semi_auto',
          commands: ['check network connectivity', 'increase timeout threshold'],
          approvalRequired: true
        },
        executionOrder: 2,
        enabled: true
      }
    ],
    enabled: true,
    executionCount: 28,
    successCount: 25,
    falsePositiveRate: 0.11,
    validated: true,
    validatedBy: 'op-001',
    validatedAt: '2024-07-02T10:00:00Z',
    lastExecutedAt: '2024-07-10T14:30:00Z'
  },
  {
    id: 'skill-003',
    name: '数据库连接池耗尽检测',
    description: '检测数据库连接池耗尽问题，分析连接泄漏并提供修复建议',
    category: 'availability',
    createdBy: 'op-002',
    creatorName: '李四',
    createdAt: '2024-07-05T09:00:00Z',
    version: 1,
    applicableSystems: ['sys-002', 'sys-004'],
    tags: ['数据库', '连接池', '内存泄漏', '可用性'],
    triggers: [
      {
        id: 'trigger-003',
        name: '连接池耗尽',
        description: '数据库连接池使用率达到100%',
        triggerType: 'metric_threshold',
        metricThreshold: {
          systemId: 'sys-002',
          metricName: 'connectionPool',
          operator: '>=',
          threshold: 100,
          duration: 60
        },
        enabled: true
      },
      {
        id: 'trigger-003-2',
        name: '连接池相关错误日志',
        description: '检测到连接池相关的错误日志',
        triggerType: 'log_pattern',
        logPattern: {
          systemId: 'sys-002',
          logLevel: ['ERROR'],
          pattern: 'connection pool exhausted|connection timeout|unable to get connection',
          occurrenceThreshold: 5,
          timeWindow: 300
        },
        enabled: true
      }
    ],
    diagnosisSteps: [
      {
        id: 'step-007',
        name: '收集连接池指标',
        description: '收集数据库连接池的使用情况',
        order: 1,
        stepType: 'data_collection',
        dataCollection: {
          sources: ['metrics', 'logs'],
          filters: { metricName: 'connectionPool' },
          timeRange: 600
        },
        expectedOutput: '连接池指标收集完成'
      },
      {
        id: 'step-008',
        name: '识别连接泄漏',
        description: '识别可能导致连接泄漏的代码路径',
        order: 2,
        stepType: 'pattern_matching',
        patternMatching: {
          patterns: ['connection not closed', 'connection leak', 'resource not released'],
          matchingAlgorithm: 'semantic',
          confidenceThreshold: 0.75
        },
        expectedOutput: '连接泄漏识别完成'
      }
    ],
    actions: [
      {
        id: 'action-005',
        name: '发送紧急告警',
        description: '发送数据库连接池耗尽紧急告警',
        actionType: 'alert',
        alertConfig: {
          severity: 'emergency',
          channels: ['dashboard', 'email', 'sms'],
          messageTemplate: '数据库连接池已耗尽，系统可能不可用',
          recipients: ['db-team@example.com', 'ops-team@example.com']
        },
        executionOrder: 1,
        enabled: true
      },
      {
        id: 'action-006',
        name: '升级处理',
        description: '升级到数据库架构师处理',
        actionType: 'escalation',
        escalationConfig: {
          escalateTo: ['db-architect', 'ops-manager'],
          escalationLevel: 2,
          conditions: ['连接池耗尽持续超过5分钟'],
          notifyChannels: ['email', 'call']
        },
        executionOrder: 2,
        enabled: true
      }
    ],
    enabled: true,
    executionCount: 12,
    successCount: 10,
    falsePositiveRate: 0.17,
    validated: true,
    validatedBy: 'op-002',
    validatedAt: '2024-07-06T11:00:00Z',
    lastExecutedAt: '2024-07-12T16:45:00Z'
  },
  {
    id: 'skill-004',
    name: '端口阻塞诊断',
    description: '检测系统端口阻塞问题，分析防火墙规则、安全设备配置，并提供解决方案',
    category: 'security',
    createdBy: 'op-002',
    creatorName: '李四',
    createdAt: '2024-07-08T10:00:00Z',
    version: 1,
    applicableSystems: ['sys-001', 'sys-002', 'sys-004'],
    tags: ['端口阻塞', '防火墙', '网络', '连接失败'],
    triggers: [
      {
        id: 'trigger-004',
        name: '端口不可达',
        description: '检测到端口连接失败或超时',
        triggerType: 'log_pattern',
        logPattern: {
          systemId: '',
          logLevel: ['ERROR'],
          pattern: 'connection refused|connection timeout|port unreachable|port blocked',
          occurrenceThreshold: 5,
          timeWindow: 300
        },
        enabled: true
      },
      {
        id: 'trigger-004-2',
        name: '防火墙阻断',
        description: '防火墙或安全设备阻断连接',
        triggerType: 'integration_failure',
        integrationFailure: {
          sourceSystem: 'external',
          targetSystem: 'any',
          errorRate: 50,
          timeWindow: 60
        },
        enabled: true
      }
    ],
    diagnosisSteps: [
      {
        id: 'step-009',
        name: '收集连接日志',
        description: '收集端口连接相关的日志和错误信息',
        order: 1,
        stepType: 'data_collection',
        dataCollection: {
          sources: ['logs', 'network_packets'],
          filters: { errorCode: 'CONN_REFUSED,TIMEOUT,BLOCKED' },
          timeRange: 600
        },
        expectedOutput: '连接日志收集完成'
      },
      {
        id: 'step-010',
        name: '分析防火墙规则',
        description: '检查防火墙和安全设备的规则配置',
        order: 2,
        stepType: 'correlation_analysis',
        correlationAnalysis: {
          correlationType: 'dependency',
          relatedSystems: ['sec-001', 'sec-002', 'sec-004'],
          correlationThreshold: 0.7
        },
        expectedOutput: '防火墙规则分析完成'
      },
      {
        id: 'step-011',
        name: '网络诊断',
        description: '执行telnet、ping等网络诊断命令',
        order: 3,
        stepType: 'root_cause_verification',
        rootCauseVerification: {
          verificationCriteria: [
            '确认端口是否被防火墙阻断',
            '检查安全设备策略',
            '验证网络连通性'
          ],
          falsePositiveChecks: [
            '确认不是临时网络故障',
            '确认不是服务未启动'
          ]
        },
        expectedOutput: '网络诊断完成'
      }
    ],
    actions: [
      {
        id: 'action-007',
        name: '发送端口阻塞告警',
        description: '发送端口阻塞问题告警通知',
        actionType: 'alert',
        alertConfig: {
          severity: 'critical',
          channels: ['dashboard', 'email', 'slack'],
          messageTemplate: '检测到端口{port}阻塞，服务{service}不可用',
          recipients: ['ops-team@example.com', 'net-team@example.com']
        },
        executionOrder: 1,
        enabled: true
      },
      {
        id: 'action-008',
        name: '提供修复建议',
        description: '生成端口阻塞修复建议',
        actionType: 'notification',
        notificationConfig: {
          channels: ['email'],
          recipients: ['ops-team@example.com'],
          template: '端口阻塞修复建议报告',
          includeContext: true
        },
        executionOrder: 2,
        enabled: true
      }
    ],
    enabled: true,
    executionCount: 35,
    successCount: 32,
    falsePositiveRate: 0.09,
    validated: true,
    validatedBy: 'op-002',
    validatedAt: '2024-07-10T09:30:00Z',
    lastExecutedAt: '2024-07-15T14:30:00Z'
  },
  {
    id: 'skill-005',
    name: 'SQL注入攻击检测',
    description: '检测和防御SQL注入攻击，分析攻击模式并阻断攻击源',
    category: 'security',
    createdBy: 'op-003',
    creatorName: '王五',
    createdAt: '2024-07-12T11:00:00Z',
    version: 1,
    applicableSystems: ['sys-002', 'sys-004', 'sys-005'],
    tags: ['SQL注入', 'Web安全', 'IPS', '攻击检测'],
    triggers: [
      {
        id: 'trigger-005',
        name: 'SQL注入特征检测',
        description: 'IPS检测到SQL注入攻击特征',
        triggerType: 'log_pattern',
        logPattern: {
          systemId: 'sec-003',
          logLevel: ['ERROR'],
          pattern: 'sql injection|union select|\\\'\\s+or|\\\'\\s+and|1\\=\\1|waitfor delay',
          occurrenceThreshold: 1,
          timeWindow: 60
        },
        enabled: true
      },
      {
        id: 'trigger-005-2',
        name: '异常请求模式',
        description: '检测到异常的HTTP请求模式',
        triggerType: 'log_pattern',
        logPattern: {
          systemId: 'sys-002',
          logLevel: ['WARN', 'ERROR'],
          pattern: 'sqlmap|havij|pangolin|netsparker',
          occurrenceThreshold: 3,
          timeWindow: 300
        },
        enabled: true
      }
    ],
    diagnosisSteps: [
      {
        id: 'step-012',
        name: '收集攻击日志',
        description: '收集IPS、WAF和应用层的攻击日志',
        order: 1,
        stepType: 'data_collection',
        dataCollection: {
          sources: ['logs', 'network_packets'],
          filters: { attackType: 'SQL_INJECTION' },
          timeRange: 3600
        },
        expectedOutput: '攻击日志收集完成'
      },
      {
        id: 'step-013',
        name: '分析攻击payload',
        description: '分析SQL注入攻击的payload和攻击方式',
        order: 2,
        stepType: 'pattern_matching',
        patternMatching: {
          patterns: ['union select', 'boolean based', 'error based', 'time based blind'],
          matchingAlgorithm: 'regex',
          confidenceThreshold: 0.8
        },
        expectedOutput: '攻击payload分析完成'
      },
      {
        id: 'step-014',
        name: '验证应用漏洞',
        description: '验证应用是否存在SQL注入漏洞',
        order: 3,
        stepType: 'root_cause_verification',
        rootCauseVerification: {
          verificationCriteria: [
            '检查应用输入验证',
            '检查参数化查询使用情况',
            '检查WAF规则有效性'
          ],
          falsePositiveChecks: [
            '确认不是误报',
            '确认不是扫描器探测'
          ]
        },
        expectedOutput: '漏洞验证完成'
      }
    ],
    actions: [
      {
        id: 'action-009',
        name: '阻断攻击源',
        description: '自动阻断攻击源IP',
        actionType: 'remediation',
        remediationConfig: {
          type: 'auto',
          commands: ['block_ip {source_ip}', 'add_firewall_rule'],
          scripts: ['iptables -A INPUT -s {source_ip} -j DROP'],
          approvalRequired: false
        },
        executionOrder: 1,
        enabled: true
      },
      {
        id: 'action-010',
        name: '发送安全告警',
        description: '发送SQL注入攻击安全告警',
        actionType: 'alert',
        alertConfig: {
          severity: 'emergency',
          channels: ['dashboard', 'email', 'sms', 'call'],
          messageTemplate: '检测到SQL注入攻击！源IP: {source_ip}, 目标: {target_url}',
          recipients: ['sec-team@example.com', 'ops-manager@example.com']
        },
        executionOrder: 2,
        enabled: true
      },
      {
        id: 'action-011',
        name: '记录安全事件',
        description: '将攻击事件记录到安全日志',
        actionType: 'logging',
        loggingConfig: {
          logLevel: 'ERROR',
          destination: 'audit_log',
          retentionPeriod: 365
        },
        executionOrder: 3,
        enabled: true
      }
    ],
    enabled: true,
    executionCount: 23,
    successCount: 21,
    falsePositiveRate: 0.04,
    validated: true,
    validatedBy: 'op-003',
    validatedAt: '2024-07-14T14:00:00Z',
    lastExecutedAt: '2024-07-15T14:20:00Z',
    documentation: 'SQL注入攻击检测和防御技能。自动识别攻击特征并阻断攻击源。',
    examples: [
      'IPS检测到union select攻击',
      'WAF拦截SQL注入尝试',
      '自动添加攻击IP到黑名单'
    ]
  },
  {
    id: 'skill-006',
    name: '网络连接诊断',
    description: '诊断网络连接问题，包括延迟、丢包、路由等问题',
    category: 'network_block',
    createdBy: 'op-001',
    creatorName: '张三',
    createdAt: '2024-07-14T09:00:00Z',
    version: 1,
    applicableSystems: ['*'],
    tags: ['网络', '连通性', '延迟', '丢包', '路由'],
    triggers: [
      {
        id: 'trigger-006',
        name: '网络连通性告警',
        description: '检测到网络连通性问题',
        triggerType: 'metric_threshold',
        metricThreshold: {
          systemId: '',
          metricName: 'packetLoss',
          operator: '>',
          threshold: 5,
          duration: 60
        },
        enabled: true
      },
      {
        id: 'trigger-006-2',
        name: '高延迟告警',
        description: '网络延迟超过阈值',
        triggerType: 'metric_threshold',
        metricThreshold: {
          systemId: '',
          metricName: 'latency',
          operator: '>',
          threshold: 200,
          duration: 120
        },
        enabled: true
      }
    ],
    diagnosisSteps: [
      {
        id: 'step-015',
        name: '网络基础测试',
        description: '执行ping、traceroute等基础网络测试',
        order: 1,
        stepType: 'data_collection',
        dataCollection: {
          sources: ['network_packets'],
          filters: { testType: 'ping,traceroute' },
          timeRange: 300
        },
        expectedOutput: '网络基础测试完成'
      },
      {
        id: 'step-016',
        name: '分析网络路径',
        description: '分析网络路径和路由跳数',
        order: 2,
        stepType: 'correlation_analysis',
        correlationAnalysis: {
          correlationType: 'causal',
          relatedSystems: [],
          correlationThreshold: 0.6
        },
        expectedOutput: '网络路径分析完成'
      },
      {
        id: 'step-017',
        name: '定位问题节点',
        description: '定位导致网络问题的具体节点',
        order: 3,
        stepType: 'root_cause_verification',
        rootCauseVerification: {
          verificationCriteria: [
            '检查各跳延迟',
            '检查丢包位置',
            '检查路由配置'
          ],
          falsePositiveChecks: [
            '确认不是临时拥塞',
            '确认不是DNS问题'
          ]
        },
        expectedOutput: '问题节点定位完成'
      }
    ],
    actions: [
      {
        id: 'action-012',
        name: '生成网络诊断报告',
        description: '生成详细的网络诊断报告',
        actionType: 'notification',
        notificationConfig: {
          channels: ['email'],
          recipients: ['net-team@example.com'],
          template: '网络诊断报告',
          includeContext: true
        },
        executionOrder: 1,
        enabled: true
      },
      {
        id: 'action-013',
        name: '建议优化方案',
        description: '提供网络优化建议',
        actionType: 'alert',
        alertConfig: {
          severity: 'warning',
          channels: ['dashboard'],
          messageTemplate: '网络性能问题建议优化',
          recipients: ['net-team@example.com']
        },
        executionOrder: 2,
        enabled: true
      }
    ],
    enabled: true,
    executionCount: 67,
    successCount: 63,
    falsePositiveRate: 0.06,
    validated: true,
    validatedBy: 'op-001',
    validatedAt: '2024-07-14T16:00:00Z',
    lastExecutedAt: '2024-07-15T13:45:00Z'
  }
]

// 技能模板
export const skillTemplates: SkillTemplate[] = [
  {
    id: 'template-001',
    name: '性能问题诊断模板',
    description: '用于诊断系统性能问题的通用模板',
    category: 'performance',
    templateTriggers: [
      {
        name: '性能指标告警',
        description: '当性能指标超过阈值时触发',
        triggerType: 'metric_threshold',
        metricThreshold: {
          systemId: '',
          metricName: 'cpu',
          operator: '>',
          threshold: 80
        },
        enabled: true
      }
    ],
    templateDiagnosisSteps: [
      {
        name: '收集性能数据',
        description: '收集系统性能相关数据',
        order: 1,
        stepType: 'data_collection',
        dataCollection: {
          sources: ['metrics', 'logs'],
          filters: {},
          timeRange: 600
        },
        expectedOutput: '性能数据收集完成'
      },
      {
        name: '分析性能瓶颈',
        description: '识别系统性能瓶颈',
        order: 2,
        stepType: 'pattern_matching',
        patternMatching: {
          patterns: ['slow query', 'high latency', 'resource contention'],
          matchingAlgorithm: 'semantic',
          confidenceThreshold: 0.7
        },
        expectedOutput: '性能瓶颈识别完成'
      }
    ],
    templateActions: [
      {
        name: '发送性能告警',
        description: '发送性能问题告警通知',
        actionType: 'alert',
        alertConfig: {
          severity: 'warning',
          channels: ['dashboard', 'email'],
          messageTemplate: '系统性能指标{metric}达到{value}%'
        },
        executionOrder: 1,
        enabled: true
      }
    ],
    useCases: [
      'CPU高负载诊断',
      '内存使用率过高诊断',
      '响应时间过长诊断',
      '吞吐量下降诊断'
    ],
    usageCount: 15,
    createdBy: 'system',
    createdAt: '2024-01-01T00:00:00Z',
    isSystemTemplate: true
  },
  {
    id: 'template-002',
    name: '集成问题诊断模板',
    description: '用于诊断系统集成问题的通用模板',
    category: 'integration',
    templateTriggers: [
      {
        name: '集成调用失败',
        description: '当系统集成调用失败率超过阈值时触发',
        triggerType: 'integration_failure',
        integrationFailure: {
          sourceSystem: '',
          targetSystem: '',
          errorRate: 10,
          timeWindow: 300
        },
        enabled: true
      }
    ],
    templateDiagnosisSteps: [
      {
        name: '收集集成调用数据',
        description: '收集系统间集成调用的数据',
        order: 1,
        stepType: 'data_collection',
        dataCollection: {
          sources: ['integration_calls', 'traces'],
          filters: {},
          timeRange: 600
        },
        expectedOutput: '集成调用数据收集完成'
      },
      {
        name: '分析失败模式',
        description: '分析集成调用失败的模式',
        order: 2,
        stepType: 'pattern_matching',
        patternMatching: {
          patterns: ['connection refused', 'timeout', 'authentication failed'],
          matchingAlgorithm: 'regex',
          confidenceThreshold: 0.8
        },
        expectedOutput: '失败模式分析完成'
      },
      {
        name: '关联系统状态',
        description: '分析集成失败与系统状态的关联',
        order: 3,
        stepType: 'correlation_analysis',
        correlationAnalysis: {
          correlationType: 'dependency',
          relatedSystems: [],
          correlationThreshold: 0.6
        },
        expectedOutput: '关联分析完成'
      }
    ],
    templateActions: [
      {
        name: '发送集成告警',
        description: '发送集成问题告警通知',
        actionType: 'alert',
        alertConfig: {
          severity: 'warning',
          channels: ['dashboard', 'email'],
          messageTemplate: '{source}到{target}的集成调用失败率达到{rate}%'
        },
        executionOrder: 1,
        enabled: true
      },
      {
        name: '记录故障日志',
        description: '将集成故障记录到日志',
        actionType: 'logging',
        loggingConfig: {
          logLevel: 'ERROR',
          destination: 'system_log',
          retentionPeriod: 30
        },
        executionOrder: 2,
        enabled: true
      }
    ],
    useCases: [
      'API调用失败诊断',
      '消息队列集成问题',
      '数据库同步失败',
      '第三方服务调用超时'
    ],
    usageCount: 23,
    createdBy: 'system',
    createdAt: '2024-01-01T00:00:00Z',
    isSystemTemplate: true
  },
  {
    id: 'template-003',
    name: '容量规划模板',
    description: '用于系统容量规划和预测的模板',
    category: 'capacity',
    templateTriggers: [
      {
        name: '资源使用率告警',
        description: '当资源使用率接近上限时触发',
        triggerType: 'metric_threshold',
        metricThreshold: {
          systemId: '',
          metricName: 'memory',
          operator: '>',
          threshold: 75
        },
        enabled: true
      }
    ],
    templateDiagnosisSteps: [
      {
        name: '收集资源使用趋势',
        description: '收集资源使用的历史趋势数据',
        order: 1,
        stepType: 'data_collection',
        dataCollection: {
          sources: ['metrics'],
          filters: {},
          timeRange: 2592000 // 30天
        },
        expectedOutput: '资源使用趋势数据收集完成'
      },
      {
        name: '预测资源耗尽时间',
        description: '基于趋势预测资源耗尽时间',
        order: 2,
        stepType: 'pattern_matching',
        patternMatching: {
          patterns: ['linear growth', 'exponential growth', 'sporadic spikes'],
          matchingAlgorithm: 'semantic',
          confidenceThreshold: 0.8
        },
        expectedOutput: '资源耗尽时间预测完成'
      }
    ],
    templateActions: [
      {
        name: '生成容量报告',
        description: '生成容量规划报告',
        actionType: 'notification',
        notificationConfig: {
          channels: ['email'],
          recipients: ['capacity-team@example.com'],
          template: '容量规划报告：预计{days}天后资源耗尽',
          includeContext: true
        },
        executionOrder: 1,
        enabled: true
      }
    ],
    useCases: [
      '存储容量规划',
      '内存容量规划',
      'CPU容量规划',
      '带宽容量规划'
    ],
    usageCount: 18,
    createdBy: 'system',
    createdAt: '2024-01-01T00:00:00Z',
    isSystemTemplate: true
  },
  {
    id: 'template-004',
    name: 'SLA违规检测模板',
    description: '用于检测SLA违规问题的模板',
    category: 'availability',
    templateTriggers: [
      {
        name: 'SLA指标告警',
        description: '当SLA指标低于目标值时触发',
        triggerType: 'metric_threshold',
        metricThreshold: {
          systemId: '',
          metricName: 'availability',
          operator: '<',
          threshold: 99.9
        },
        enabled: true
      }
    ],
    templateDiagnosisSteps: [
      {
        name: '收集SLA数据',
        description: '收集SLA相关的指标数据',
        order: 1,
        stepType: 'data_collection',
        dataCollection: {
          sources: ['metrics', 'logs'],
          filters: {},
          timeRange: 86400 // 24小时
        },
        expectedOutput: 'SLA数据收集完成'
      },
      {
        name: '分析可用性下降原因',
        description: '分析导致SLA下降的原因',
        order: 2,
        stepType: 'root_cause_verification',
        rootCauseVerification: {
          verificationCriteria: [
            '检查系统停机时间',
            '检查响应时间超标',
            '检查错误率上升'
          ],
          falsePositiveChecks: [
            '确认不是维护窗口期',
            '确认不是计划内停机'
          ]
        },
        expectedOutput: 'SLA下降原因分析完成'
      }
    ],
    templateActions: [
      {
        name: '发送SLA违规告警',
        description: '发送SLA违规紧急告警',
        actionType: 'alert',
        alertConfig: {
          severity: 'critical',
          channels: ['dashboard', 'email', 'sms'],
          messageTemplate: 'SLA违规：当前可用性{current}%低于目标{target}%'
        },
        executionOrder: 1,
        enabled: true
      },
      {
        name: '升级处理',
        description: '升级到管理层处理',
        actionType: 'escalation',
        escalationConfig: {
          escalateTo: ['ops-manager', 'service-owner'],
          escalationLevel: 3,
          conditions: ['SLA持续违规'],
          notifyChannels: ['email', 'sms']
        },
        executionOrder: 2,
        enabled: true
      }
    ],
    useCases: [
      '可用性SLA监控',
      '响应时间SLA监控',
      '错误率SLA监控'
    ],
    usageCount: 31,
    createdBy: 'system',
    createdAt: '2024-01-01T00:00:00Z',
    isSystemTemplate: true
  },
  {
    id: 'template-005',
    name: '端口阻塞诊断模板',
    description: '用于诊断端口阻塞和网络连接问题的模板',
    category: 'security',
    templateTriggers: [
      {
        name: '端口连接失败',
        description: '检测到端口连接失败或超时',
        triggerType: 'log_pattern',
        logPattern: {
          systemId: '',
          logLevel: ['ERROR'],
          pattern: 'connection refused|connection timeout|port unreachable',
          occurrenceThreshold: 5,
          timeWindow: 300
        },
        enabled: true
      }
    ],
    templateDiagnosisSteps: [
      {
        name: '收集连接日志',
        description: '收集端口连接相关的日志',
        order: 1,
        stepType: 'data_collection',
        dataCollection: {
          sources: ['logs', 'network_packets'],
          filters: {},
          timeRange: 600
        },
        expectedOutput: '连接日志收集完成'
      },
      {
        name: '分析防火墙规则',
        description: '检查防火墙和安全设备规则',
        order: 2,
        stepType: 'correlation_analysis',
        correlationAnalysis: {
          correlationType: 'dependency',
          relatedSystems: [],
          correlationThreshold: 0.6
        },
        expectedOutput: '防火墙规则分析完成'
      },
      {
        name: '网络连通性测试',
        description: '执行telnet、ping等测试',
        order: 3,
        stepType: 'root_cause_verification',
        rootCauseVerification: {
          verificationCriteria: [
            '验证端口可达性',
            '检查防火墙策略',
            '检查安全设备状态'
          ],
          falsePositiveChecks: [
            '确认不是服务未启动',
            '确认不是临时网络故障'
          ]
        },
        expectedOutput: '连通性测试完成'
      }
    ],
    templateActions: [
      {
        name: '发送端口阻塞告警',
        description: '发送端口阻塞问题告警',
        actionType: 'alert',
        alertConfig: {
          severity: 'critical',
          channels: ['dashboard', 'email'],
          messageTemplate: '端口{port}被阻塞，服务{service}不可用'
        },
        executionOrder: 1,
        enabled: true
      },
      {
        name: '提供修复建议',
        description: '生成修复建议',
        actionType: 'notification',
        notificationConfig: {
          channels: ['email'],
          recipients: ['ops-team@example.com'],
          template: '端口阻塞修复建议',
          includeContext: true
        },
        executionOrder: 2,
        enabled: true
      }
    ],
    useCases: [
      'ERP系统8080端口阻塞',
      'MySQL数据库3306端口被阻断',
      'SSH连接被拒绝',
      'HTTPS端口不可达',
      '防火墙策略导致连接失败'
    ],
    usageCount: 42,
    createdBy: 'system',
    createdAt: '2024-01-01T00:00:00Z',
    isSystemTemplate: true
  },
  {
    id: 'template-006',
    name: 'Web安全攻击检测模板',
    description: '用于检测Web应用安全攻击的模板',
    category: 'security',
    templateTriggers: [
      {
        name: '安全攻击特征',
        description: '检测到安全攻击特征',
        triggerType: 'log_pattern',
        logPattern: {
          systemId: '',
          logLevel: ['ERROR', 'WARN'],
          pattern: 'sql injection|xss|csrf|path traversal|command injection|ddos',
          occurrenceThreshold: 1,
          timeWindow: 60
        },
        enabled: true
      }
    ],
    templateDiagnosisSteps: [
      {
        name: '收集攻击日志',
        description: '收集IPS、WAF和应用层攻击日志',
        order: 1,
        stepType: 'data_collection',
        dataCollection: {
          sources: ['logs', 'network_packets'],
          filters: { attackType: 'web_attack' },
          timeRange: 3600
        },
        expectedOutput: '攻击日志收集完成'
      },
      {
        name: '分析攻击类型',
        description: '识别攻击类型和攻击payload',
        order: 2,
        stepType: 'pattern_matching',
        patternMatching: {
          patterns: ['sql injection', 'xss', 'csrf', 'ddos', 'brute force'],
          matchingAlgorithm: 'semantic',
          confidenceThreshold: 0.7
        },
        expectedOutput: '攻击类型识别完成'
      },
      {
        name: '验证应用漏洞',
        description: '验证应用是否存在安全漏洞',
        order: 3,
        stepType: 'root_cause_verification',
        rootCauseVerification: {
          verificationCriteria: [
            '检查输入验证',
            '检查输出编码',
            '检查访问控制'
          ],
          falsePositiveChecks: [
            '确认不是误报',
            '确认不是正常业务流量'
          ]
        },
        expectedOutput: '漏洞验证完成'
      }
    ],
    templateActions: [
      {
        name: '阻断攻击源',
        description: '自动阻断攻击IP',
        actionType: 'remediation',
        remediationConfig: {
          type: 'auto',
          commands: ['block_ip'],
          approvalRequired: false
        },
        executionOrder: 1,
        enabled: true
      },
      {
        name: '发送安全告警',
        description: '发送安全攻击紧急告警',
        actionType: 'alert',
        alertConfig: {
          severity: 'emergency',
          channels: ['dashboard', 'email', 'sms'],
          messageTemplate: '检测到{attack_type}攻击！源IP: {source_ip}'
        },
        executionOrder: 2,
        enabled: true
      },
      {
        name: '记录安全事件',
        description: '记录到安全审计日志',
        actionType: 'logging',
        loggingConfig: {
          logLevel: 'ERROR',
          destination: 'audit_log',
          retentionPeriod: 365
        },
        executionOrder: 3,
        enabled: true
      }
    ],
    useCases: [
      'SQL注入攻击检测',
      'XSS跨站脚本攻击',
      'CSRF跨站请求伪造',
      'DDoS分布式拒绝服务',
      '暴力破解攻击',
      '路径遍历攻击'
    ],
    usageCount: 56,
    createdBy: 'system',
    createdAt: '2024-01-01T00:00:00Z',
    isSystemTemplate: true
  },
  {
    id: 'template-007',
    name: '网络故障诊断模板',
    description: '用于诊断网络连通性、延迟、丢包等问题的模板',
    category: 'network_block',
    templateTriggers: [
      {
        name: '网络质量告警',
        description: '网络质量指标异常',
        triggerType: 'metric_threshold',
        metricThreshold: {
          systemId: '',
          metricName: 'network_quality',
          operator: '<',
          threshold: 80,
          duration: 120
        },
        enabled: true
      }
    ],
    templateDiagnosisSteps: [
      {
        name: '网络基础诊断',
        description: '执行ping、traceroute等基础测试',
        order: 1,
        stepType: 'data_collection',
        dataCollection: {
          sources: ['network_packets'],
          filters: { testType: 'basic' },
          timeRange: 300
        },
        expectedOutput: '基础诊断完成'
      },
      {
        name: '分析网络路径',
        description: '分析网络路由和跳数',
        order: 2,
        stepType: 'correlation_analysis',
        correlationAnalysis: {
          correlationType: 'temporal',
          relatedSystems: [],
          correlationThreshold: 0.6
        },
        expectedOutput: '路径分析完成'
      },
      {
        name: '定位故障点',
        description: '定位网络故障的具体位置',
        order: 3,
        stepType: 'root_cause_verification',
        rootCauseVerification: {
          verificationCriteria: [
            '检查各跳延迟',
            '检查丢包位置',
            '检查带宽使用'
          ],
          falsePositiveChecks: [
            '确认不是临时拥塞',
            '确认不是DNS问题'
          ]
        },
        expectedOutput: '故障点定位完成'
      }
    ],
    templateActions: [
      {
        name: '生成网络诊断报告',
        description: '生成详细的网络诊断报告',
        actionType: 'notification',
        notificationConfig: {
          channels: ['email'],
          recipients: ['net-team@example.com'],
          template: '网络故障诊断报告',
          includeContext: true
        },
        executionOrder: 1,
        enabled: true
      },
      {
        name: '建议优化方案',
        description: '提供网络优化建议',
        actionType: 'alert',
        alertConfig: {
          severity: 'warning',
          channels: ['dashboard'],
          messageTemplate: '网络性能优化建议'
        },
        executionOrder: 2,
        enabled: true
      }
    ],
    useCases: [
      '网络延迟过高',
      '丢包率异常',
      '网络部分中断',
      '路由问题',
      '带宽瓶颈',
      'DNS解析问题'
    ],
    usageCount: 38,
    createdBy: 'system',
    createdAt: '2024-01-01T00:00:00Z',
    isSystemTemplate: true
  }
]

// 技能执行历史
export const skillExecutionHistory: SkillExecutionResult[] = [
  {
    executionId: 'exec-001',
    ruleId: 'skill-001',
    ruleName: 'ERP系统CPU高负载诊断',
    executedBy: 'op-001',
    executedAt: '2024-07-15T09:15:00Z',
    triggeredBy: {
      triggerType: 'metric_threshold',
      triggerData: { cpu: 95, duration: 320 },
      timestamp: '2024-07-15T09:10:00Z'
    },
    status: 'success',
    diagnosisResults: [
      {
        stepId: 'step-001',
        stepName: '收集系统指标',
        status: 'success',
        output: '系统指标数据收集完成',
        duration: 1200
      },
      {
        stepId: 'step-002',
        stepName: '分析高CPU进程',
        status: 'success',
        output: '高CPU进程识别完成',
        duration: 2500
      },
      {
        stepId: 'step-003',
        stepName: '根因验证',
        status: 'success',
        output: '根因确认完成',
        duration: 1800
      }
    ],
    actionResults: [
      {
        actionId: 'action-001',
        actionName: '发送告警',
        status: 'success',
        output: '告警发送成功',
        duration: 500
      },
      {
        actionId: 'action-002',
        actionName: '记录诊断日志',
        status: 'success',
        output: '日志记录完成',
        duration: 300
      }
    ],
    summary: 'ERP系统CPU高负载诊断成功完成。检测到Java进程占用CPU 92%。',
    confidence: 0.95,
    affectedSystems: ['sys-001'],
    businessImpact: 'ERP系统响应变慢，影响用户操作效率',
    totalDuration: 6300,
    recommendations: [
      '优化Java进程代码逻辑',
      '增加CPU资源',
      '考虑负载均衡'
    ]
  },
  {
    executionId: 'exec-002',
    ruleId: 'skill-002',
    ruleName: '系统集成超时检测',
    executedBy: 'op-001',
    executedAt: '2024-07-14T14:30:00Z',
    triggeredBy: {
      triggerType: 'integration_failure',
      triggerData: { errorRate: 25, timeWindow: 300 },
      timestamp: '2024-07-14T14:25:00Z'
    },
    status: 'success',
    diagnosisResults: [
      {
        stepId: 'step-004',
        stepName: '收集集成调用数据',
        status: 'success',
        output: '集成调用数据收集完成',
        duration: 1500
      },
      {
        stepId: 'step-005',
        stepName: '分析超时模式',
        status: 'success',
        output: '超时模式分析完成',
        duration: 2200
      },
      {
        stepId: 'step-006',
        stepName: '关联分析',
        status: 'success',
        output: '关联分析完成',
        duration: 1900
      }
    ],
    actionResults: [
      {
        actionId: 'action-003',
        actionName: '发送超时告警',
        status: 'success',
        output: '告警发送成功',
        duration: 450
      },
      {
        actionId: 'action-004',
        actionName: '自动重试建议',
        status: 'pending',
        output: '等待人工审批',
        duration: 100
      }
    ],
    summary: '集成超时检测完成。ERP到CRM的API调用超时率25%。',
    confidence: 0.88,
    affectedSystems: ['sys-001', 'sys-002'],
    businessImpact: '客户数据同步失败，影响数据一致性',
    totalDuration: 6150,
    recommendations: [
      '增加API超时时间配置',
      '优化网络连接',
      '实施重试机制'
    ]
  }
]
