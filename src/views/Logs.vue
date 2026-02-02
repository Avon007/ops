<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import {
  Search,
  Filter,
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

const router = useRouter()

// Filter options
const logLevels = ref(['All', 'Error', 'Warning', 'Info', 'Debug'])
const selectedLevel = ref('All')
const searchQuery = ref('')
const selectedTimeRange = ref('Last 24h')

// Mock log data
const logs = ref([
  {
    id: 1,
    timestamp: '2026-01-29 14:32:15',
    level: 'error',
    service: 'api-service',
    message: 'Connection timeout to database server',
    details: 'Error: ETIMEDOUT at Connection.connect (net.js:123:45)'
  },
  {
    id: 2,
    timestamp: '2026-01-29 14:31:42',
    level: 'warning',
    service: 'frontend-v2',
    message: 'High memory usage detected',
    details: 'Memory usage at 85%, consider scaling up'
  },
  {
    id: 3,
    timestamp: '2026-01-29 14:30:28',
    level: 'info',
    service: 'auth-service',
    message: 'User login successful',
    details: 'User ID: 12345, IP: 192.168.1.100'
  },
  {
    id: 4,
    timestamp: '2026-01-29 14:29:15',
    level: 'error',
    service: 'payment-gateway',
    message: 'Payment processing failed',
    details: 'Transaction ID: txn_789xyz, Error: Invalid card format'
  },
  {
    id: 5,
    timestamp: '2026-01-29 14:28:33',
    level: 'debug',
    service: 'api-service',
    message: 'API request received',
    details: 'GET /api/v1/users?page=1&limit=10'
  },
  {
    id: 6,
    timestamp: '2026-01-29 14:27:21',
    level: 'info',
    service: 'deployment-service',
    message: 'Deployment completed successfully',
    details: 'frontend-v2.4.1 deployed to production'
  },
  {
    id: 7,
    timestamp: '2026-01-29 14:26:18',
    level: 'warning',
    service: 'cache-service',
    message: 'Cache miss rate increasing',
    details: 'Current miss rate: 45%, threshold: 40%'
  },
  {
    id: 8,
    timestamp: '2026-01-29 14:25:05',
    level: 'info',
    service: 'background-worker',
    message: 'Job completed',
    details: 'Report generation completed in 2.3s'
  },
  {
    id: 9,
    timestamp: '2026-01-29 14:24:12',
    level: 'error',
    service: 'email-service',
    message: 'Failed to send email',
    details: 'SMTP Error: Connection refused'
  },
  {
    id: 10,
    timestamp: '2026-01-29 14:23:45',
    level: 'debug',
    service: 'api-service',
    message: 'Database query executed',
    details: 'SELECT * FROM users WHERE active = true (23ms)'
  }
])

const selectedLog = ref<typeof logs.value[0] | null>(null)

// Computed
const filteredLogs = computed(() => {
  return logs.value.filter(log => {
    const matchesLevel = selectedLevel.value === 'All' || log.level === selectedLevel.value.toLowerCase()
    const matchesSearch = searchQuery.value === '' ||
      log.message.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      log.service.toLowerCase().includes(searchQuery.value.toLowerCase())
    return matchesLevel && matchesSearch
  })
})

const stats = computed(() => {
  return {
    total: logs.value.length,
    errors: logs.value.filter(l => l.level === 'error').length,
    warnings: logs.value.filter(l => l.level === 'warning').length,
    info: logs.value.filter(l => l.level === 'info').length,
    debug: logs.value.filter(l => l.level === 'debug').length
  }
})

// Methods
const goToDashboard = () => {
  router.push('/')
}

const getLevelIcon = (level: string) => {
  switch (level) {
    case 'error':
      return AlertCircle
    case 'warning':
      return AlertTriangle
    case 'info':
      return Info
    case 'debug':
      return CheckCircle
    default:
      return Info
  }
}

const getLevelClass = (level: string) => {
  return `log-level-${level}`
}

const refreshLogs = () => {
  console.log('Refreshing logs...')
}

const exportLogs = () => {
  console.log('Exporting logs...')
}

const viewLogDetails = (log: typeof logs.value[0]) => {
  selectedLog.value = log
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
        <div class="stat-label">Total Logs</div>
        <div class="stat-value">{{ stats.total }}</div>
      </div>
      <div class="stat-card stat-error">
        <div class="stat-label">Errors</div>
        <div class="stat-value">{{ stats.errors }}</div>
      </div>
      <div class="stat-card stat-warning">
        <div class="stat-label">Warnings</div>
        <div class="stat-value">{{ stats.warnings }}</div>
      </div>
      <div class="stat-card stat-info">
        <div class="stat-label">Info</div>
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
          placeholder="Search logs..."
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
          <option>Last 15m</option>
          <option>Last 1h</option>
          <option selected>Last 24h</option>
          <option>Last 7d</option>
          <option>Custom</option>
        </select>
      </div>
    </div>

    <!-- Logs Table -->
    <div class="logs-table-container">
      <table class="logs-table">
        <thead>
          <tr>
            <th>Timestamp</th>
            <th>Level</th>
            <th>Service</th>
            <th>Message</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="log in filteredLogs"
            :key="log.id"
            :class="[getLevelClass(log.level)]"
            class="log-row"
          >
            <td class="log-timestamp">
              {{ log.timestamp }}
            </td>
            <td class="log-level">
              <span :class="['level-badge', getLevelClass(log.level)]">
                <component :is="getLevelIcon(log.level)" :size="14" />
                {{ log.level.toUpperCase() }}
              </span>
            </td>
            <td class="log-service">{{ log.service }}</td>
            <td class="log-message">{{ log.message }}</td>
            <td class="log-actions">
              <button
                class="view-btn"
                @click="viewLogDetails(log)"
              >
                View Details
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
    <div v-if="selectedLog" class="modal-overlay" @click="selectedLog = null">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h2>Log Details</h2>
          <button class="close-btn" @click="selectedLog = null">×</button>
        </div>
        <div class="modal-body">
          <div class="detail-row">
            <span class="detail-label">Timestamp:</span>
            <span class="detail-value">{{ selectedLog.timestamp }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Level:</span>
            <span :class="['detail-value', 'level-badge', getLevelClass(selectedLog.level)]">
              {{ selectedLog.level.toUpperCase() }}
            </span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Service:</span>
            <span class="detail-value">{{ selectedLog.service }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Message:</span>
            <span class="detail-value">{{ selectedLog.message }}</span>
          </div>
          <div class="detail-row full">
            <span class="detail-label">Details:</span>
            <pre class="detail-value code">{{ selectedLog.details }}</pre>
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
  display: flex;
  gap: 24px;
}

.stat-card {
  flex: 1;
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

.log-level-error .level-badge {
  background-color: var(--status-error-bg);
  color: var(--status-error);
}

.log-level-warning .level-badge {
  background-color: #FFF3E0;
  color: var(--status-warning);
}

.log-level-info .level-badge {
  background-color: #E3F2FD;
  color: var(--status-info);
}

.log-level-debug .level-badge {
  background-color: var(--accent-light);
  color: var(--status-success);
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
</style>
