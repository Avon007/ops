/**
 * API Constants
 * API 相关常量
 */

export const API_STATUS_CODES = {
  // Success
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NO_CONTENT: 204,

  // Redirects
  MOVED_PERMANENTLY: 301,
  FOUND: 302,
  NOT_MODIFIED: 304,

  // Client errors
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,

  // Server errors
  INTERNAL_SERVER_ERROR: 500,
  NOT_IMPLEMENTED: 501,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504
} as const

export const HTTP_METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  PATCH: 'PATCH',
  DELETE: 'DELETE',
  HEAD: 'HEAD',
  OPTIONS: 'OPTIONS'
} as const

export const REQUEST_HEADERS = {
  ACCEPT: 'Accept',
  CONTENT_TYPE: 'Content-Type',
  AUTHORIZATION: 'Authorization',
  USER_AGENT: 'User-Agent',
  CACHE_CONTROL: 'Cache-Control',
  PRAGMA: 'Pragma'
} as const

export const CONTENT_TYPES = {
  JSON: 'application/json',
  FORM_URLENCODED: 'application/x-www-form-urlencoded',
  FORM_DATA: 'multipart/form-data',
  TEXT_PLAIN: 'text/plain',
  HTML: 'text/html',
  XML: 'application/xml'
} as const

export const API_DEFAULTS = {
  TIMEOUT: 30000, // 30 seconds
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // 1 second
  BASE_URL: '/api'
} as const

export const API_ERROR_MESSAGES: Record<number, string> = {
  200: 'Success',
  201: 'Resource created',
  204: 'Success (no content)',

  301: 'Resource moved permanently',
  302: 'Resource found',
  304: 'Resource not modified',

  400: 'Bad request',
  401: 'Unauthorized',
  403: 'Forbidden',
  404: 'Resource not found',
  405: 'Method not allowed',
  409: 'Resource conflict',
  422: 'Unprocessable entity',
  429: 'Too many requests',

  500: 'Internal server error',
  501: 'Not implemented',
  502: 'Bad gateway',
  503: 'Service unavailable',
  504: 'Gateway timeout'
} as const
