/**
 * Mock Data for Information System Operations Assistant
 * 信息系统运维助手 Mock 数据
 */

import type {
  Server,
  Metric,
  Activity,
  QuickCommand,
  InfoSystem,
  SystemLog,
  NetworkPacket,
  IntegrationCall,
  BusinessTransaction
} from '@/types'

// ==================== Information Systems ====================
export const infoSystems: InfoSystem[] = [
  {
    id: 'SYS-001',
    name: 'ERP系统',
    type: 'ERP',
    version: 'V12.5',
    status: 'normal',
    owner: '财务部',
    endpoint: 'https://erp.company.com/api',
    dependencies: ['SYS-003', 'SYS-004']
  },
  {
    id: 'SYS-002',
    name: 'CRM系统',
    type: 'CRM',
    version: 'V8.2',
    status: 'degraded',
    owner: '销售部',
    endpoint: 'https://crm.company.com/api',
    dependencies: ['SYS-004', 'SYS-005']
  },
  {
    id: 'SYS-003',
    name: 'OA办公系统',
    type: 'OA',
    version: 'V6.0',
    status: 'normal',
    owner: '行政部',
    endpoint: 'https://oa.company.com',
    dependencies: ['SYS-001']
  },
  {
    id: 'SYS-004',
    name: '数据中台',
    type: 'DATA_PLATFORM',
    version: 'V3.1',
    status: 'degraded',
    owner: '信息技术部',
    endpoint: 'https://data-platform.company.com',
    dependencies: []
  },
  {
    id: 'SYS-005',
    name: '支付网关',
    type: 'PAYMENT',
    version: 'V2.8',
    status: 'normal',
    owner: '财务部',
    endpoint: 'https://payment.company.com',
    dependencies: ['SYS-004']
  },
  {
    id: 'SYS-006',
    name: 'MES制造执行系统',
    type: 'MES',
    version: 'V4.3',
    status: 'normal',
    owner: '生产部',
    endpoint: 'https://mes.company.com',
    dependencies: ['SYS-001', 'SYS-004']
  }
]

// ==================== Multi-format System Logs ====================
// 每个系统的日志格式都不一样

export const systemLogs: SystemLog[] = [
  // ===== ERP系统 - JSON格式 =====
  {
    id: 'LOG-001',
    systemId: 'SYS-001',
    systemName: 'ERP系统',
    timestamp: '2025-01-29T15:23:45.123Z',
    level: 'ERROR',
    format: 'json',
    raw: '{"timestamp":"2025-01-29T15:23:45.123Z","level":"ERROR","module":"OrderService","transactionId":"TXN-20250129-001","userId":"user123","errorCode":"INV-001","message":"库存不足","metadata":{"productId":"P-1001","requestedQty":500,"availableQty":200}}',
    parsed: {
      message: '库存不足',
      module: 'OrderService',
      transactionId: 'TXN-20250129-001',
      userId: 'user123',
      errorCode: 'INV-001',
      metadata: { productId: 'P-1001', requestedQty: 500, availableQty: 200 }
    }
  },
  {
    id: 'LOG-002',
    systemId: 'SYS-001',
    systemName: 'ERP系统',
    timestamp: '2025-01-29T15:22:30.456Z',
    level: 'WARN',
    format: 'json',
    raw: '{"timestamp":"2025-01-29T15:22:30.456Z","level":"WARN","module":"PaymentIntegration","transactionId":"TXN-20250129-002","message":"支付接口响应慢","duration":5200,"metadata":{"gateway":"payment-gateway","threshold":3000}}',
    parsed: {
      message: '支付接口响应慢',
      module: 'PaymentIntegration',
      transactionId: 'TXN-20250129-002',
      duration: 5200,
      metadata: { gateway: 'payment-gateway', threshold: 3000 }
    }
  },

  // ===== CRM系统 - XML格式 =====
  {
    id: 'LOG-003',
    systemId: 'SYS-002',
    systemName: 'CRM系统',
    timestamp: '2025-01-29T15:21:15.789Z',
    level: 'ERROR',
    format: 'xml',
    raw: '<log><timestamp>2025-01-29T15:21:15.789Z</timestamp><level>ERROR</level><module>CustomerSync</module><transactionId>T-CRM-001</transactionId><errorCode>SYNC-FAILED</errorCode><message>客户数据同步失败</message><details><sourceSystem>ERP</sourceSystem><targetSystem>CRM</targetSystem><affectedRecords>150</affectedRecords></details></log>',
    parsed: {
      message: '客户数据同步失败',
      module: 'CustomerSync',
      transactionId: 'T-CRM-001',
      errorCode: 'SYNC-FAILED',
      metadata: { sourceSystem: 'ERP', targetSystem: 'CRM', affectedRecords: 150 }
    }
  },
  {
    id: 'LOG-004',
    systemId: 'SYS-002',
    systemName: 'CRM系统',
    timestamp: '2025-01-29T15:20:10.234Z',
    level: 'ERROR',
    format: 'xml',
    raw: '<log><timestamp>2025-01-29T15:20:10.234Z</timestamp><level>ERROR</level><module>APIDataProvider</module><transactionId>T-API-001</transactionId><errorCode>TIMEOUT</errorCode><message>数据平台接口超时</message><details><endpoint>/api/v1/customer/list</endpoint><timeout>30000ms</timeout></details></log>',
    parsed: {
      message: '数据平台接口超时',
      module: 'APIDataProvider',
      transactionId: 'T-API-001',
      errorCode: 'TIMEOUT',
      duration: 30000,
      metadata: { endpoint: '/api/v1/customer/list', timeout: '30000ms' }
    }
  },

  // ===== OA系统 - 自定义文本格式 =====
  {
    id: 'LOG-005',
    systemId: 'SYS-003',
    systemName: 'OA办公系统',
    timestamp: '2025-01-29T15:19:05.567Z',
    level: 'INFO',
    format: 'custom',
    raw: '[2025-01-29 15:19:05] INFO  [ApprovalFlow-Handler] TXN:OA-WF-20250129-001 | 用户:admin | 操作:审批流程 | 状态:完成 | 耗时:2.3s',
    parsed: {
      message: '审批流程完成',
      module: 'ApprovalFlow-Handler',
      transactionId: 'OA-WF-20250129-001',
      userId: 'admin',
      duration: 2300
    }
  },
  {
    id: 'LOG-006',
    systemId: 'SYS-003',
    systemName: 'OA办公系统',
    timestamp: '2025-01-29T15:18:00.890Z',
    level: 'ERROR',
    format: 'custom',
    raw: '[2025-01-29 15:18:00] ERROR [ERP-Integration] TXN:OA-ERP-001 | 错误:ERP接口返回500 | 模块:请假单同步 | 详情:Server Error 500 | 重试次数:3',
    parsed: {
      message: 'ERP接口返回500错误',
      module: 'ERP-Integration',
      transactionId: 'OA-ERP-001',
      errorCode: 'HTTP-500',
      metadata: { module: '请假单同步', retryCount: 3 }
    }
  },

  // ===== 数据中台 - Syslog格式 =====
  {
    id: 'LOG-007',
    systemId: 'SYS-004',
    systemName: '数据中台',
    timestamp: '2025-01-29T15:17:20.123Z',
    level: 'ERROR',
    format: 'syslog',
    raw: '<34>1 2025-01-29T15:17:20.123Z data-platform.company.com DataSyncService - TSYNC-001 [mdc{sessionId=SID-123, thread=pool-2}] 数据同步任务失败 - 目标系统:CRM, 错误:连接被拒绝',
    parsed: {
      message: '数据同步任务失败',
      module: 'DataSyncService',
      transactionId: 'TSYNC-001',
      errorCode: 'CONN-REFUSED',
      metadata: { targetSystem: 'CRM', sessionId: 'SID-123', thread: 'pool-2' }
    }
  },
  {
    id: 'LOG-008',
    systemId: 'SYS-004',
    systemName: '数据中台',
    timestamp: '2025-01-29T15:16:15.456Z',
    level: 'WARN',
    format: 'syslog',
    raw: '<28>1 2025-01-29T15:16:15.456Z data-platform.company.com QueryEngine - TQUERY-001 [mdc{queryType=aggregation, tables=15}] 查询性能警告 - 执行时间:8.5s, 阈值:5s, 影响用户数:50',
    parsed: {
      message: '查询性能警告',
      module: 'QueryEngine',
      transactionId: 'TQUERY-001',
      duration: 8500,
      metadata: { queryType: 'aggregation', tables: 15, affectedUsers: 50 }
    }
  },

  // ===== 支付网关 - CSV格式 =====
  {
    id: 'LOG-009',
    systemId: 'SYS-005',
    systemName: '支付网关',
    timestamp: '2025-01-29T15:15:10.789Z',
    level: 'ERROR',
    format: 'csv',
    raw: '2025-01-29T15:15:10.789Z,ERROR,PaymentProcessor,PAY-20250129-001,用户U-1001,金额:5600.00,错误:INSUFFICIENT_BALANCE,通道:银联,状态:FAILED',
    parsed: {
      message: '余额不足',
      module: 'PaymentProcessor',
      transactionId: 'PAY-20250129-001',
      userId: 'U-1001',
      errorCode: 'INSUFFICIENT_BALANCE',
      metadata: { amount: '5600.00', channel: '银联', status: 'FAILED' }
    }
  },
  {
    id: 'LOG-010',
    systemId: 'SYS-005',
    systemName: '支付网关',
    timestamp: '2025-01-29T15:14:05.234Z',
    level: 'WARN',
    format: 'csv',
    raw: '2025-01-29T15:14:05.234Z,WARN,ChannelMonitor,PAY-MON-001,N/A,通道响应时间异常,通道:微信支付,响应时间:3500ms,阈值:2000ms',
    parsed: {
      message: '通道响应时间异常',
      module: 'ChannelMonitor',
      transactionId: 'PAY-MON-001',
      duration: 3500,
      metadata: { channel: '微信支付', threshold: 2000 }
    }
  },

  // ===== MES系统 - JSON格式（嵌套） =====
  {
    id: 'LOG-011',
    systemId: 'SYS-006',
    systemName: 'MES制造执行系统',
    timestamp: '2025-01-29T15:13:00.567Z',
    level: 'ERROR',
    format: 'json',
    raw: '{"timestamp":"2025-01-29T15:13:00.567Z","level":"ERROR","module":"ProductionOrder","transactionId":"PO-20250129-001","message":"生产订单下发失败","error":{"code":"MES-INV-001","description":"库存数据不一致","details":{"erpStock":1000,"mesStock":850,"difference":150,"materialId":"M-5001"}}}',
    parsed: {
      message: '生产订单下发失败',
      module: 'ProductionOrder',
      transactionId: 'PO-20250129-001',
      errorCode: 'MES-INV-001',
      metadata: {
        description: '库存数据不一致',
        erpStock: 1000,
        mesStock: 850,
        difference: 150,
        materialId: 'M-5001'
      }
    }
  },

  // ===== 更多ERP日志 =====
  {
    id: 'LOG-012',
    systemId: 'SYS-001',
    systemName: 'ERP系统',
    timestamp: '2025-01-29T15:12:30.890Z',
    level: 'ERROR',
    format: 'json',
    raw: '{"timestamp":"2025-01-29T15:12:30.890Z","level":"ERROR","module":"DataSyncScheduler","transactionId":"SYNC-ERP-001","message":"数据同步任务失败","errorCode":"DATA-PLATFORM-TIMEOUT","metadata":{"target":"数据中台","duration":45000,"timeout":30000}}',
    parsed: {
      message: '数据同步任务失败',
      module: 'DataSyncScheduler',
      transactionId: 'SYNC-ERP-001',
      errorCode: 'DATA-PLATFORM-TIMEOUT',
      duration: 45000,
      metadata: { target: '数据中台', timeout: 30000 }
    }
  }
]

// ==================== Network Packets ====================
export const networkPackets: NetworkPacket[] = [
  // ===== CRM调用数据中台 =====
  {
    id: 'PKT-001',
    timestamp: '2025-01-29T15:21:15.700Z',
    protocol: 'HTTPS',
    sourceIp: '10.1.2.20',
    sourcePort: 54321,
    destIp: '10.1.2.40',
    destPort: 443,
    size: 1524,
    direction: 'outbound',
    status: 'timeout',
    method: 'POST',
    path: '/api/v1/data/sync/customer',
    responseCode: undefined,
    latency: 30000,
    headers: {
      'Content-Type': 'application/json',
      'X-Request-ID': 'REQ-CRM-001',
      'X-Source-System': 'CRM'
    },
    payload: '{"action":"sync","timestamp":"2025-01-29T15:21:15Z"}'
  },
  {
    id: 'PKT-002',
    timestamp: '2025-01-29T15:20:10.100Z',
    protocol: 'HTTPS',
    sourceIp: '10.1.2.20',
    sourcePort: 54322,
    destIp: '10.1.2.40',
    destPort: 443,
    size: 856,
    direction: 'outbound',
    status: 'timeout',
    method: 'GET',
    path: '/api/v1/customer/list',
    responseCode: undefined,
    latency: 30000,
    headers: {
      'Accept': 'application/json',
      'X-Request-ID': 'REQ-CRM-002',
      'X-Source-System': 'CRM'
    }
  },

  // ===== OA调用ERP =====
  {
    id: 'PKT-003',
    timestamp: '2025-01-29T15:18:00.500Z',
    protocol: 'HTTP',
    sourceIp: '10.1.2.30',
    sourcePort: 45678,
    destIp: '10.1.2.10',
    destPort: 8080,
    size: 1245,
    direction: 'outbound',
    status: 'failed',
    method: 'POST',
    path: '/erp/api/leave/sync',
    responseCode: 500,
    latency: 1200,
    headers: {
      'Content-Type': 'application/json',
      'X-Request-ID': 'REQ-OA-001'
    },
    payload: '{"leaveId":"LV-001","userId":"user123"}'
  },

  // ===== 数据中台同步失败 =====
  {
    id: 'PKT-004',
    timestamp: '2025-01-29T15:17:20.200Z',
    protocol: 'TCP',
    sourceIp: '10.1.2.40',
    sourcePort: 33000,
    destIp: '10.1.2.20',
    destPort: 8443,
    size: 2000,
    direction: 'inbound',
    status: 'refused',
    latency: undefined
  },

  // ===== ERP同步到数据中台 =====
  {
    id: 'PKT-005',
    timestamp: '2025-01-29T15:12:30.600Z',
    protocol: 'HTTPS',
    sourceIp: '10.1.2.10',
    sourcePort: 51111,
    destIp: '10.1.2.40',
    destPort: 443,
    size: 5600,
    direction: 'outbound',
    status: 'timeout',
    method: 'POST',
    path: '/api/v1/sync/inventory',
    responseCode: undefined,
    latency: 45000,
    headers: {
      'Content-Type': 'application/json',
      'X-Source-System': 'ERP',
      'X-Sync-Type': 'full'
    }
  },

  // ===== MES查询ERP库存 =====
  {
    id: 'PKT-006',
    timestamp: '2025-01-29T15:13:00.800Z',
    protocol: 'SOAP',
    sourceIp: '10.1.2.50',
    sourcePort: 47890,
    destIp: '10.1.2.10',
    destPort: 8080,
    size: 2100,
    direction: 'outbound',
    status: 'success',
    method: 'POST',
    path: '/erp/ws/InventoryService',
    responseCode: 200,
    latency: 450,
    headers: {
      'Content-Type': 'text/xml; charset=utf-8',
      'SOAPAction': 'getInventory'
    },
    payload: '<soap:Envelope><soap:Body><getInventory><materialId>M-5001</materialId></getInventory></soap:Body></soap:Envelope>'
  },

  // ===== 正常的支付请求 =====
  {
    id: 'PKT-007',
    timestamp: '2025-01-29T15:22:30.400Z',
    protocol: 'HTTPS',
    sourceIp: '10.1.2.10',
    sourcePort: 51234,
    destIp: '10.1.2.50',
    destPort: 443,
    size: 1800,
    direction: 'outbound',
    status: 'success',
    method: 'POST',
    path: '/payment/api/pay',
    responseCode: 200,
    latency: 5200,
    headers: {
      'Content-Type': 'application/json',
      'X-Request-ID': 'REQ-PAY-001'
    }
  },

  // ===== 成功的数据查询 =====
  {
    id: 'PKT-008',
    timestamp: '2025-01-29T15:16:15.500Z',
    protocol: 'HTTPS',
    sourceIp: '10.1.2.25',
    sourcePort: 55555,
    destIp: '10.1.2.40',
    destPort: 443,
    size: 3400,
    direction: 'outbound',
    status: 'success',
    method: 'POST',
    path: '/api/v1/query/aggregate',
    responseCode: 200,
    latency: 8500,
    headers: {
      'Content-Type': 'application/json'
    }
  }
]

// ==================== Integration Calls ====================
export const integrationCalls: IntegrationCall[] = [
  {
    id: 'CALL-001',
    timestamp: '2025-01-29T15:21:15.000Z',
    sourceSystem: 'CRM系统',
    targetSystem: '数据中台',
    interfaceType: 'REST_API',
    operation: 'syncCustomerData',
    businessFlow: '客户主数据同步',
    status: 'timeout',
    duration: 30000,
    requestSize: 2500,
    responseSize: 0,
    errorCode: 'TIMEOUT',
    errorMessage: 'Connection timeout',
    retryCount: 3
  },
  {
    id: 'CALL-002',
    timestamp: '2025-01-29T15:18:00.000Z',
    sourceSystem: 'OA办公系统',
    targetSystem: 'ERP系统',
    interfaceType: 'REST_API',
    operation: 'syncLeaveRequest',
    businessFlow: '请假单审批',
    status: 'failed',
    duration: 1200,
    requestSize: 800,
    responseSize: 456,
    errorCode: 'HTTP-500',
    errorMessage: 'Internal Server Error',
    retryCount: 3
  },
  {
    id: 'CALL-003',
    timestamp: '2025-01-29T15:17:20.000Z',
    sourceSystem: '数据中台',
    targetSystem: 'CRM系统',
    interfaceType: 'MQ',
    operation: 'pushDataUpdate',
    businessFlow: '数据分发',
    status: 'failed',
    duration: 5000,
    requestSize: 5000,
    responseSize: 0,
    errorCode: 'CONN-REFUSED',
    errorMessage: 'Connection refused',
    retryCount: 1
  },
  {
    id: 'CALL-004',
    timestamp: '2025-01-29T15:13:00.000Z',
    sourceSystem: 'MES制造执行系统',
    targetSystem: 'ERP系统',
    interfaceType: 'SOAP',
    operation: 'queryInventory',
    businessFlow: '生产订单下发',
    status: 'success',
    duration: 450,
    requestSize: 1200,
    responseSize: 3500
  },
  {
    id: 'CALL-005',
    timestamp: '2025-01-29T15:12:30.000Z',
    sourceSystem: 'ERP系统',
    targetSystem: '数据中台',
    interfaceType: 'REST_API',
    operation: 'syncInventoryData',
    businessFlow: '库存数据同步',
    status: 'timeout',
    duration: 45000,
    requestSize: 5600,
    responseSize: 0,
    errorCode: 'TIMEOUT',
    errorMessage: 'Read timeout',
    retryCount: 2
  },
  {
    id: 'CALL-006',
    timestamp: '2025-01-29T15:22:30.000Z',
    sourceSystem: 'ERP系统',
    targetSystem: '支付网关',
    interfaceType: 'REST_API',
    operation: 'processPayment',
    businessFlow: '订单支付',
    status: 'success',
    duration: 5200,
    requestSize: 1800,
    responseSize: 2500
  }
]

// ==================== Business Transactions ====================
export const businessTransactions: BusinessTransaction[] = [
  {
    id: 'TXN-001',
    flowId: 'ORDER-TO-CASH',
    flowName: '订单到现金流程',
    timestamp: '2025-01-29T15:22:30.000Z',
    status: 'completed',
    totalTime: 8500,
    userId: 'user123',
    steps: [
      {
        stepId: 'STEP-001',
        system: 'ERP系统',
        operation: 'createOrder',
        status: 'success',
        duration: 300
      },
      {
        stepId: 'STEP-002',
        system: '支付网关',
        operation: 'processPayment',
        status: 'success',
        duration: 5200
      },
      {
        stepId: 'STEP-003',
        system: 'ERP系统',
        operation: 'updateOrderStatus',
        status: 'success',
        duration: 200
      },
      {
        stepId: 'STEP-004',
        system: 'CRM系统',
        operation: 'updateCustomerPoints',
        status: 'success',
        duration: 2800
      }
    ]
  },
  {
    id: 'TXN-002',
    flowId: 'PRODUCTION-ORDER',
    flowName: '生产订单流程',
    timestamp: '2025-01-29T15:13:00.000Z',
    status: 'failed',
    totalTime: 500,
    steps: [
      {
        stepId: 'STEP-001',
        system: 'MES制造执行系统',
        operation: 'createProductionOrder',
        status: 'success',
        duration: 50
      },
      {
        stepId: 'STEP-002',
        system: 'ERP系统',
        operation: 'queryInventory',
        status: 'success',
        duration: 450
      }
    ]
  },
  {
    id: 'TXN-003',
    flowId: 'LEAVE-APPROVAL',
    flowName: '请假审批流程',
    timestamp: '2025-01-29T15:18:00.000Z',
    status: 'failed',
    totalTime: 1200,
    userId: 'user123',
    steps: [
      {
        stepId: 'STEP-001',
        system: 'OA办公系统',
        operation: 'approveLeave',
        status: 'success',
        duration: 200
      },
      {
        stepId: 'STEP-002',
        system: 'OA办公系统',
        operation: 'syncToERP',
        status: 'failed',
        duration: 1000,
        error: 'ERP系统返回HTTP 500'
      }
    ]
  },
  {
    id: 'TXN-004',
    flowId: 'CUSTOMER-SYNC',
    flowName: '客户数据同步',
    timestamp: '2025-01-29T15:21:15.000Z',
    status: 'failed',
    totalTime: 30000,
    steps: [
      {
        stepId: 'STEP-001',
        system: 'CRM系统',
        operation: 'initiateSync',
        status: 'success',
        duration: 100
      },
      {
        stepId: 'STEP-002',
        system: '数据中台',
        operation: 'receiveData',
        status: 'failed',
        duration: 29900,
        error: 'Connection timeout'
      }
    ]
  }
]

// ==================== Legacy Mock Data (保留用于UI) ====================
export const mockServers: Server[] = [
  {
    id: 'srv-001',
    name: 'app-server-01',
    ip: '192.168.1.101',
    status: 'online',
    uptime: '45d 12h 33m',
    load: [0.67, 0.45, 0.32],
    cpu: 67,
    memory: 8.2,
    disk: 45
  },
  {
    id: 'srv-002',
    name: 'app-server-02',
    ip: '192.168.1.102',
    status: 'warning',
    uptime: '12d 08h 15m',
    load: [2.45, 2.12, 1.98],
    cpu: 92,
    memory: 11.4,
    disk: 48
  },
  {
    id: 'srv-003',
    name: 'db-server-01',
    ip: '192.168.1.201',
    status: 'online',
    uptime: '67d 04h 22m',
    load: [0.34, 0.28, 0.25],
    cpu: 34,
    memory: 6.8,
    disk: 52
  },
  {
    id: 'srv-004',
    name: 'cache-server-01',
    ip: '192.168.1.301',
    status: 'online',
    uptime: '23d 19h 45m',
    load: [0.42, 0.38, 0.31],
    cpu: 42,
    memory: 3.2,
    disk: 21
  }
]

export const mockMetrics: Metric[] = [
  {
    label: '系统健康度',
    value: '85%',
    change: -5,
    changeType: 'down',
    status: 'warning'
  },
  {
    label: '集成状态',
    value: '12/15',
    change: -3,
    changeType: 'down',
    status: 'warning'
  },
  {
    label: '活跃事务',
    value: '1,245',
    change: 120,
    changeType: 'up',
    status: 'positive'
  },
  {
    label: '错误率',
    value: '2.3%',
    change: 0.8,
    changeType: 'up',
    status: 'warning'
  }
]

export const mockActivities: Activity[] = [
  {
    id: 'act-001',
    title: '数据同步失败',
    description: 'CRM系统到数据中台的同步任务超时',
    type: 'warning',
    badge: '集成',
    timestamp: '2分钟前'
  },
  {
    id: 'act-002',
    title: '请假单同步失败',
    description: 'OA系统到ERP系统的接口返回500错误',
    type: 'warning',
    badge: '集成',
    timestamp: '5分钟前'
  },
  {
    id: 'act-003',
    title: '库存数据不一致',
    description: 'MES系统检测到ERP和MES库存数据差异',
    type: 'warning',
    badge: '数据',
    timestamp: '10分钟前'
  },
  {
    id: 'act-004',
    title: '订单支付成功',
    description: '订单ORD-20250129-001支付完成',
    type: 'success',
    badge: '支付',
    timestamp: '15分钟前'
  },
  {
    id: 'act-005',
    title: '数据查询性能告警',
    description: '数据中台聚合查询耗时8.5秒',
    type: 'warning',
    badge: '性能',
    timestamp: '20分钟前'
  }
]

export const quickCommands: QuickCommand[] = [
  {
    id: 'cmd-001',
    label: '全链路数据分析',
    icon: 'terminal',
    action: 'full_analysis'
  },
  {
    id: 'cmd-002',
    label: '容量规划',
    icon: 'activity',
    action: 'capacity_planning'
  },
  {
    id: 'cmd-003',
    label: '依赖拓扑图',
    icon: 'package',
    action: 'show_topology'
  },
  {
    id: 'cmd-004',
    label: 'SLA服务报告',
    icon: 'package',
    action: 'sla_report'
  }
]

// Export security data
export {
  securityDevices,
  securityRules,
  blockedConnections,
  portBlockIssues,
  networkDiagnostics,
  securitySummary
} from './securityData'

export {
  securitySystemLogs,
  securityNetworkPackets
} from './securityLogs'
