/**
 * Time Constants
 * 时间相关常量
 */

export const TIME_CONSTANTS = {
  // Milliseconds
  MILLISECOND: 1,
  SECOND: 1000,
  MINUTE: 60 * 1000,
  HOUR: 60 * 60 * 1000,
  DAY: 24 * 60 * 60 * 1000,
  WEEK: 7 * 24 * 60 * 60 * 1000,
  MONTH: 30 * 24 * 60 * 60 * 1000,
  YEAR: 365 * 24 * 60 * 60 * 1000,

  // Seconds
  SECONDS_PER_MINUTE: 60,
  SECONDS_PER_HOUR: 60 * 60,
  SECONDS_PER_DAY: 24 * 60 * 60,
  SECONDS_PER_WEEK: 7 * 24 * 60 * 60,
  SECONDS_PER_MONTH: 30 * 24 * 60 * 60,
  SECONDS_PER_YEAR: 365 * 24 * 60 * 60,

  // Time ranges for filters
  TIME_RANGES: {
    LAST_15_MINUTES: 15 * 60 * 1000,
    LAST_1_HOUR: 60 * 60 * 1000,
    LAST_24_HOURS: 24 * 60 * 60 * 1000,
    LAST_7_DAYS: 7 * 24 * 60 * 60 * 1000,
    LAST_30_DAYS: 30 * 24 * 60 * 60 * 1000,
    LAST_90_DAYS: 90 * 24 * 60 * 60 * 1000
  } as const,

  // Default timeouts
  DEFAULT_TIMEOUT: 30 * 1000, // 30 seconds
  SHORT_TIMEOUT: 10 * 1000, // 10 seconds
  LONG_TIMEOUT: 60 * 1000, // 60 seconds

  // Refresh intervals
  REFRESH_INTERVALS: {
    FAST: 10 * 1000, // 10 seconds
    NORMAL: 30 * 1000, // 30 seconds
    SLOW: 60 * 1000, // 1 minute
    VERY_SLOW: 5 * 60 * 1000 // 5 minutes
  } as const,

  // Debounce and throttle delays
  DEBOUNCE_DELAY: 300,
  THROTTLE_DELAY: 200,

  // Animation durations
  ANIMATION_DURATION: {
    FAST: 150,
    NORMAL: 300,
    SLOW: 500
  } as const
} as const

export const TIME_FORMATS = {
  DATE: 'YYYY-MM-DD',
  TIME: 'HH:mm:ss',
  DATETIME: 'YYYY-MM-DD HH:mm:ss',
  DATETIME_SHORT: 'YYYY-MM-DD HH:mm',
  TIME_12H: 'hh:mm A',
  TIME_24H: 'HH:mm',
  MONTH_YEAR: 'YYYY-MM',
  READABLE_DATE: 'MMMM DD, YYYY',
  READABLE_DATETIME: 'MMMM DD, YYYY HH:mm',
  READABLE_TIME: 'HH:mm:ss'
} as const

export const TIMEZONES = {
  UTC: 'UTC',
  SHANGHAI: 'Asia/Shanghai',
  BEIJING: 'Asia/Shanghai',
  NEW_YORK: 'America/New_York',
  LONDON: 'Europe/London',
  TOKYO: 'Asia/Tokyo'
} as const
