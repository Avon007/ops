/**
 * Error Code Constants
 * 错误码常量
 */

export const ERROR_CODES = {
  // General errors (1xxx)
  UNKNOWN_ERROR: '1000',
  INVALID_INPUT: '1001',
  VALIDATION_ERROR: '1002',
  NOT_FOUND: '1003',
  ALREADY_EXISTS: '1004',

  // Network errors (2xxx)
  NETWORK_ERROR: '2000',
  TIMEOUT_ERROR: '2001',
  CONNECTION_REFUSED: '2002',
  DNS_RESOLUTION_FAILED: '2003',

  // API errors (3xxx)
  API_ERROR: '3000',
  UNAUTHORIZED: '3001',
  FORBIDDEN: '3002',
  RATE_LIMIT_EXCEEDED: '3003',
  SERVER_ERROR: '3004',
  SERVICE_UNAVAILABLE: '3005',

  // Authentication errors (4xxx)
  AUTH_FAILED: '4000',
  TOKEN_EXPIRED: '4001',
  TOKEN_INVALID: '4002',
  INSUFFICIENT_PERMISSIONS: '4003',

  // Database errors (5xxx)
  DATABASE_ERROR: '5000',
  QUERY_FAILED: '5001',
  CONNECTION_LOST: '5002',
  CONSTRAINT_VIOLATION: '5003',

  // File errors (6xxx)
  FILE_NOT_FOUND: '6000',
  FILE_READ_ERROR: '6001',
  FILE_WRITE_ERROR: '6002',
  INVALID_FILE_FORMAT: '6003',

  // Business logic errors (7xxx)
  BUSINESS_LOGIC_ERROR: '7000',
  OPERATION_FAILED: '7001',
  RESOURCE_LOCKED: '7002',
  QUOTA_EXCEEDED: '7003'
} as const

export type ErrorCode = (typeof ERROR_CODES)[keyof typeof ERROR_CODES]

export const ERROR_MESSAGES: Record<ErrorCode, string> = {
  // General errors
  UNKNOWN_ERROR: 'An unknown error occurred',
  INVALID_INPUT: 'Invalid input provided',
  VALIDATION_ERROR: 'Validation failed',
  NOT_FOUND: 'Resource not found',
  ALREADY_EXISTS: 'Resource already exists',

  // Network errors
  NETWORK_ERROR: 'Network error occurred',
  TIMEOUT_ERROR: 'Request timed out',
  CONNECTION_REFUSED: 'Connection refused',
  DNS_RESOLUTION_FAILED: 'DNS resolution failed',

  // API errors
  API_ERROR: 'API error occurred',
  UNAUTHORIZED: 'Unauthorized access',
  FORBIDDEN: 'Access forbidden',
  RATE_LIMIT_EXCEEDED: 'Rate limit exceeded',
  SERVER_ERROR: 'Internal server error',
  SERVICE_UNAVAILABLE: 'Service temporarily unavailable',

  // Authentication errors
  AUTH_FAILED: 'Authentication failed',
  TOKEN_EXPIRED: 'Token has expired',
  TOKEN_INVALID: 'Invalid token',
  INSUFFICIENT_PERMISSIONS: 'Insufficient permissions',

  // Database errors
  DATABASE_ERROR: 'Database error occurred',
  QUERY_FAILED: 'Query execution failed',
  CONNECTION_LOST: 'Database connection lost',
  CONSTRAINT_VIOLATION: 'Database constraint violation',

  // File errors
  FILE_NOT_FOUND: 'File not found',
  FILE_READ_ERROR: 'Error reading file',
  FILE_WRITE_ERROR: 'Error writing file',
  INVALID_FILE_FORMAT: 'Invalid file format',

  // Business logic errors
  BUSINESS_LOGIC_ERROR: 'Business logic error',
  OPERATION_FAILED: 'Operation failed',
  RESOURCE_LOCKED: 'Resource is locked',
  QUOTA_EXCEEDED: 'Quota exceeded'
} as const
