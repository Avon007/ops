/**
 * Validation Constants
 * 验证相关常量
 */

export const VALIDATION_RULES = {
  // String validation
  MIN_STRING_LENGTH: 1,
  MAX_STRING_LENGTH: 1000,
  MAX_TEXT_LENGTH: 10000,

  // Name validation
  MIN_NAME_LENGTH: 2,
  MAX_NAME_LENGTH: 100,

  // Email validation
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  MAX_EMAIL_LENGTH: 255,

  // URL validation
  URL_REGEX: /^https?:\/\/.+/,
  MAX_URL_LENGTH: 2048,

  // Password validation
  MIN_PASSWORD_LENGTH: 8,
  MAX_PASSWORD_LENGTH: 128,
  PASSWORD_REGEX: {
    HAS_UPPERCASE: /[A-Z]/,
    HAS_LOWERCASE: /[a-z]/,
    HAS_NUMBER: /[0-9]/,
    HAS_SPECIAL: /[!@#$%^&*(),.?":{}|<>]/
  },

  // Phone validation
  PHONE_REGEX: /^\+?[\d\s-()]+$/,
  MIN_PHONE_LENGTH: 10,
  MAX_PHONE_LENGTH: 15,

  // Number validation
  MIN_NUMBER: -Number.MAX_VALUE,
  MAX_NUMBER: Number.MAX_VALUE,
  MAX_DECIMAL_PLACES: 4,

  // Pagination
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,
  MIN_PAGE_NUMBER: 1,

  // ID validation
  ID_REGEX: /^[a-zA-Z0-9_-]+$/,
  MIN_ID_LENGTH: 1,
  MAX_ID_LENGTH: 50,

  // File validation
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  ALLOWED_DOCUMENT_TYPES: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain',
    'application/json'
  ],

  // Port validation
  MIN_PORT: 1,
  MAX_PORT: 65535,

  // IP address validation
  IPV4_REGEX: /^(\d{1,3}\.){3}\d{1,3}$/,
  IPV6_REGEX: /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/,

  // Percentage validation
  MIN_PERCENTAGE: 0,
  MAX_PERCENTAGE: 100
} as const

export const VALIDATION_MESSAGES = {
  REQUIRED: 'This field is required',
  INVALID_EMAIL: 'Please enter a valid email address',
  INVALID_URL: 'Please enter a valid URL',
  INVALID_PHONE: 'Please enter a valid phone number',
  PASSWORD_TOO_SHORT: `Password must be at least ${VALIDATION_RULES.MIN_PASSWORD_LENGTH} characters`,
  PASSWORD_TOO_WEAK: 'Password must contain uppercase, lowercase, number, and special character',
  INVALID_NUMBER: 'Please enter a valid number',
  NUMBER_TOO_SMALL: (min: number) => `Must be at least ${min}`,
  NUMBER_TOO_LARGE: (max: number) => `Must be at most ${max}`,
  STRING_TOO_SHORT: (min: number) => `Must be at least ${min} characters`,
  STRING_TOO_LONG: (max: number) => `Must be at most ${max} characters`,
  INVALID_DATE: 'Please enter a valid date',
  INVALID_FILE_TYPE: 'Invalid file type',
  FILE_TOO_LARGE: `File size must be less than ${VALIDATION_RULES.MAX_FILE_SIZE / 1024 / 1024}MB`,
  INVALID_PORT: `Port must be between ${VALIDATION_RULES.MIN_PORT} and ${VALIDATION_RULES.MAX_PORT}`,
  INVALID_IP: 'Please enter a valid IP address',
  INVALID_PERCENTAGE: `Must be between ${VALIDATION_RULES.MIN_PERCENTAGE} and ${VALIDATION_RULES.MAX_PERCENTAGE}`
} as const
