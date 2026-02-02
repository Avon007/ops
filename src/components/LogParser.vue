<script setup lang="ts">
import { FileText, Download, Trash2, Search } from 'lucide-vue-next'
import type { SystemLog } from '@/types'
import { useLogFilter, useLogFormatting, useLogExport } from '@/composables'

// Props
const props = defineProps<{
  logs: SystemLog[]
}>()

// Composables
const {
  searchText,
  selectedLevel,
  selectedSystem,
  filteredLogs,
  systems,
  logStats,
  clearFilters
} = useLogFilter(() => props.logs)

const {
  getLevelColor,
  getFormatLabel,
  formatLogContent,
  formatTimestamp,
  hasDetails
} = useLogFormatting()

const { exportLogs } = useLogExport()

// Methods
const handleExport = () => {
  exportLogs(filteredLogs.value)
}

const handleClear = () => {
  clearFilters()
}
</script>

<template>
  <div class="log-parser">
    <!-- Header -->
    <div class="log-parser-header">
      <div class="log-parser-title">
        <FileText :size="20" />
        <h2>日志解析工具</h2>
      </div>
      <div class="log-parser-actions">
        <button class="btn-secondary" @click="handleExport">
          <Download :size="16" />
          导出
        </button>
        <button class="btn-secondary" @click="handleClear">
          <Trash2 :size="16" />
          清空
        </button>
      </div>
    </div>

    <!-- Statistics -->
    <div class="log-stats">
      <div class="stat-item">
        <span class="stat-label">总计</span>
        <span class="stat-value">{{ logStats.total }}</span>
      </div>
      <div class="stat-item info">
        <span class="stat-label">INFO</span>
        <span class="stat-value">{{ logStats.info }}</span>
      </div>
      <div class="stat-item warning">
        <span class="stat-label">WARN</span>
        <span class="stat-value">{{ logStats.warn }}</span>
      </div>
      <div class="stat-item error">
        <span class="stat-label">ERROR</span>
        <span class="stat-value">{{ logStats.error }}</span>
      </div>
      <div class="stat-item debug">
        <span class="stat-label">DEBUG</span>
        <span class="stat-value">{{ logStats.debug }}</span>
      </div>
    </div>

    <!-- Filters -->
    <div class="log-filters">
      <div class="filter-group">
        <div class="search-box">
          <Search :size="16" class="search-icon" />
          <input
            v-model="searchText"
            type="text"
            placeholder="搜索日志内容..."
            class="search-input"
          />
        </div>
      </div>

      <div class="filter-group">
        <label>级别:</label>
        <select v-model="selectedLevel" class="filter-select">
          <option value="ALL">全部</option>
          <option value="INFO">INFO</option>
          <option value="WARN">WARN</option>
          <option value="ERROR">ERROR</option>
          <option value="DEBUG">DEBUG</option>
        </select>
      </div>

      <div class="filter-group" v-if="systems.length > 0">
        <label>系统:</label>
        <select v-model="selectedSystem" class="filter-select">
          <option value="ALL">全部</option>
          <option v-for="system in systems" :key="system" :value="system">
            {{ system }}
          </option>
        </select>
      </div>
    </div>

    <!-- Log List -->
    <div class="log-list">
      <div v-if="filteredLogs.length === 0" class="empty-state">
        <FileText :size="48" />
        <p>没有找到匹配的日志</p>
      </div>

      <div
        v-for="log in filteredLogs"
        :key="log.id"
        class="log-item"
        :class="log.level.toLowerCase()"
      >
        <div class="log-header">
          <div class="log-meta">
            <span class="log-badge" :class="getLevelColor(log.level)">
              {{ log.level }}
            </span>
            <span class="log-system">{{ log.systemName }}</span>
            <span class="log-format">{{ getFormatLabel(log.format) }}</span>
            <span class="log-time">{{ formatTimestamp(log.timestamp) }}</span>
          </div>
        </div>

        <div class="log-content">
          <div class="log-message" v-if="log.parsed">
            <strong>{{ log.parsed.message }}</strong>
            <span v-if="log.parsed.module" class="log-module">[{{ log.parsed.module }}]</span>
            <span v-if="log.parsed.errorCode" class="log-error-code">{{ log.parsed.errorCode }}</span>
          </div>
          <pre class="log-raw">{{ formatLogContent(log) }}</pre>
        </div>

        <div class="log-details" v-if="hasDetails(log)">
          <div class="detail-item" v-if="log.parsed?.transactionId">
            <span class="detail-label">事务ID:</span>
            <span class="detail-value">{{ log.parsed.transactionId }}</span>
          </div>
          <div class="detail-item" v-if="log.parsed?.userId">
            <span class="detail-label">用户ID:</span>
            <span class="detail-value">{{ log.parsed.userId }}</span>
          </div>
          <div class="detail-item" v-if="log.parsed?.duration">
            <span class="detail-label">耗时:</span>
            <span class="detail-value">{{ log.parsed.duration }}ms</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.log-parser {
  background-color: var(--bg-white);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-xl);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
  height: 100%;
}

.log-parser-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.log-parser-title {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  color: var(--text-main);
  font-size: var(--font-size-title-2);
  font-weight: 600;
}

.log-parser-actions {
  display: flex;
  gap: var(--spacing-md);
}

.btn-secondary {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-sm) var(--spacing-md);
  background-color: var(--bg-body);
  border: 1px solid var(--border-light);
  border-radius: var(--border-radius);
  color: var(--text-main);
  cursor: pointer;
  font-size: var(--font-size-subhead);
  transition: all 0.2s ease;
}

.btn-secondary:hover {
  background-color: var(--bg-muted);
  border-color: var(--border-color);
}

.log-stats {
  display: flex;
  gap: var(--spacing-md);
  padding: var(--spacing-md);
  background-color: var(--bg-body);
  border-radius: var(--border-radius);
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-sm) var(--spacing-md);
  background-color: var(--bg-white);
  border-radius: var(--border-radius);
  min-width: 80px;
}

.stat-item.info {
  border-left: 3px solid #3b82f6;
}

.stat-item.warning {
  border-left: 3px solid #f59e0b;
}

.stat-item.error {
  border-left: 3px solid #ef4444;
}

.stat-item.debug {
  border-left: 3px solid #6b7280;
}

.stat-label {
  font-size: var(--font-size-caption-1);
  color: var(--text-gray);
  font-weight: 500;
}

.stat-value {
  font-size: var(--font-size-title-3);
  font-weight: 700;
  color: var(--text-main);
}

.log-filters {
  display: flex;
  gap: var(--spacing-md);
  align-items: center;
  flex-wrap: wrap;
}

.filter-group {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.search-box {
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: var(--spacing-md);
  color: var(--text-light);
}

.search-input {
  padding: var(--spacing-sm) var(--spacing-md) var(--spacing-sm) 36px;
  background-color: var(--bg-white);
  border: 1px solid var(--border-light);
  border-radius: var(--border-radius);
  color: var(--text-main);
  font-size: var(--font-size-body);
  min-width: 300px;
}

.search-input:focus {
  outline: none;
  border-color: var(--primary-green);
  box-shadow: 0 0 0 3px rgba(61, 138, 90, 0.1);
}

.filter-select {
  padding: var(--spacing-sm) var(--spacing-md);
  background-color: var(--bg-white);
  border: 1px solid var(--border-light);
  border-radius: var(--border-radius);
  color: var(--text-main);
  font-size: var(--font-size-body);
  cursor: pointer;
}

.log-list {
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-2xl);
  color: var(--text-light);
  gap: var(--spacing-md);
}

.log-item {
  background-color: var(--bg-body);
  border: 1px solid var(--border-light);
  border-radius: var(--border-radius);
  padding: var(--spacing-md);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  transition: all 0.2s ease;
}

.log-item:hover {
  border-color: var(--border-color);
  box-shadow: var(--shadow-sm);
}

.log-item.error {
  border-left: 3px solid #ef4444;
}

.log-item.warn {
  border-left: 3px solid #f59e0b;
}

.log-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.log-meta {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  flex-wrap: wrap;
}

.log-badge {
  padding: 2px 8px;
  border-radius: var(--border-radius-sm);
  font-size: var(--font-size-caption-1);
  font-weight: 600;
}

.log-system {
  font-size: var(--font-size-caption-1);
  color: var(--text-gray);
  font-weight: 500;
}

.log-format {
  padding: 2px 6px;
  background-color: var(--bg-muted);
  border-radius: var(--border-radius-sm);
  font-size: var(--font-size-caption-2);
  color: var(--text-gray);
  font-family: 'Courier New', monospace;
}

.log-time {
  font-size: var(--font-size-caption-1);
  color: var(--text-light);
}

.log-content {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.log-message {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  flex-wrap: wrap;
}

.log-module {
  padding: 2px 6px;
  background-color: var(--accent-light);
  border-radius: var(--border-radius-sm);
  font-size: var(--font-size-caption-2);
  color: var(--primary-green);
  font-family: 'Courier New', monospace;
  font-weight: 500;
}

.log-error-code {
  padding: 2px 6px;
  background-color: var(--status-error-bg);
  border-radius: var(--border-radius-sm);
  font-size: var(--font-size-caption-2);
  color: var(--status-error);
  font-family: 'Courier New', monospace;
  font-weight: 500;
}

.log-raw {
  margin: 0;
  padding: var(--spacing-sm);
  background-color: var(--bg-white);
  border-radius: var(--border-radius-sm);
  font-size: var(--font-size-footnote);
  color: var(--text-gray);
  font-family: 'Courier New', monospace;
  white-space: pre-wrap;
  word-break: break-all;
  overflow-x: auto;
}

.log-details {
  display: flex;
  gap: var(--spacing-md);
  flex-wrap: wrap;
  padding-top: var(--spacing-xs);
  border-top: 1px solid var(--border-light);
}

.detail-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  font-size: var(--font-size-caption-1);
}

.detail-label {
  color: var(--text-light);
}

.detail-value {
  color: var(--text-main);
  font-family: 'Courier New', monospace;
  font-weight: 500;
}
</style>
