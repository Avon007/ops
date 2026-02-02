/**
 * Mock Data for Security Devices and Port Block Issues
 * 安全隔离装置和端口阻塞模拟数据
 */

import type {
  SecurityDevice,
  SecurityRule,
  BlockedConnection,
  PortBlockIssue,
  NetworkDiagnostic
} from '@/types'

// 安全设备列表
export const securityDevices: SecurityDevice[] = [
  {
    id: 'sec-001',
    name: '核心区防火墙-FW01',
    type: 'firewall',
    vendor: '华为',
    model: 'USG6000',
    version: 'V500R005C20SPC300',
    status: 'online',
    ipAddress: '10.1.1.1',
    managedSystems: ['sys-001', 'sys-002', 'sys-003'],
    rules: [],
    blockedConnections: [],
    lastConfigChange: '2024-07-15T10:30:00Z'
  },
  {
    id: 'sec-002',
    name: 'DMZ区防火墙-FW02',
    type: 'firewall',
    vendor: '深信服',
    model: 'NGAF-1000',
    version: 'V8.0.6',
    status: 'online',
    ipAddress: '10.2.1.1',
    managedSystems: ['sys-004', 'sys-005'],
    rules: [],
    blockedConnections: [],
    lastConfigChange: '2024-07-10T14:20:00Z'
  },
  {
    id: 'sec-003',
    name: '入侵防御系统-IPS01',
    type: 'ips',
    vendor: '启明星辰',
    model: 'TI-HNUM',
    version: 'V3.0',
    status: 'online',
    ipAddress: '10.1.2.10',
    managedSystems: ['sys-001', 'sys-002', 'sys-003', 'sys-004'],
    rules: [],
    blockedConnections: [],
    lastConfigChange: '2024-07-01T09:00:00Z'
  },
  {
    id: 'sec-004',
    name: '安全隔离网关-SG01',
    type: 'security_gateway',
    vendor: '天融信',
    model: 'TopGate',
    version: 'V6.0',
    status: 'degraded',
    ipAddress: '10.1.3.1',
    managedSystems: ['sys-001', 'sys-006'],
    rules: [],
    blockedConnections: [],
    lastConfigChange: '2024-06-20T16:45:00Z'
  },
  {
    id: 'sec-005',
    name: 'Web应用防火墙-WAF01',
    type: 'proxy',
    vendor: '绿盟',
    model: 'WAF-2000',
    version: 'V7.5',
    status: 'online',
    ipAddress: '10.2.2.20',
    managedSystems: ['sys-004', 'sys-005'],
    rules: [],
    blockedConnections: [],
    lastConfigChange: '2024-07-12T11:15:00Z'
  }
]

// 安全规则
export const securityRules: SecurityRule[] = [
  {
    id: 'rule-001',
    ruleId: 'FW-001-100',
    name: '允许ERP到CRM的API调用',
    ruleType: 'allow',
    direction: 'bidirectional',
    sourceAddress: '10.1.10.0/24',
    sourcePort: 'any',
    destinationAddress: '10.1.20.0/24',
    destinationPort: 8080,
    protocol: 'TCP',
    enabled: true,
    hitCount: 15234,
    lastHit: '2024-07-15T14:32:15Z',
    createdAt: '2024-01-10T08:00:00Z',
    createdBy: 'admin'
  },
  {
    id: 'rule-002',
    ruleId: 'FW-001-101',
    name: '阻断外部访问数据库端口',
    ruleType: 'deny',
    direction: 'inbound',
    sourceAddress: '0.0.0.0/0',
    sourcePort: 'any',
    destinationAddress: '10.1.30.0/24',
    destinationPort: 3306,
    protocol: 'TCP',
    enabled: true,
    hitCount: 1247,
    lastHit: '2024-07-15T14:28:42Z',
    createdAt: '2024-01-10T08:05:00Z',
    createdBy: 'admin'
  },
  {
    id: 'rule-003',
    ruleId: 'FW-001-102',
    name: '允许OA系统到文件服务器',
    ruleType: 'allow',
    direction: 'outbound',
    sourceAddress: '10.1.40.0/24',
    sourcePort: 'any',
    destinationAddress: '10.1.50.10',
    destinationPort: 445,
    protocol: 'TCP',
    enabled: true,
    hitCount: 8762,
    lastHit: '2024-07-15T14:30:08Z',
    createdAt: '2024-01-15T10:00:00Z',
    createdBy: 'admin'
  },
  {
    id: 'rule-004',
    ruleId: 'FW-002-201',
    name: '阻断恶意IP访问',
    ruleType: 'deny',
    direction: 'inbound',
    sourceAddress: '192.168.100.0/24',
    sourcePort: 'any',
    destinationAddress: '10.2.0.0/16',
    destinationPort: 'any',
    protocol: 'ANY',
    enabled: true,
    hitCount: 342,
    lastHit: '2024-07-15T13:45:22Z',
    createdAt: '2024-06-01T14:00:00Z',
    createdBy: 'security-team'
  },
  {
    id: 'rule-005',
    ruleId: 'FW-002-202',
    name: '限制SSH访问',
    ruleType: 'allow',
    direction: 'inbound',
    sourceAddress: '10.0.0.0/8',
    sourcePort: 'any',
    destinationAddress: '10.2.0.0/16',
    destinationPort: 22,
    protocol: 'TCP',
    enabled: true,
    hitCount: 892,
    lastHit: '2024-07-15T14:25:30Z',
    createdAt: '2024-02-01T09:00:00Z',
    createdBy: 'admin'
  },
  {
    id: 'rule-006',
    ruleId: 'IPS-001-301',
    name: '检测SQL注入攻击',
    ruleType: 'monitor',
    direction: 'inbound',
    sourceAddress: 'any',
    sourcePort: 'any',
    destinationAddress: '10.1.0.0/16',
    destinationPort: 'any',
    protocol: 'TCP',
    enabled: true,
    hitCount: 156,
    lastHit: '2024-07-15T14:20:15Z',
    createdAt: '2024-03-01T08:00:00Z',
    createdBy: 'security-team'
  },
  {
    id: 'rule-007',
    ruleId: 'FW-001-103',
    name: 'ERP系统8080端口访问策略',
    ruleType: 'allow',
    direction: 'inbound',
    sourceAddress: '10.0.0.0/8',
    sourcePort: 'any',
    destinationAddress: '10.1.10.100',
    destinationPort: 8080,
    protocol: 'TCP',
    enabled: false, // 被禁用
    hitCount: 0,
    lastHit: '2024-07-14T18:00:00Z',
    createdAt: '2024-05-01T10:00:00Z',
    createdBy: 'ops-team'
  },
  {
    id: 'rule-008',
    ruleId: 'FW-001-104',
    name: '支付网关8443端口访问策略',
    ruleType: 'allow',
    direction: 'bidirectional',
    sourceAddress: '10.1.10.0/24',
    sourcePort: 'any',
    destinationAddress: '10.1.60.50',
    destinationPort: 8443,
    protocol: 'TCP',
    enabled: true,
    hitCount: 5678,
    lastHit: '2024-07-15T14:31:45Z',
    createdAt: '2024-04-01T08:00:00Z',
    createdBy: 'admin'
  }
]

// 为安全设备添加规则
securityDevices[0].rules = securityRules.filter(r => r.ruleId.startsWith('FW-001'))
securityDevices[1].rules = securityRules.filter(r => r.ruleId.startsWith('FW-002'))
securityDevices[2].rules = securityRules.filter(r => r.ruleId.startsWith('IPS-001'))

// 被阻断的连接
export const blockedConnections: BlockedConnection[] = [
  {
    id: 'block-001',
    timestamp: '2024-07-15T14:28:42Z',
    deviceId: 'sec-001',
    deviceName: '核心区防火墙-FW01',
    ruleId: 'rule-002',
    ruleName: '阻断外部访问数据库端口',
    sourceIp: '203.0.113.45',
    sourcePort: 54231,
    destinationIp: '10.1.30.100',
    destinationPort: 3306,
    protocol: 'TCP',
    blockReason: '策略阻断：不允许外部直接访问数据库端口3306',
    action: 'blocked',
    severity: 'warning',
    attemptCount: 127,
    firstAttempt: '2024-07-15T10:15:20Z',
    lastAttempt: '2024-07-15T14:28:42Z'
  },
  {
    id: 'block-002',
    timestamp: '2024-07-15T14:30:00Z',
    deviceId: 'sec-004',
    deviceName: '安全隔离网关-SG01',
    ruleId: 'rule-007',
    ruleName: 'ERP系统8080端口访问策略',
    sourceIp: '10.2.20.50',
    sourcePort: 45678,
    destinationIp: '10.1.10.100',
    destinationPort: 8080,
    protocol: 'TCP',
    blockReason: '策略被禁用：ERP系统8080端口访问策略已禁用',
    action: 'dropped',
    severity: 'critical',
    attemptCount: 2543,
    firstAttempt: '2024-07-14T18:00:00Z',
    lastAttempt: '2024-07-15T14:30:00Z'
  },
  {
    id: 'block-003',
    timestamp: '2024-07-15T13:45:22Z',
    deviceId: 'sec-001',
    deviceName: '核心区防火墙-FW01',
    ruleId: 'rule-004',
    ruleName: '阻断恶意IP访问',
    sourceIp: '192.168.100.15',
    sourcePort: 0,
    destinationIp: '10.2.20.100',
    destinationPort: 80,
    protocol: 'TCP',
    blockReason: '恶意IP阻断：源IP在黑名单中',
    action: 'rejected',
    severity: 'critical',
    attemptCount: 89,
    firstAttempt: '2024-07-15T11:20:00Z',
    lastAttempt: '2024-07-15T13:45:22Z'
  },
  {
    id: 'block-004',
    timestamp: '2024-07-15T14:20:15Z',
    deviceId: 'sec-003',
    deviceName: '入侵防御系统-IPS01',
    ruleId: 'rule-006',
    ruleName: '检测SQL注入攻击',
    sourceIp: '198.51.100.23',
    sourcePort: 51234,
    destinationIp: '10.1.20.80',
    destinationPort: 443,
    protocol: 'TCP',
    blockReason: 'IPS检测：检测到SQL注入攻击特征',
    action: 'blocked',
    severity: 'critical',
    attemptCount: 23,
    firstAttempt: '2024-07-15T14:15:00Z',
    lastAttempt: '2024-07-15T14:20:15Z'
  },
  {
    id: 'block-005',
    timestamp: '2024-07-15T14:25:00Z',
    deviceId: 'sec-002',
    deviceName: 'DMZ区防火墙-FW02',
    ruleId: 'rule-005',
    ruleName: '限制SSH访问',
    sourceIp: '203.0.113.78',
    sourcePort: 54321,
    destinationIp: '10.2.30.50',
    destinationPort: 22,
    protocol: 'TCP',
    blockReason: '策略限制：仅允许内网SSH访问',
    action: 'blocked',
    severity: 'warning',
    attemptCount: 45,
    firstAttempt: '2024-07-15T12:30:00Z',
    lastAttempt: '2024-07-15T14:25:00Z'
  },
  {
    id: 'block-006',
    timestamp: '2024-07-15T14:31:45Z',
    deviceId: 'sec-004',
    deviceName: '安全隔离网关-SG01',
    ruleId: 'rule-007',
    ruleName: 'ERP系统8080端口访问策略',
    sourceIp: '10.1.10.25',
    sourcePort: 46789,
    destinationIp: '10.1.10.100',
    destinationPort: 8080,
    protocol: 'TCP',
    blockReason: '策略被禁用：ERP系统8080端口访问策略已禁用',
    action: 'dropped',
    severity: 'critical',
    attemptCount: 182,
    firstAttempt: '2024-07-14T18:00:00Z',
    lastAttempt: '2024-07-15T14:31:45Z'
  }
]

// 为安全设备添加被阻断的连接
securityDevices[0].blockedConnections = blockedConnections.filter(b => b.deviceId === 'sec-001')
securityDevices[3].blockedConnections = blockedConnections.filter(b => b.deviceId === 'sec-004')
securityDevices[1].blockedConnections = blockedConnections.filter(b => b.deviceId === 'sec-002')
securityDevices[2].blockedConnections = blockedConnections.filter(b => b.deviceId === 'sec-003')

// 端口阻塞问题
export const portBlockIssues: PortBlockIssue[] = [
  {
    id: 'port-block-001',
    timestamp: '2024-07-15T14:30:00Z',
    systemName: 'ERP系统',
    systemType: 'ERP',
    portType: 'application_port',
    portNumber: 8080,
    protocol: 'TCP',
    status: 'blocked',
    blockReason: '安全隔离网关策略 FW-001-103 被禁用',
    affectedService: 'ERP Web服务',
    impactScope: ['ERP核心业务', '订单管理', '库存管理', '财务报表'],
    detectionMethod: 'log_analysis',
    relatedDevices: ['sec-004'],
    suggestedActions: [
      '检查防火墙策略 FW-001-103 的禁用原因',
      '确认是否需要启用该策略',
      '如需启用，联系安全管理员审批',
      '考虑启用备用端口'
    ],
    resolved: false
  },
  {
    id: 'port-block-002',
    timestamp: '2024-07-15T14:28:42Z',
    systemName: 'MySQL数据库',
    systemType: 'DATABASE',
    portType: 'database_port',
    portNumber: 3306,
    protocol: 'TCP',
    status: 'blocked',
    blockReason: '防火墙策略 FW-001-101 阻断外部访问',
    affectedService: '数据库服务',
    impactScope: ['外部系统数据访问', '报表生成', '数据同步'],
    detectionMethod: 'log_analysis',
    relatedDevices: ['sec-001'],
    suggestedActions: [
      '确认是否需要外部访问数据库',
      '通过VPN或跳板机访问',
      '检查安全策略是否需要调整',
      '建议使用中间层应用访问数据库'
    ],
    resolved: false
  },
  {
    id: 'port-block-003',
    timestamp: '2024-07-15T13:45:22Z',
    systemName: 'Web应用服务器',
    systemType: 'WEB_SERVER',
    portType: 'network_port',
    portNumber: 80,
    protocol: 'TCP',
    status: 'blocked',
    blockReason: '源IP在黑名单中',
    affectedService: 'HTTP Web服务',
    impactScope: ['外部访问', 'API调用'],
    detectionMethod: 'log_analysis',
    relatedDevices: ['sec-001'],
    suggestedActions: [
      '确认源IP是否为恶意IP',
      '如是误报，联系安全管理员解除黑名单',
      '检查是否有攻击行为'
    ],
    resolved: false
  },
  {
    id: 'port-block-004',
    timestamp: '2024-07-15T14:20:15Z',
    systemName: 'CRM系统',
    systemType: 'CRM',
    portType: 'application_port',
    portNumber: 443,
    protocol: 'TCP',
    status: 'blocked',
    blockReason: 'IPS检测到SQL注入攻击',
    affectedService: 'HTTPS Web服务',
    impactScope: ['CRM核心业务', '客户管理', '销售管理'],
    detectionMethod: 'log_analysis',
    relatedDevices: ['sec-003'],
    suggestedActions: [
      '立即检查攻击源IP',
      '分析攻击payload',
      '检查应用是否存在SQL注入漏洞',
      '临时阻断攻击IP'
    ],
    resolved: true,
    resolvedAt: '2024-07-15T14:35:00Z',
    resolutionNotes: '已将攻击IP加入黑名单，应用漏洞已修复'
  },
  {
    id: 'port-block-005',
    timestamp: '2024-07-15T14:25:00Z',
    systemName: '应用服务器',
    systemType: 'APP_SERVER',
    portType: 'service_port',
    portNumber: 22,
    protocol: 'TCP',
    status: 'blocked',
    blockReason: '仅允许内网SSH访问',
    affectedService: 'SSH服务',
    impactScope: ['远程管理', '运维操作'],
    detectionMethod: 'log_analysis',
    relatedDevices: ['sec-002'],
    suggestedActions: [
      '使用VPN连接到内网后再SSH',
      '通过跳板机访问',
      '确认是否需要临时开放外部SSH访问'
    ],
    resolved: false
  }
]

// 网络诊断结果
export const networkDiagnostics: NetworkDiagnostic[] = [
  {
    id: 'diag-001',
    timestamp: '2024-07-15T14:35:00Z',
    sourceIp: '10.1.10.25',
    targetIp: '10.1.10.100',
    targetPort: 8080,
    testType: 'port_scan',
    result: 'failed',
    details: {
      reachable: false,
      openPorts: [],
      error: 'Connection timed out'
    }
  },
  {
    id: 'diag-002',
    timestamp: '2024-07-15T14:36:00Z',
    sourceIp: '10.1.10.1',
    targetIp: '10.1.10.100',
    targetPort: 8080,
    testType: 'telnet',
    result: 'timeout',
    details: {
      latency: 30000,
      reachable: false,
      error: 'Telnet connection timeout'
    }
  },
  {
    id: 'diag-003',
    timestamp: '2024-07-15T14:37:00Z',
    sourceIp: '10.1.10.1',
    targetIp: '10.1.10.100',
    targetPort: 80,
    testType: 'ping',
    result: 'success',
    details: {
      latency: 2,
      packetLoss: 0,
      reachable: true
    }
  },
  {
    id: 'diag-004',
    timestamp: '2024-07-15T14:38:00Z',
    sourceIp: '10.1.10.1',
    targetIp: '10.1.30.100',
    targetPort: 3306,
    testType: 'curl',
    result: 'failed',
    details: {
      reachable: false,
      error: 'Connection refused by firewall'
    }
  },
  {
    id: 'diag-005',
    timestamp: '2024-07-15T14:39:00Z',
    sourceIp: '10.1.10.1',
    targetIp: '10.1.60.50',
    targetPort: 8443,
    testType: 'telnet',
    result: 'success',
    details: {
      latency: 5,
      reachable: true
    }
  }
]

// 导出综合数据
export const securitySummary = {
  totalDevices: securityDevices.length,
  onlineDevices: securityDevices.filter(d => d.status === 'online').length,
  degradedDevices: securityDevices.filter(d => d.status === 'degraded').length,
  offlineDevices: securityDevices.filter(d => d.status === 'offline').length,
  totalRules: securityRules.length,
  enabledRules: securityRules.filter(r => r.enabled).length,
  disabledRules: securityRules.filter(r => !r.enabled).length,
  totalBlockedConnections: blockedConnections.length,
  criticalBlocks: blockedConnections.filter(b => b.severity === 'critical').length,
  warningBlocks: blockedConnections.filter(b => b.severity === 'warning').length,
  totalPortIssues: portBlockIssues.length,
  resolvedPortIssues: portBlockIssues.filter(p => p.resolved).length,
  activePortIssues: portBlockIssues.filter(p => !p.resolved).length
}
