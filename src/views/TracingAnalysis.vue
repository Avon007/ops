<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { GitBranch, Search, CheckCircle, XCircle, AlertTriangle, ChevronDown, ChevronUp, Clock } from 'lucide-vue-next'
import { traces } from '@/mock/monitoringData'

const router = useRouter()

// State
const searchQuery = ref('')
const selectedStatus = ref<'All' | 'success' | 'error' | 'timeout'>('All')
const expandedTraceId = ref<string | null>(null)

// Computed
const filteredTraces = computed(() => {
  return traces.filter(trace => {
    const matchesStatus = selectedStatus.value === 'All' || trace.status === selectedStatus.value
    const matchesSearch = searchQuery.value === '' ||
      trace.traceId.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      trace.businessFlow.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      trace.entrySystem.toLowerCase().includes(searchQuery.value.toLowerCase())
    return matchesStatus && matchesSearch
  })
})

const stats = computed(() => {
  return {
    total: traces.length,
    success: traces.filter(t => t.status === 'success').length,
    error: traces.filter(t => t.status === 'error').length,
    timeout: traces.filter(t => t.status === 'timeout').length
  }
})

// Methods
const navigateToDashboard = () => {
  router.push('/')
}

const toggleTrace = (traceId: string) => {
  if (expandedTraceId.value === traceId) {
    expandedTraceId.value = null
  } else {
    expandedTraceId.value = traceId
  }
}

const getStatusIcon = (status: string) => {
  const icons = {
    success: CheckCircle,
    error: XCircle,
    timeout: AlertTriangle
  }
  return icons[status as keyof typeof icons] || CheckCircle
}

const getStatusColor = (status: string) => {
  const colors = {
    success: 'status-success',
    error: 'status-error',
    timeout: 'status-warning'
  }
  return colors[status as keyof typeof colors] || colors.success
}

const getStatusBg = (status: string) => {
  const colors = {
    success: 'status-bg-success',
    error: 'status-bg-error',
    timeout: 'status-bg-warning'
  }
  return colors[status as keyof typeof colors] || colors.success
}

const formatDuration = (ms: number) => {
  if (ms < 1000) return `${ms}ms`
  if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`
  return `${(ms / 1000).toFixed(0)}s`
}

const formatTime = (timestamp: string) => {
  return new Date(timestamp).toLocaleString('zh-CN')
}

const formatTimeShort = (timestamp: string) => {
  return new Date(timestamp).toLocaleTimeString('zh-CN')
}
</script>

<template>
  <div class="tracing-page">
    <!-- Page Header -->
    <div class="page-header">
      <div class="header-content">
        <button class="back-button" @click="navigateToDashboard">
          ← 返回仪表板
        </button>
        <div class="header-title">
          <GitBranch :size="20" />
          <h1>全链路追踪</h1>
        </div>
        <p class="header-description">分布式系统全链路追踪和性能分析</p>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-label">总追踪数</div>
        <div class="stat-value">{{ stats.total }}</div>
        <div class="stat-sub">所有业务流程</div>
      </div>
      <div class="stat-card stat-success">
        <div class="stat-label">成功</div>
        <div class="stat-value">{{ stats.success }}</div>
        <div class="stat-sub">正常完成</div>
      </div>
      <div class="stat-card stat-error">
        <div class="stat-label">失败</div>
        <div class="stat-value">{{ stats.error }}</div>
        <div class="stat-sub">业务错误</div>
      </div>
      <div class="stat-card stat-timeout">
        <div class="stat-label">超时</div>
        <div class="stat-value">{{ stats.timeout }}</div>
        <div class="stat-sub">性能问题</div>
      </div>
    </div>

    <!-- Filters Bar -->
    <div class="filters-bar">
      <div class="filter-group">
        <Search :size="16" class="filter-icon" />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="搜索追踪ID、业务流程或系统..."
          class="search-input"
        />
      </div>

      <div class="filter-group">
        <select v-model="selectedStatus" class="filter-select">
          <option value="All">全部状态</option>
          <option value="success">成功</option>
          <option value="error">失败</option>
          <option value="timeout">超时</option>
        </select>
      </div>
    </div>

    <!-- Traces List -->
    <div class="traces-list">
      <div v-if="filteredTraces.length === 0" class="empty-state">
        <AlertTriangle :size="48" class="empty-icon" />
        <h3>未找到追踪记录</h3>
        <p>请尝试调整搜索条件或筛选器</p>
      </div>

      <div
        v-for="trace in filteredTraces"
        :key="trace.traceId"
        class="trace-card"
        :class="`trace-${trace.status}`"
      >
        <!-- Trace Header -->
        <div class="trace-header" @click="toggleTrace(trace.traceId)">
          <div class="trace-header-left">
            <component
              :is="getStatusIcon(trace.status)"
              :size="20"
              :class="['trace-status-icon', getStatusColor(trace.status)]"
            />
            <div class="trace-info">
              <div class="trace-id">{{ trace.traceId }}</div>
              <div class="trace-flow">{{ trace.businessFlow }}</div>
            </div>
          </div>

          <div class="trace-header-right">
            <div class="trace-system">
              <span class="system-label">入口:</span>
              <span class="system-name">{{ trace.entrySystem }}</span>
            </div>
            <div class="trace-duration">{{ formatDuration(trace.duration) }}</div>
            <div :class="['trace-status-badge', getStatusBg(trace.status)]">
              {{ trace.status.toUpperCase() }}
            </div>
            <component
              :is="expandedTraceId === trace.traceId ? ChevronUp : ChevronDown"
              :size="16"
              class="expand-icon"
            />
          </div>
        </div>

        <!-- Trace Details (Expanded) -->
        <div v-if="expandedTraceId === trace.traceId" class="trace-details">
          <div class="detail-row">
            <span class="detail-label">追踪时间:</span>
            <span class="detail-value">{{ formatTime(trace.timestamp) }}</span>
          </div>

          <div v-if="trace.userId" class="detail-row">
            <span class="detail-label">用户ID:</span>
            <span class="detail-value">{{ trace.userId }}</span>
          </div>

          <div v-if="trace.tags && Object.keys(trace.tags).length > 0" class="detail-row">
            <span class="detail-label">标签:</span>
            <div class="tags-list">
              <span
                v-for="(value, key) in trace.tags"
                :key="key"
                class="tag"
              >
                {{ key }}: {{ value }}
              </span>
            </div>
          </div>

          <!-- Spans Tree -->
          <div class="spans-section">
            <h4>调用链路 ({{ trace.spans.length }} 个调用)</h4>
            <div class="spans-tree">
              <div
                v-for="(span, index) in trace.spans"
                :key="span.spanId"
                class="span-item"
                :style="{ marginLeft: span.parentSpanId ? '20px' : '0px' }"
              >
                <div class="span-item-header">
                  <Clock :size="12" class="span-icon" />
                  <span class="span-index">{{ index + 1 }}</span>
                  <span class="span-operation">{{ span.operation }}</span>
                  <span class="span-system">{{ span.system }}</span>
                  <span class="span-time">{{ formatTimeShort(span.startTime) }}</span>
                  <span class="span-duration">{{ formatDuration(span.duration) }}</span>
                  <component
                    :is="getStatusIcon(span.status)"
                    :size="14"
                    :class="['span-status', getStatusColor(span.status)]"
                  />
                </div>

                <!-- Span Logs -->
                <div v-if="span.logs && span.logs.length > 0" class="span-logs">
                  <div
                    v-for="log in span.logs"
                    :key="log.timestamp"
                    class="span-log"
                    :class="log.level"
                  >
                    <span class="log-time">{{ formatTimeShort(log.timestamp) }}</span>
                    <span class="log-level">[{{ log.level.toUpperCase() }}]</span>
                    <span class="log-message">{{ log.message }}</span>
                  </div>
                </div>

                <!-- Span Metrics -->
                <div v-if="span.metrics && Object.keys(span.metrics).length > 0" class="span-metrics">
                  <span
                    v-for="(value, key) in span.metrics"
                    :key="key"
                    class="span-metric"
                  >
                    {{ key }}: {{ value }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tracing-page {
  width: 100%;
  max-width: 1600px;
  margin: 0 auto;
  padding: var(--spacing-2xl) var(--spacing-2xl);
  min-height: 100vh;
  background-color: var(--bg-white);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2xl);
}

/* Page Header */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: var(--spacing-xl);
}

.header-content {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.back-button {
  padding: var(--spacing-sm) var(--spacing-md);
  background-color: transparent;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  color: var(--text-gray);
  font-size: var(--font-size-caption-2);
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: var(--font-family);
  width: fit-content;
}

.back-button:hover {
  background-color: var(--bg-elevated);
  border-color: var(--primary-green);
  color: var(--text-main);
}

.header-title {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  color: var(--text-main);
}

.header-title h1 {
  font-size: 32px;
  font-weight: 600;
  margin: 0;
  font-family: var(--font-family);
}

.header-description {
  font-size: var(--font-size-body);
  color: var(--text-gray);
  margin: 0;
  font-family: var(--font-family);
}

/* Stats Grid */
.stats-grid {
  display: flex;
  gap: 24px;
}

.stat-card {
  flex: 1;
  border: 1px solid var(--border-color);
  padding: 28px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  background-color: var(--bg-white);
  border-radius: var(--border-radius);
}

.stat-label {
  font-size: var(--font-size-caption-1);
  color: var(--text-gray);
  font-family: var(--font-family);
}

.stat-value {
  font-size: 36px;
  font-weight: 600;
  color: var(--text-main);
  font-family: var(--font-family);
}

.stat-sub {
  font-size: var(--font-size-caption-1);
  color: var(--text-light);
  font-family: var(--font-family);
}

.stat-success .stat-value {
  color: var(--status-success);
}

.stat-error .stat-value {
  color: var(--status-error);
}

.stat-timeout .stat-value {
  color: var(--status-warning);
}

/* Filters Bar */
.filters-bar {
  display: flex;
  gap: 12px;
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border: 1px solid var(--border-color);
  background: var(--bg-white);
  border-radius: var(--border-radius);
}

.filter-icon {
  color: var(--text-gray);
}

.search-input {
  border: none;
  outline: none;
  font-size: 13px;
  font-family: var(--font-family);
  width: 300px;
  color: var(--text-main);
}

.filter-select {
  border: none;
  outline: none;
  font-size: 13px;
  font-family: var(--font-family);
  background: transparent;
  cursor: pointer;
  color: var(--text-main);
}

/* Traces List */
.traces-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.trace-card {
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-lg);
  background: var(--bg-white);
  overflow: hidden;
  transition: all 0.2s ease;
}

.trace-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.trace-card.trace-error {
  border-left: 4px solid var(--status-error);
}

.trace-card.trace-timeout {
  border-left: 4px solid var(--status-warning);
}

.trace-card.trace-success {
  border-left: 4px solid var(--status-success);
}

/* Trace Header */
.trace-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.trace-header:hover {
  background-color: var(--bg-elevated);
}

.trace-header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.trace-status-icon {
  flex-shrink: 0;
}

.trace-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.trace-id {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-main);
  font-family: 'Courier New', monospace;
}

.trace-flow {
  font-size: 13px;
  color: var(--text-gray);
  font-family: var(--font-family);
}

.trace-header-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.trace-system {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
}

.system-label {
  color: var(--text-light);
}

.system-name {
  color: var(--text-main);
  font-weight: 500;
}

.trace-duration {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-main);
  font-family: 'Courier New', monospace;
}

.trace-status-badge {
  padding: 4px 12px;
  border-radius: var(--border-radius-sm);
  font-size: 11px;
  font-weight: 600;
}

.trace-status-badge.status-bg-success {
  background-color: var(--accent-light);
  color: var(--status-success);
}

.trace-status-badge.status-bg-error {
  background-color: var(--status-error-bg);
  color: var(--status-error);
}

.trace-status-badge.status-bg-warning {
  background-color: #FFF3E0;
  color: var(--status-warning);
}

.expand-icon {
  color: var(--text-gray);
  transition: transform 0.2s ease;
}

/* Trace Details */
.trace-details {
  padding: 20px;
  background-color: var(--bg-elevated);
  border-top: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.detail-row {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 13px;
}

.detail-label {
  color: var(--text-gray);
  min-width: 80px;
  font-weight: 500;
}

.detail-value {
  color: var(--text-main);
  font-family: 'Courier New', monospace;
}

.tags-list {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.tag {
  padding: 4px 10px;
  background-color: var(--bg-white);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-sm);
  font-size: 12px;
  color: var(--text-main);
  font-family: 'Courier New', monospace;
}

/* Spans Section */
.spans-section {
  margin-top: 12px;
}

.spans-section h4 {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-main);
  margin: 0 0 12px 0;
}

.spans-tree {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.span-item {
  padding: 12px;
  background-color: var(--bg-white);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
}

.span-item-header {
  display: flex;
  align-items: center;
  gap: 8px;
}

.span-icon {
  color: var(--text-light);
  flex-shrink: 0;
}

.span-index {
  font-size: 11px;
  color: var(--text-light);
  min-width: 20px;
}

.span-operation {
  font-weight: 600;
  color: var(--text-main);
  font-size: 13px;
}

.span-system {
  padding: 2px 8px;
  background-color: var(--bg-muted);
  border-radius: var(--border-radius-sm);
  font-size: 11px;
  color: var(--text-main);
}

.span-time {
  font-size: 11px;
  color: var(--text-light);
  font-family: 'Courier New', monospace;
  margin-left: auto;
}

.span-duration {
  font-size: 12px;
  font-weight: 600;
  color: var(--text-main);
  font-family: 'Courier New', monospace;
}

.span-status {
  flex-shrink: 0;
}

/* Span Logs */
.span-logs {
  margin-top: 8px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.span-log {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 10px;
  background-color: var(--bg-elevated);
  border-radius: var(--border-radius-sm);
  font-size: 12px;
  border-left: 2px solid transparent;
}

.span-log.error {
  border-left-color: var(--status-error);
}

.span-log.warn {
  border-left-color: var(--status-warning);
}

.span-log.info {
  border-left-color: var(--status-info);
}

.log-time {
  color: var(--text-light);
  font-family: 'Courier New', monospace;
  font-size: 11px;
}

.log-level {
  color: var(--text-gray);
  font-weight: 600;
  font-size: 10px;
}

.log-message {
  color: var(--text-main);
  flex: 1;
}

/* Span Metrics */
.span-metrics {
  margin-top: 8px;
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.span-metric {
  padding: 4px 8px;
  background-color: var(--bg-muted);
  border-radius: var(--border-radius-sm);
  font-size: 11px;
  color: var(--text-gray);
  font-family: 'Courier New', monospace;
}

/* Empty State */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  gap: 16px;
  text-align: center;
}

.empty-icon {
  color: var(--text-light);
}

.empty-state h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: var(--text-main);
}

.empty-state p {
  margin: 0;
  font-size: 14px;
  color: var(--text-gray);
}
</style>
