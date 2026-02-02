/**
 * Mock System Logs for Security Devices and Port Block Issues
 * 安全隔离装置和端口阻塞相关的系统日志
 */

import type { SystemLog } from '@/types'

export const securitySystemLogs: SystemLog[] = [
  // 防火墙日志
  {
    id: 'log-sec-001',
    systemId: 'sec-001',
    systemName: '核心区防火墙-FW01',
    timestamp: '2024-07-15T14:28:42.123Z',
    level: 'WARN',
    format: 'syslog',
    raw: '<134>1 2024-07-15T14:28:42.123Z fw-01 kernel - - [FW-001-101] BLOCK: IN=eth0 OUT=eth1 SRC=203.0.113.45 DST=10.1.30.100 PROTO=TCP SPT=54231 DPT=3306',
    parsed: {
      message: '防火墙阻断: 外部IP 203.0.113.45 尝试访问数据库端口 3306',
      module: 'firewall',
      transactionId: 'fw-block-001',
      errorCode: 'FW_BLOCK_3306',
      metadata: {
        ruleId: 'FW-001-101',
        sourceIp: '203.0.113.45',
        destinationIp: '10.1.30.100',
        port: 3306,
        protocol: 'TCP',
        action: 'BLOCK'
      }
    }
  },
  {
    id: 'log-sec-002',
    systemId: 'sec-004',
    systemName: '安全隔离网关-SG01',
    timestamp: '2024-07-15T14:30:00.456Z',
    level: 'ERROR',
    format: 'json',
    raw: '{"timestamp":"2024-07-15T14:30:00.456Z","device":"SG01","level":"ERROR","message":"Policy disabled - dropping connection","policy_id":"FW-001-103","policy_name":"ERP系统8080端口访问策略","source_ip":"10.2.20.50","source_port":45678,"dest_ip":"10.1.10.100","dest_port":8080,"protocol":"TCP","action":"DROP","reason":"Policy is disabled"}',
    parsed: {
      message: '策略被禁用 - 丢弃连接: ERP系统8080端口访问策略',
      module: 'security_gateway',
      transactionId: 'sg-drop-001',
      errorCode: 'POLICY_DISABLED',
      metadata: {
        policyId: 'FW-001-103',
        sourceIp: '10.2.20.50',
        destinationIp: '10.1.10.100',
        port: 8080,
        action: 'DROP'
      }
    }
  },
  {
    id: 'log-sec-003',
    systemId: 'sec-001',
    systemName: '核心区防火墙-FW01',
    timestamp: '2024-07-15T13:45:22.789Z',
    level: 'ERROR',
    format: 'syslog',
    raw: '<133>1 2024-07-15T13:45:22.789Z fw-01 kernel - - [FW-001-102] REJECT: Blacklisted IP SRC=192.168.100.15 DST=10.2.20.100 PROTO=TCP SPT=0 DPT=80',
    parsed: {
      message: '防火墙拒绝: 黑名单IP 192.168.100.15 尝试访问 Web服务器',
      module: 'firewall',
      transactionId: 'fw-reject-001',
      errorCode: 'FW_BLACKLIST_REJECT',
      metadata: {
        ruleId: 'FW-001-102',
        sourceIp: '192.168.100.15',
        destinationIp: '10.2.20.100',
        port: 80,
        protocol: 'TCP',
        reason: 'IP in blacklist'
      }
    }
  },
  {
    id: 'log-sec-004',
    systemId: 'sec-003',
    systemName: '入侵防御系统-IPS01',
    timestamp: '2024-07-15T14:20:15.234Z',
    level: 'ERROR',
    format: 'json',
    raw: '{"timestamp":"2024-07-15T14:20:15.234Z","device":"IPS01","level":"ERROR","message":"SQL Injection attack detected","attack_type":"SQL_INJECTION","source_ip":"198.51.100.23","source_port":51234,"dest_ip":"10.1.20.80","dest_port":443,"protocol":"TCP","attack_pattern":"union select","action":"BLOCK","signature_id":"IPS-SQLI-001"}',
    parsed: {
      message: 'IPS检测: SQL注入攻击',
      module: 'ips',
      transactionId: 'ips-block-001',
      errorCode: 'IPS_SQL_INJECTION',
      metadata: {
        signatureId: 'IPS-SQLI-001',
        attackType: 'SQL_INJECTION',
        sourceIp: '198.51.100.23',
        destinationIp: '10.1.20.80',
        port: 443,
        pattern: 'union select'
      }
    }
  },
  {
    id: 'log-sec-005',
    systemId: 'sec-002',
    systemName: 'DMZ区防火墙-FW02',
    timestamp: '2024-07-15T14:25:00.567Z',
    level: 'WARN',
    format: 'syslog',
    raw: '<134>1 2024-07-15T14:25:00.567Z fw-02 kernel - - [FW-002-202] BLOCK: SSH access denied SRC=203.0.113.78 DST=10.2.30.50 PROTO=TCP SPT=54321 DPT=22',
    parsed: {
      message: '防火墙阻断: SSH访问被拒绝（仅允许内网）',
      module: 'firewall',
      transactionId: 'fw-ssh-block-001',
      errorCode: 'FW_SSH_DENY',
      metadata: {
        ruleId: 'FW-002-202',
        sourceIp: '203.0.113.78',
        destinationIp: '10.2.30.50',
        port: 22,
        protocol: 'TCP',
        reason: 'SSH access restricted to internal network'
      }
    }
  },

  // 应用层日志
  {
    id: 'log-sec-006',
    systemId: 'sys-001',
    systemName: 'ERP系统',
    timestamp: '2024-07-15T14:30:05.890Z',
    level: 'ERROR',
    format: 'json',
    raw: '{"timestamp":"2024-07-15T14:30:05.890Z","service":"erp-web","level":"ERROR","message":"Connection timeout - unable to connect to client","client_ip":"10.2.20.50","client_port":45678,"local_port":8080,"error":"Connection timeout after 30s","affected_users":25}',
    parsed: {
      message: 'ERP系统连接超时 - 客户端无法连接到8080端口',
      module: 'erp-web',
      transactionId: 'erp-timeout-001',
      errorCode: 'CONN_TIMEOUT',
      duration: 30000,
      metadata: {
        clientIp: '10.2.20.50',
        serverPort: 8080,
        affectedUsers: 25
      }
    }
  },
  {
    id: 'log-sec-007',
    systemId: 'sys-001',
    systemName: 'ERP系统',
    timestamp: '2024-07-15T14:31:12.345Z',
    level: 'ERROR',
    format: 'json',
    raw: '{"timestamp":"2024-07-15T14:31:12.345Z","service":"erp-api","level":"ERROR","message":"API connection failed","endpoint":"/api/orders","client_ip":"10.1.10.25","error":"Connection refused","attempts":3}',
    parsed: {
      message: 'ERP API连接失败 - 客户端被拒绝连接',
      module: 'erp-api',
      transactionId: 'erp-api-fail-001',
      errorCode: 'CONN_REFUSED',
      metadata: {
        endpoint: '/api/orders',
        clientIp: '10.1.10.25',
        attempts: 3
      }
    }
  },
  {
    id: 'log-sec-008',
    systemId: 'sys-002',
    systemName: 'CRM系统',
    timestamp: '2024-07-15T14:20:20.678Z',
    level: 'ERROR',
    format: 'json',
    raw: '{"timestamp":"2024-07-15T14:20:20.678Z","service":"crm-web","level":"ERROR","message":"SQL Injection attempt blocked","source_ip":"198.51.100.23","url":"/api/customers?id=1\' union select--","attack_pattern":"union select","action":"blocked_by_ips"}',
    parsed: {
      message: 'CRM系统检测到SQL注入攻击尝试 - IPS已阻断',
      module: 'crm-web',
      transactionId: 'crm-sqli-block-001',
      errorCode: 'SQL_INJECTION_ATTEMPT',
      metadata: {
        sourceIp: '198.51.100.23',
        url: '/api/customers',
        attackPattern: 'union select',
        action: 'blocked_by_ips'
      }
    }
  },
  {
    id: 'log-sec-009',
    systemId: 'sys-004',
    systemName: 'MySQL数据库',
    timestamp: '2024-07-15T14:28:45.901Z',
    level: 'WARN',
    format: 'json',
    raw: '{"timestamp":"2024-07-15T14:28:45.901Z","service":"mysql","level":"WARN","message":"External connection attempt blocked","source_ip":"203.0.113.45","source_port":54231,"port":3306,"error":"Access denied for external host","firewall_block":true}',
    parsed: {
      message: 'MySQL数据库外部连接尝试被防火墙阻断',
      module: 'mysql',
      transactionId: 'mysql-ext-block-001',
      errorCode: 'EXTERNAL_ACCESS_DENIED',
      metadata: {
        sourceIp: '203.0.113.45',
        port: 3306,
        firewallBlock: true
      }
    }
  },
  {
    id: 'log-sec-010',
    systemId: 'sys-005',
    systemName: 'OA系统',
    timestamp: '2024-07-15T14:25:30.234Z',
    level: 'ERROR',
    format: 'json',
    raw: '{"timestamp":"2024-07-15T14:25:30.234Z","service":"oa-file","level":"ERROR","message":"File server connection timeout","server":"10.1.50.10","port":445,"error":"Connection timeout","retry_count":3}',
    parsed: {
      message: 'OA系统文件服务器连接超时',
      module: 'oa-file',
      transactionId: 'oa-file-timeout-001',
      errorCode: 'FILE_CONN_TIMEOUT',
      duration: 30000,
      metadata: {
        server: '10.1.50.10',
        port: 445,
        retryCount: 3
      }
    }
  },

  // 系统告警日志
  {
    id: 'log-sec-011',
    systemId: 'sec-004',
    systemName: '安全隔离网关-SG01',
    timestamp: '2024-07-15T14:30:00.000Z',
    level: 'ERROR',
    format: 'json',
    raw: '{"timestamp":"2024-07-15T14:30:00.000Z","alert_type":"DEVICE_STATUS","device":"SG01","level":"ERROR","message":"Security Gateway Degraded","status":"degraded","reason":"High connection drop rate","drop_rate":85,"affected_service":"ERP System"}',
    parsed: {
      message: '安全隔离网关状态降级 - 连接丢弃率过高',
      module: 'device_monitor',
      errorCode: 'DEVICE_DEGRADED',
      metadata: {
        status: 'degraded',
        dropRate: 85,
        affectedService: 'ERP System'
      }
    }
  },
  {
    id: 'log-sec-012',
    systemId: 'monitor',
    systemName: '监控系统',
    timestamp: '2024-07-15T14:32:00.123Z',
    level: 'ERROR',
    format: 'json',
    raw: '{"timestamp":"2024-07-15T14:32:00.123Z","monitor":"net_monitor","level":"ERROR","message":"Port unreachable detected","target":"10.1.10.100:8080","test_type":"tcp_connect","result":"unreachable","duration":30000,"affected_system":"ERP System","impact":"Users unable to access ERP"}',
    parsed: {
      message: '端口不可达告警 - ERP系统8080端口无法连接',
      module: 'network_monitor',
      errorCode: 'PORT_UNREACHABLE',
      duration: 30000,
      metadata: {
        target: '10.1.10.100:8080',
        testType: 'tcp_connect',
        affectedSystem: 'ERP System',
        impact: 'Users unable to access ERP'
      }
    }
  },
  {
    id: 'log-sec-013',
    systemId: 'sec-001',
    systemName: '核心区防火墙-FW01',
    timestamp: '2024-07-15T14:35:00.456Z',
    level: 'INFO',
    format: 'syslog',
    raw: '<134>1 2024-07-15T14:35:00.456Z fw-01 kernel - - [FW-STAT] Statistics: Total connections=15234, Blocked=1247, Blocked rate=8.2%',
    parsed: {
      message: '防火墙统计: 总连接数15234，阻断1247，阻断率8.2%',
      module: 'firewall_stats',
      metadata: {
        totalConnections: 15234,
        blocked: 1247,
        blockedRate: 0.082
      }
    }
  },
  {
    id: 'log-sec-014',
    systemId: 'sys-001',
    systemName: 'ERP系统',
    timestamp: '2024-07-15T14:36:00.789Z',
    level: 'ERROR',
    format: 'json',
    raw: '{"timestamp":"2024-07-15T14:36:00.789Z","service":"erp-core","level":"ERROR","message":"Service degradation detected","active_connections":567,"failed_connections":182,"success_rate":67.7%,"error":"High connection failure rate"}',
    parsed: {
      message: 'ERP系统服务降级 - 连接失败率过高',
      module: 'erp-core',
      errorCode: 'SERVICE_DEGRADATION',
      metadata: {
        activeConnections: 567,
        failedConnections: 182,
        successRate: 0.677
      }
    }
  },
  {
    id: 'log-sec-015',
    systemId: 'monitor',
    systemName: '监控系统',
    timestamp: '2024-07-15T14:37:00.012Z',
    level: 'WARN',
    format: 'json',
    raw: '{"timestamp":"2024-07-15T14:37:00.012Z","monitor":"security_monitor","level":"WARN","message":"Multiple security events detected","event_count":6,"critical_events":4,"warning_events":2,"time_window":"5m","recommendation":"Investigate security gateway status"}',
    parsed: {
      message: '监控告警 - 检测到多个安全事件',
      module: 'security_monitor',
      errorCode: 'MULTIPLE_SECURITY_EVENTS',
      metadata: {
        eventCount: 6,
        criticalEvents: 4,
        warningEvents: 2,
        timeWindow: '5m'
      }
    }
  }
]

// 网络数据包捕获（安全设备相关）
export const securityNetworkPackets = [
  {
    id: 'pkt-sec-001',
    timestamp: '2024-07-15T14:28:42.123Z',
    protocol: 'TCP',
    sourceIp: '203.0.113.45',
    sourcePort: 54231,
    destIp: '10.1.30.100',
    destPort: 3306,
    size: 64,
    direction: 'inbound',
    status: 'refused',
    method: 'SYN',
    responseCode: null,
    latency: null,
    payload: 'SYN packet blocked',
    headers: {
      'flags': 'SYN',
      'window_size': '8192'
    }
  },
  {
    id: 'pkt-sec-002',
    timestamp: '2024-07-15T14:30:00.456Z',
    protocol: 'TCP',
    sourceIp: '10.2.20.50',
    sourcePort: 45678,
    destIp: '10.1.10.100',
    destPort: 8080,
    size: 1500,
    direction: 'inbound',
    status: 'failed',
    method: 'POST',
    responseCode: null,
    latency: 30000,
    payload: 'HTTP POST /api/orders',
    headers: {
      'host': '10.1.10.100:8080',
      'content-type': 'application/json'
    }
  },
  {
    id: 'pkt-sec-003',
    timestamp: '2024-07-15T13:45:22.789Z',
    protocol: 'TCP',
    sourceIp: '192.168.100.15',
    sourcePort: 51234,
    destIp: '10.2.20.100',
    destPort: 80,
    size: 512,
    direction: 'inbound',
    status: 'refused',
    method: 'GET',
    responseCode: null,
    latency: null,
    payload: 'HTTP GET /index.html',
    headers: {
      'host': '10.2.20.100',
      'user-agent': 'Mozilla/5.0'
    }
  },
  {
    id: 'pkt-sec-004',
    timestamp: '2024-07-15T14:20:15.234Z',
    protocol: 'HTTPS',
    sourceIp: '198.51.100.23',
    sourcePort: 51234,
    destIp: '10.1.20.80',
    destPort: 443,
    size: 2048,
    direction: 'inbound',
    status: 'failed',
    method: 'GET',
    responseCode: null,
    latency: null,
    payload: 'HTTPS GET /api/customers?id=1\' union select--',
    headers: {
      'host': '10.1.20.80',
      'user-agent': 'sqlmap/1.6.12'
    }
  },
  {
    id: 'pkt-sec-005',
    timestamp: '2024-07-15T14:25:00.567Z',
    protocol: 'TCP',
    sourceIp: '203.0.113.78',
    sourcePort: 54321,
    destIp: '10.2.30.50',
    destPort: 22,
    size: 72,
    direction: 'inbound',
    status: 'refused',
    method: 'SYN',
    responseCode: null,
    latency: null,
    payload: 'SSH SYN packet',
    headers: {
      'flags': 'SYN',
      'window_size': '65535'
    }
  }
]
