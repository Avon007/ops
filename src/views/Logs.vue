<script setup lang="ts">
/**
 * Logs View
 * 系统日志页面
 *
 * 优化内容:
 * 1. 使用 Pinia store 管理日志状态
 * 2. 使用 composables 提取辅助逻辑
 * 3. 简化组件，提高可维护性
 * 4. 遵循 Vue 3 Composition API 最佳实践
 */

import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import {
  Search,
  Filter,
  FileText,
  Download,
  RefreshCw,
  AlertTriangle,
  Info,
  AlertCircle,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Clock
} from 'lucide-vue-next'

// Store
import { useLogsStore } from '@/stores/logs'

// Composables
import { useLogHelpers } from '@/composables/useLogHelpers'

const router = useRouter()

// Store
const logsStore = useLogsStore()

// Composables
const {
  getLevelIcon,
  getLevelClass,
  getLevelBgColor,
  formatTimestamp,
  getLogLevels,
  getTimeRanges
} = useLogHelpers()

// State
const logLevels = ref(getLogLevels())
const selectedLevel = ref('全部')
const searchQuery = ref('')
const selectedTimeRange = ref('最近24小时')

// Computed
const filteredLogs = computed(() => {
  return logsStore.logs.filter(log => {
    const matchesLevel = selectedLevel.value === '全部' || log.level === selectedLevel.value.toLowerCase()
    const matchesSearch = searchQuery.value === '' ||
      log.message.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      log.service.toLowerCase().includes(searchQuery.value.toLowerCase())
    return matchesLevel && matchesSearch
  })
})

const stats = computed(() => logsStore.stats)

// Methods
const goToDashboard = () => {
  router.push('/')
}

const clearFilters = () => {
  selectedLevel.value = '全部'
  searchQuery.value = ''
  selectedTimeRange.value = '最近24小时'
}

const refreshLogs = async () => {
  await logsStore.refreshLogs()
}

const exportLogs = () => {
  logsStore.exportLogs('json')
}

const viewLogDetails = (logId: number) => {
  logsStore.setSelectedLog(logId)
}
</script>

<template>
  <div class="logs-container">
    <!-- Page Header -->
    <div class="page-header">
      <div class="header-content">
        <button class="back-button" @click="goToDashboard">
          ← 返回仪表板
        </button>
        <div class="header-title">
          <FileText :size="20" />
          <h1>系统日志</h1>
        </div>
        <p class="header-description">实时监控和分析应用程序日志</p>
      </div>
      <div class="header-actions">
        <button class="action-btn" @click="refreshLogs">
          <RefreshCw :size="14" />
          刷新
        </button>
        <button class="action-btn primary" @click="exportLogs">
          <Download :size="14" />
          导出
        </button>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-label">总日志数</div>
        <div class="stat-value">{{ stats.total }}</div>
      </div>
      <div class="stat-card stat-error">
        <div class="stat-label">错误</div>
        <div class="stat-value">{{ stats.errors }}</div>
      </div>
      <div class="stat-card stat-warning">
        <div class="stat-label">警告</div>
        <div class="stat-value">{{ stats.warnings }}</div>
      </div>
      <div class="stat-card stat-info">
        <div class="stat-label">信息</div>
        <div class="stat-value">{{ stats.info }}</div>
      </div>
    </div>

    <!-- Filters Bar -->
    <div class="filters-bar">
      <div class="filter-group">
        <Search :size="16" class="filter-icon" />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="搜索日志..."
          class="search-input"
        />
      </div>

      <div class="filter-group">
        <Filter :size="16" class="filter-icon" />
        <select v-model="selectedLevel" class="filter-select">
          <option v-for="level in logLevels" :key="level" :value="level">
            {{ level }}
          </option>
        </select>
      </div>

      <div class="filter-group">
        <Clock :size="16" class="filter-icon" />
        <select v-model="selectedTimeRange" class="filter-select">
          <option v-for="range in getTimeRanges()" :key="range" :value="range">
            {{ range }}
          </option>
        </select>
      </div>

      <button class="clear-filters-btn" @click="clearFilters">
        清除筛选
      </button>
    </div>

    <!-- Logs Table -->
    <div class="logs-table-container">
      <table class="logs-table">
        <thead>
          <tr>
            <th>时间戳</th>
            <th>级别</th>
            <th>服务</th>
            <th>消息</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="log in filteredLogs"
            :key="log.id"
            v-memo="[log.id, log.level]"
            :class="[getLevelClass(log.level)]"
            class="log-row"
          >
            <td class="log-timestamp">
              {{ log.timestamp }}
            </td>
            <td class="log-level">
              <span :class="['level-badge', getLevelClass(log.level)]" :style="{ backgroundColor: getLevelBgColor(log.level) }">
                <component :is="getLevelIcon(log.level)" :size="14" />
                {{ log.level.toUpperCase() }}
              </span>
            </td>
            <td class="log-service">{{ log.service }}</td>
            <td class="log-message">{{ log.message }}</td>
            <td class="log-actions">
              <button
                class="view-btn"
                @click="viewLogDetails(log.id)"
              >
                查看详情
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Pagination -->
      <div class="pagination">
        <ChevronLeft :size="16" class="pagination-arrow" />
        <div class="page-number active">1</div>
        <div class="page-number">2</div>
        <div class="page-number">3</div>
        <ChevronRight :size="16" class="pagination-arrow" />
      </div>
    </div>

    <!-- Log Details Modal -->
    <div v-if="logsStore.selectedLog" class="modal-overlay" @click="logsStore.setSelectedLog(null)">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h2>日志详情</h2>
          <button class="close-btn" @click="logsStore.setSelectedLog(null)">×</button>
        </div>
        <div class="modal-body">
          <div class="detail-row">
            <span class="detail-label">时间戳:</span>
            <span class="detail-value">{{ logsStore.selectedLog.timestamp }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">级别:</span>
            <span :class="['detail-value', 'level-badge', getLevelClass(logsStore.selectedLog.level)]" :style="{ backgroundColor: getLevelBgColor(logsStore.selectedLog.level) }">
              {{ logsStore.selectedLog.level.toUpperCase() }}
            </span>
          </div>
          <div class="detail-row">
            <span class="detail-label">服务:</span>
            <span class="detail-value">{{ logsStore.selectedLog.service }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">消息:</span>
            <span class="detail-value">{{ logsStore.selectedLog.message }}</span>
          </div>
          <div class="detail-row full">
            <span class="detail-label">详细信息:</span>
            <pre class="detail-value code">{{ logsStore.selectedLog.details }}</pre>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.logs-container {
  width: 100%;
  max-width: 1600px;
  margin: 0 auto;
  padding: var(--spacing-2xl) var(--spacing-2xl);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2xl);
  min-height: 100vh;
  background-color: var(--bg-white);
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
  white-space: nowrap;
}

.header-actions {
  display: flex;
  gap: var(--spacing-md);
  align-items: flex-start;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-md) var(--spacing-lg);
  border: 1px solid var(--border-color);
  background: var(--bg-white);
  color: var(--text-main);
  font-size: var(--font-size-caption-2);
  font-weight: 500;
  cursor: pointer;
  font-family: var(--font-family);
  transition: all 0.2s ease;
}

.action-btn:hover {
  border-color: var(--primary-green);
}

.action-btn.primary {
  background: var(--primary-green);
  color: var(--bg-white);
  border-color: var(--primary-green);
}

.action-btn.primary:hover {
  background: var(--status-error);
}

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--spacing-lg);
}

.stat-card {
  border: 1px solid var(--border-light);
  padding: 28px;
  display: flex;
  flex-direction: column;
  gap: 12px;
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

.stat-error .stat-value {
  color: var(--status-error);
}

.stat-warning .stat-value {
  color: var(--status-warning);
}

.stat-info .stat-value {
  color: var(--status-info);
}

/* Filters Bar */
.filters-bar {
  display: flex;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border: 1px solid var(--border-light);
  background: var(--bg-white);
}

.filter-icon {
  color: var(--text-gray);
}

.search-input {
  border: none;
  outline: none;
  font-size: 13px;
  font-family: var(--font-family);
  width: 200px;
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

.clear-filters-btn {
  padding: 8px 16px;
  border: 1px solid var(--border-light);
  background: var(--bg-white);
  color: var(--text-main);
  font-size: 13px;
  font-family: var(--font-family);
  cursor: pointer;
  border-radius: var(--border-radius);
  transition: all 0.2s ease;
}

.clear-filters-btn:hover {
  background-color: var(--bg-elevated);
  border-color: var(--primary-green);
}

/* Logs Table */
.logs-table-container {
  max-width: 100%;
  border: 1px solid var(--border-light);
}

.logs-table {
  width: 100%;
  border-collapse: collapse;
}

.logs-table thead {
  background-color: var(--bg-elevated);
}

.logs-table th {
  padding: 14px 20px;
  text-align: left;
  font-size: var(--font-size-caption-2);
  font-weight: 500;
  color: var(--text-gray);
  font-family: var(--font-family);
}

.logs-table td {
  padding: 16px 20px;
  border-top: 1px solid var(--border-light);
  font-size: 13px;
  font-family: var(--font-family);
}

.log-timestamp {
  color: var(--text-gray);
  font-family: var(--font-family);
  font-size: var(--font-size-caption-1);
}

.log-service {
  font-weight: 500;
  color: var(--text-main);
}

.log-message {
  color: var(--text-main);
}

.level-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  font-size: var(--font-size-caption-2);
  font-weight: 500;
  border-radius: var(--border-radius-sm);
}

.log-row:hover {
  background-color: var(--bg-elevated);
}

.view-btn {
  padding: 6px 12px;
  border: 1px solid var(--border-light);
  background: var(--bg-white);
  color: var(--text-main);
  font-size: var(--font-size-caption-1);
  font-weight: 500;
  cursor: pointer;
  font-family: var(--font-family);
}

.view-btn:hover {
  border-color: var(--status-error);
  color: var(--status-error);
}

/* Pagination */
.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: var(--spacing-2xl);
}

.page-number {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--border-light);
  font-size: var(--font-size-caption-1);
  font-weight: 500;
  cursor: pointer;
  font-family: var(--font-family);
}

.page-number.active {
  background-color: var(--text-main);
  color: var(--bg-white);
  border-color: var(--text-main);
}

.pagination-arrow {
  color: var(--text-gray);
  cursor: pointer;
}

.pagination-arrow:hover {
  color: var(--text-main);
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: var(--bg-white);
  border-radius: var(--border-radius);
  width: 600px;
  max-width: 90vw;
  max-height: 80vh;
  overflow: auto;
  box-shadow: var(--shadow-elevated);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-2xl);
  border-bottom: 1px solid var(--border-light);
}

.modal-header h2 {
  margin: 0;
  font-size: var(--font-size-title-3);
  font-weight: 600;
  color: var(--text-main);
  font-family: var(--font-family);
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: var(--text-gray);
  padding: 0;
  width: 32px;
  height: 32px;
}

.modal-body {
  padding: var(--spacing-2xl);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-base);
}

.detail-row {
  display: flex;
  gap: 12px;
}

.detail-row.full {
  flex-direction: column;
}

.detail-label {
  font-weight: 500;
  color: var(--text-gray);
  min-width: 80px;
  font-size: 13px;
  font-family: var(--font-family);
}

.detail-value {
  color: var(--text-main);
  font-size: 13px;
  font-family: var(--font-family);
}

.detail-value.code {
  background: var(--bg-elevated);
  padding: 12px;
  border-radius: var(--border-radius-sm);
  font-family: var(--font-family);
  font-size: var(--font-size-caption-1);
  white-space: pre-wrap;
  word-break: break-all;
}

/* Responsive */
@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .filters-bar {
    flex-direction: column;
    align-items: stretch;
  }

  .filter-group {
    width: 100%;
  }
}
</style>
