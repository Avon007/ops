import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { traces as mockTraces } from '@/mock/monitoringData'

/**
 * Span log structure
 */
export interface SpanLog {
  timestamp: string
  level: 'info' | 'warn' | 'error'
  message: string
}

/**
 * Span metrics
 */
export interface SpanMetrics {
  [key: string]: string | number
}

/**
 * Trace span structure
 */
export interface TraceSpan {
  spanId: string
  parentSpanId: string | null
  operation: string
  system: string
  startTime: string
  duration: number
  status: 'success' | 'error' | 'timeout'
  logs?: SpanLog[]
  metrics?: SpanMetrics
}

/**
 * Trace data structure
 */
export interface Trace {
  traceId: string
  businessFlow: string
  entrySystem: string
  timestamp: string
  duration: number
  status: 'success' | 'error' | 'timeout'
  userId?: string
  tags?: {
    [key: string]: string
  }
  spans: TraceSpan[]
}

/**
 * Tracing store - manages distributed tracing data
 */
export const useTracingStore = defineStore('tracing', () => {
  // State
  const traces = ref<Trace[]>([...mockTraces])
  const expandedTraceId = ref<string | null>(null)

  // Computed
  const stats = computed(() => ({
    total: traces.value.length,
    success: traces.value.filter(t => t.status === 'success').length,
    error: traces.value.filter(t => t.status === 'error').length,
    timeout: traces.value.filter(t => t.status === 'timeout').length
  }))

  // Actions
  const toggleTrace = (traceId: string) => {
    if (expandedTraceId.value === traceId) {
      expandedTraceId.value = null
    } else {
      expandedTraceId.value = traceId
    }
  }

  const getTraceById = (traceId: string): Trace | undefined => {
    return traces.value.find(t => t.traceId === traceId)
  }

  const addTrace = (trace: Trace) => {
    traces.value.unshift(trace)
  }

  const updateTrace = (traceId: string, updates: Partial<Trace>) => {
    const index = traces.value.findIndex(t => t.traceId === traceId)
    if (index !== -1) {
      traces.value[index] = { ...traces.value[index], ...updates }
    }
  }

  return {
    // State
    traces,
    expandedTraceId,

    // Computed
    stats,

    // Actions
    toggleTrace,
    getTraceById,
    addTrace,
    updateTrace
  }
})
