/**
 * 登录失败案例分析 - 完整的全链路追踪数据
 */

import type {
  Trace,
  SystemLog,
  NetworkPacket,
  AnalysisResult,
  TimelineEvent
} from '@/types'

// ==================== 登录失败案例数据 ====================

/**
 * 登录失败Trace - 用户尝试登录OA系统失败
 */
export const loginFailureTrace: Trace = {
  id: 'TRACE-LOGIN-FAIL-001',
  traceId: 'trace-login-fail-20250129-001',
  timestamp: '2025-01-29T16:15:30.000Z',
  duration: 5230,
  status: 'error',
  userId: 'user-employee-001',
  businessFlow: '用户登录',
  entrySystem: 'OA办公系统',
  tags: {
    eventType: 'login',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    clientIp: '192.168.1.150',
    loginMethod: 'password'
  },
  spans: [
    {
      spanId: 'span-login-001',
      system: 'OA办公系统',
      operation: 'receiveLoginRequest',
      startTime: '2025-01-29T16:15:30.000Z',
      duration: 50,
      status: 'success',
      tags: {
        'http.method': 'POST',
        'http.path': '/api/auth/login',
        'http.status_code': '200'
      },
      logs: [
        { timestamp: '2025-01-29T16:15:30.010Z', level: 'info', message: '收到登录请求' },
        { timestamp: '2025-01-29T16:15:30.040Z', level: 'info', message: '请求参数校验通过' }
      ],
      metrics: { cpuUsage: 25, memoryUsage: 40 }
    },
    {
      spanId: 'span-login-002',
      parentSpanId: 'span-login-001',
      system: 'OA办公系统',
      operation: 'validateCredentials',
      startTime: '2025-01-29T16:15:30.050Z',
      duration: 120,
      status: 'success',
      tags: {},
      logs: [
        { timestamp: '2025-01-29T16:15:30.060Z', level: 'info', message: '开始验证用户凭证' },
        { timestamp: '2025-01-29T16:15:30.140Z', level: 'info', message: '用户名格式验证通过' },
        { timestamp: '2025-01-29T16:15:30.160Z', level: 'info', message: '密码格式验证通过' }
      ],
      metrics: { cpuUsage: 30, memoryUsage: 42 }
    },
    {
      spanId: 'span-login-003',
      parentSpanId: 'span-login-002',
      system: 'OA办公系统',
      operation: 'queryUserFromDB',
      startTime: '2025-01-29T16:15:30.170Z',
      duration: 800,
      status: 'success',
      tags: {
        'db.query': 'SELECT * FROM users WHERE username = ?',
        'db.rows': '1'
      },
      logs: [
        { timestamp: '2025-01-29T16:15:30.180Z', level: 'info', message: '查询用户信息' },
        { timestamp: '2025-01-29T16:15:30.970Z', level: 'info', message: '用户信息查询成功' }
      ],
      metrics: { cpuUsage: 35, memoryUsage: 45, dbQueryCount: 1 }
    },
    {
      spanId: 'span-login-004',
      parentSpanId: 'span-login-002',
      system: 'OA办公系统',
      operation: 'checkLDAPConnection',
      startTime: '2025-01-29T16:15:31.000Z',
      duration: 3000,
      status: 'timeout',
      tags: {
        'ldap.server': 'ldap.company.com',
        'ldap.port': '389',
        timeout: '3000ms'
      },
      logs: [
        { timestamp: '2025-01-29T16:15:31.010Z', level: 'info', message: '连接LDAP服务器验证用户状态' },
        { timestamp: '2025-01-29T16:15:33.000Z', level: 'error', message: 'LDAP连接超时' },
        { timestamp: '2025-01-29T16:15:34.000Z', level: 'warn', message: 'LDAP验证失败，降级到本地验证' }
      ],
      metrics: { cpuUsage: 45, memoryUsage: 50, networkIo: 1024 }
    },
    {
      spanId: 'span-login-005',
      parentSpanId: 'span-login-002',
      system: 'OA办公系统',
      operation: 'localPasswordVerify',
      startTime: '2025-01-29T16:15:34.050Z',
      duration: 100,
      status: 'success',
      tags: {},
      logs: [
        { timestamp: '2025-01-29T16:15:34.060Z', level: 'info', message: '执行本地密码验证' },
        { timestamp: '2025-01-29T16:15:34.150Z', level: 'info', message: '密码验证通过' }
      ],
      metrics: { cpuUsage: 28, memoryUsage: 43 }
    },
    {
      spanId: 'span-login-006',
      parentSpanId: 'span-login-002',
      system: 'OA办公系统',
      operation: 'checkUserStatus',
      startTime: '2025-01-29T16:15:34.200Z',
      duration: 50,
      status: 'success',
      tags: {
        'user.status': 'active',
        'user.locked': 'false'
      },
      logs: [
        { timestamp: '2025-01-29T16:15:34.210Z', level: 'info', message: '检查用户状态' },
        { timestamp: '2025-01-29T16:15:34.250Z', level: 'info', message: '用户状态正常' }
      ],
      metrics: { cpuUsage: 26, memoryUsage: 41 }
    },
    {
      spanId: 'span-login-007',
      parentSpanId: 'span-login-001',
      system: 'OA办公系统',
      operation: 'createSession',
      startTime: '2025-01-29T16:15:34.300Z',
      duration: 100,
      status: 'success',
      tags: {
        'session.id': 'sess-20250129-001',
        'session.type': 'redis'
      },
      logs: [
        { timestamp: '2025-01-29T16:15:34.310Z', level: 'info', message: '创建用户会话' },
        { timestamp: '2025-01-29T16:15:34.400Z', level: 'info', message: '会话创建成功，存储到Redis' }
      ],
      metrics: { cpuUsage: 30, memoryUsage: 45, cacheHitRate: 95 }
    },
    {
      spanId: 'span-login-008',
      parentSpanId: 'span-login-001',
      system: 'OA办公系统',
      operation: 'syncLoginToERP',
      startTime: '2025-01-29T16:15:34.450Z',
      duration: 1000,
      status: 'error',
      tags: {
        'target.system': 'ERP系统',
        'api.endpoint': '/erp/api/sso/login'
      },
      logs: [
        { timestamp: '2025-01-29T16:15:34.460Z', level: 'info', message: '同步登录状态到ERP系统' },
        { timestamp: '2025-01-29T16:15:35.000Z', level: 'warn', message: 'ERP接口响应慢' },
        { timestamp: '2025-01-29T16:15:35.450Z', level: 'error', message: 'ERP接口返回500错误: Internal Server Error' }
      ],
      metrics: { cpuUsage: 35, memoryUsage: 48, networkIo: 512 }
    },
    {
      spanId: 'span-login-009',
      parentSpanId: 'span-login-001',
      system: 'OA办公系统',
      operation: 'recordLoginLog',
      startTime: '2025-01-29T16:15:35.500Z',
      duration: 30,
      status: 'success',
      tags: {
        'log.level': 'INFO',
        'log.action': 'login_attempt'
      },
      logs: [
        { timestamp: '2025-01-29T16:15:35.510Z', level: 'info', message: '记录登录日志' }
      ],
      metrics: { cpuUsage: 25, memoryUsage: 40 }
    }
  ]
}

/**
 * 相关系统日志
 */
export const loginFailureLogs: SystemLog[] = [
  // OA系统日志
  {
    id: 'LOG-LOGIN-001',
    systemId: 'SYS-003',
    systemName: 'OA办公系统',
    timestamp: '2025-01-29T16:15:30.000Z',
    level: 'INFO',
    format: 'custom',
    raw: '[2025-01-29 16:15:30] INFO [LoginController] 用户登录请求 | userId:user-employee-001 | clientIp:192.168.1.150',
    parsed: {
      message: '用户登录请求',
      module: 'LoginController',
      userId: 'user-employee-001'
    }
  },
  {
    id: 'LOG-LOGIN-002',
    systemId: 'SYS-003',
    systemName: 'OA办公系统',
    timestamp: '2025-01-29T16:15:33.000Z',
    level: 'ERROR',
    format: 'custom',
    raw: '[2025-01-29 16:15:33] ERROR [LDAPAuthProvider] LDAP连接超时 | server:ldap.company.com:389 | timeout:3000ms',
    parsed: {
      message: 'LDAP连接超时',
      module: 'LDAPAuthProvider',
      errorCode: 'LDAP_TIMEOUT'
    }
  },
  {
    id: 'LOG-LOGIN-003',
    systemId: 'SYS-003',
    systemName: 'OA办公系统',
    timestamp: '2025-01-29T16:15:34.000Z',
    level: 'WARN',
    format: 'custom',
    raw: '[2025-01-29 16:15:34] WARN [LoginController] LDAP验证失败，降级到本地密码验证 | fallback:true',
    parsed: {
      message: 'LDAP验证失败，降级到本地验证',
      module: 'LoginController'
    }
  },
  {
    id: 'LOG-LOGIN-004',
    systemId: 'SYS-003',
    systemName: 'OA办公系统',
    timestamp: '2025-01-29T16:15:35.450Z',
    level: 'ERROR',
    format: 'custom',
    raw: '[2025-01-29 16:15:35] ERROR [SSOService] ERP单点登录失败 | endpoint:/erp/api/sso/login | error:HTTP-500',
    parsed: {
      message: 'ERP单点登录失败',
      module: 'SSOService',
      errorCode: 'HTTP-500'
    }
  },
  // ERP系统日志
  {
    id: 'LOG-LOGIN-005',
    systemId: 'SYS-001',
    systemName: 'ERP系统',
    timestamp: '2025-01-29T16:15:34.500Z',
    level: 'ERROR',
    format: 'json',
    raw: '{"timestamp":"2025-01-29T16:15:34.500Z","level":"ERROR","module":"SSOController","transactionId":"SSO-20250129-001","message":"单点登录处理失败","errorCode":"INTERNAL_ERROR","details":{"errorMessage":"NullPointerException at SSOController.java:125","cause":"user session object is null"}}',
    parsed: {
      message: '单点登录处理失败',
      module: 'SSOController',
      transactionId: 'SSO-20250129-001',
      errorCode: 'INTERNAL_ERROR',
      metadata: { errorMessage: 'NullPointerException at SSOController.java:125', cause: 'user session object is null' }
    }
  },
  // 网络设备日志（模拟）
  {
    id: 'LOG-LOGIN-006',
    systemId: 'NET-001',
    systemName: '核心交换机',
    timestamp: '2025-01-29T16:15:32.000Z',
    level: 'WARN',
    format: 'syslog',
    raw: '<28>1 2025-01-29T16:15:32.000Z core-switch.company.com NetworkMonitor - [mdc{port:389, protocol:TCP}] TCP连接超时 | src:192.168.1.120 | dst:192.168.1.10 | duration:3000ms',
    parsed: {
      message: 'TCP连接超时',
      module: 'NetworkMonitor',
      metadata: { src: '192.168.1.120', dst: '192.168.1.10', duration: '3000ms' }
    }
  }
]

/**
 * 网络数据包
 */
export const loginFailurePackets: NetworkPacket[] = [
  {
    id: 'PKT-LOGIN-001',
    timestamp: '2025-01-29T16:15:30.000Z',
    protocol: 'HTTP',
    sourceIp: '192.168.1.150',
    sourcePort: 54321,
    destIp: '192.168.1.30',
    destPort: 8080,
    size: 1256,
    direction: 'inbound',
    status: 'success',
    method: 'POST',
    path: '/api/auth/login',
    responseCode: 200,
    latency: 50,
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
    },
    payload: '{"username":"employee001","password":"***"}'
  },
  {
    id: 'PKT-LOGIN-002',
    timestamp: '2025-01-29T16:15:31.000Z',
    protocol: 'TCP',
    sourceIp: '192.168.1.30',
    sourcePort: 45678,
    destIp: '192.168.1.10',
    destPort: 389,
    size: 200,
    direction: 'outbound',
    status: 'timeout',
    latency: 3000
  },
  {
    id: 'PKT-LOGIN-003',
    timestamp: '2025-01-29T16:15:34.500Z',
    protocol: 'HTTP',
    sourceIp: '192.168.1.30',
    sourcePort: 45679,
    destIp: '192.168.1.10',
    destPort: 8080,
    size: 856,
    direction: 'outbound',
    status: 'failed',
    method: 'POST',
    path: '/erp/api/sso/login',
    responseCode: 500,
    latency: 1000,
    headers: {
      'Content-Type': 'application/json',
      'X-Session-ID': 'sess-20250129-001'
    }
  }
]

/**
 * 时间线事件
 */
export const loginFailureTimeline: TimelineEvent[] = [
  {
    timestamp: '2025-01-29T16:15:30.000Z',
    event: '用户提交登录请求',
    type: 'user_action'
  },
  {
    timestamp: '2025-01-29T16:15:30.050Z',
    event: '开始验证用户凭证',
    type: 'metric'
  },
  {
    timestamp: '2025-01-29T16:15:30.170Z',
    event: '查询数据库用户信息',
    type: 'metric'
  },
  {
    timestamp: '2025-01-29T16:15:31.000Z',
    event: '连接LDAP服务器',
    type: 'metric'
  },
  {
    timestamp: '2025-01-29T16:15:33.000Z',
    event: 'ALERT: LDAP连接超时',
    type: 'alert'
  },
  {
    timestamp: '2025-01-29T16:15:34.000Z',
    event: '降级到本地密码验证',
    type: 'metric'
  },
  {
    timestamp: '2025-01-29T16:15:34.300Z',
    event: '创建用户会话',
    type: 'metric'
  },
  {
    timestamp: '2025-01-29T16:15:34.450Z',
    event: '同步登录状态到ERP',
    type: 'metric'
  },
  {
    timestamp: '2025-01-29T16:15:35.450Z',
    event: 'ALERT: ERP接口返回500错误',
    type: 'alert'
  },
  {
    timestamp: '2025-01-29T16:15:35.500Z',
    event: '记录登录日志（登录部分失败）',
    type: 'metric'
  }
]

/**
 * 分析结果
 */
export const loginFailureAnalysis: AnalysisResult = {
  timestamp: '2025-01-29 16:20:00',
  summary: '用户登录OA系统成功，但与ERP系统的单点登录同步失败。根本原因是ERP系统的SSO接口存在空指针异常，导致部分登录功能不可用。',
  overallHealth: 'warning',
  keyFindings: [
    {
      category: 'integration',
      severity: 'critical',
      title: 'ERP单点登录接口异常',
      description: 'OA系统调用ERP的SSO接口时，ERP返回HTTP 500错误。根因是NullPointerException: user session object is null',
      metrics: ['HTTP状态码: 500', '错误类型: NullPointerException', '影响: ERP系统集成登录失败'],
      impact: '用户无法在OA和ERP系统间无缝切换，需要重复登录'
    },
    {
      category: 'performance',
      severity: 'warning',
      title: 'LDAP连接超时导致降级',
      description: 'OA系统连接LDAP服务器超时(3秒)，系统自动降级到本地密码验证，增加了3秒延迟',
      metrics: ['LDAP连接超时: 3000ms', '降级验证: 成功', '额外延迟: +3000ms'],
      impact: '登录响应时间从2.3秒增加到5.2秒，用户体验下降'
    },
    {
      category: 'reliability',
      severity: 'warning',
      title: '缺少容错机制',
      description: 'ERP SSO接口没有正确的空值检查，导致程序异常',
      metrics: ['空指针异常', '缺少输入校验', '错误处理不完善'],
      impact: '系统集成可靠性降低，容易出现级联故障'
    }
  ],
  bottlenecks: [
    {
      system: 'LDAP服务器',
      operation: 'authentication',
      type: 'latency',
      currentValue: 3000,
      baselineValue: 200,
      impactLevel: 'medium',
      description: 'LDAP连接超时3秒，远超200ms基线',
      suggestedActions: [
        '检查LDAP服务器网络连通性',
        '优化LDAP连接池配置',
        '减少LDAP超时时间或实施异步验证'
      ]
    },
    {
      system: 'ERP系统',
      operation: 'sso_login',
      type: 'error',
      currentValue: 100,
      baselineValue: 0,
      impactLevel: 'critical',
      description: 'SSO接口错误率100%，应该为0%',
      suggestedActions: [
        '修复SSOController.java:125的空指针问题',
        '添加session对象的空值检查',
        '完善单元测试覆盖边界情况',
        '实施集成测试覆盖SSO场景'
      ]
    }
  ],
  recommendations: [
    {
      priority: 'urgent',
      category: '代码质量',
      title: '修复ERP SSO接口空指针异常',
      description: '在SSOController.java:125处添加session对象的空值检查，确保在访问session属性前进行验证',
      expectedBenefit: '恢复单点登录功能，提升用户体验',
      effort: 'quick'
    },
    {
      priority: 'high',
      category: '架构优化',
      title: '实施SSO异步化',
      description: '将ERP的SSO验证改为异步模式，OA系统不需要等待ERP响应即可完成登录',
      expectedBenefit: '解耦系统依赖，提升登录成功率，改善用户体验',
      effort: 'medium'
    },
    {
      priority: 'high',
      category: '性能优化',
      title: '优化LDAP连接配置',
      description: '检查LDAP服务器状态，优化连接池配置，考虑添加本地缓存减少LDAP依赖',
      expectedBenefit: '减少登录延迟3秒，提升用户满意度',
      effort: 'medium'
    },
    {
      priority: 'medium',
      category: '监控告警',
      title: '添加SSO接口监控',
      description: '为ERP的SSO接口添加专门的监控和告警，及时发现类似问题',
      expectedBenefit: '提前发现和解决问题，减少影响范围',
      effort: 'quick'
    },
    {
      priority: 'medium',
      category: '测试',
      title: '完善集成测试',
      description: '增加OA-ERP SSO集成测试，覆盖各种边界场景（session为空、网络异常等）',
      expectedBenefit: '提前发现潜在的集成问题，提升系统稳定性',
      effort: 'medium'
    }
  ],
  relatedInsights: [
    {
      id: 'INSIGHT-LOGIN-001',
      type: 'reliability',
      severity: 'critical',
      title: 'ERP集成问题频发',
      description: '近期ERP系统与OA系统的集成出现多次问题，建议深入检查ERP系统的接口质量和稳定性',
      affectedSystems: ['ERP系统', 'OA办公系统'],
      metrics: [
        { name: 'SSO错误率', currentValue: 100, baselineValue: 0, change: 100, trend: 'up' },
        { name: '接口响应时间', currentValue: 1000, baselineValue: 200, change: 400, trend: 'up' }
      ],
      recommendations: [
        '立即进行ERP接口质量审查',
        '建立ERP接口的性能和错误监控',
        '评估SSO架构的合理性'
      ],
      confidence: 0.92,
      generatedAt: '2025-01-29T16:20:00.000Z'
    }
  ]
}
