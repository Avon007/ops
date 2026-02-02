<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import {
  Search,
  Filter,
  Bell,
  AlertTriangle,
  AlertCircle,
  Info,
  CheckCircle,
  Clock,
  ChevronLeft,
  ChevronRight,
  X,
  Check,
  ExternalLink
} from 'lucide-vue-next'

const router = useRouter()

// Filter options
const alertLevels = ref(['All', 'Critical', 'High', 'Medium', 'Low'])
const selectedLevel = ref('All')
const searchQuery = ref('')
const selectedStatus = ref('All') // All, Active, Resolved

// Mock alert data
const alerts = ref([
  {
    id: 1,
    timestamp: '2026-01-29 14:32:15',
    level: 'critical',
    service: 'api-service',
    title: 'Database Connection Failed',
    message: 'Unable to establish connection to primary database server',
    source: 'app-server-01',
    status: 'active',
    acknowledged: false,
    affectedUsers: 1250
  },
  {
    id: 2,
    timestamp: '2026-01-29 14:28:42',
    level: 'high',
    service: 'payment-gateway',
    title: 'Payment Processing Delay',
    message: 'Payment transactions taking longer than 5 seconds',
    source: 'payment-worker-02',
    status: 'active',
    acknowledged: true,
    affectedUsers: 45
  },
  {
    id: 3,
    timestamp: '2026-01-29 14:25:18',
    level: 'medium',
    service: 'cache-service',
    title: 'Cache Memory High',
    message: 'Redis memory usage at 85%',
    source: 'redis-01',
    status: 'active',
    acknowledged: false,
    affectedUsers: 0
  },
  {
    id: 4,
    timestamp: '2026-01-29 14:20:33',
    level: 'low',
    service: 'background-worker',
    title: 'Job Queue Backlog',
    message: 'Background job queue has 150 pending jobs',
    source: 'worker-03',
    status: 'active',
    acknowledged: true,
    affectedUsers: 0
  },
  {
    id: 5,
    timestamp: '2026-01-29 14:15:21',
    level: 'critical',
    service: 'auth-service',
    title: 'Authentication Failure Rate',
    message: 'Authentication failure rate exceeds 10%',
    source: 'auth-01',
    status: 'resolved',
    acknowledged: true,
    affectedUsers: 89
  },
  {
    id: 6,
    timestamp: '2026-01-29 14:10:05',
    level: 'high',
    service: 'frontend-v2',
    title: 'High Response Time',
    message: 'API response time > 2s for /api/users endpoint',
    source: 'cdn-node-03',
    status: 'resolved',
    acknowledged: true,
    affectedUsers: 320
  },
  {
    id: 7,
    timestamp: '2026-01-29 14:05:18',
    level: 'medium',
    service: 'email-service',
    title: 'Email Delivery Delayed',
    message: 'Email queue processing delayed by 2 minutes',
    source: 'email-worker-01',
    status: 'active',
    acknowledged: false,
    affectedUsers: 12
  },
  {
    id: 8,
    timestamp: '2026-01-29 14:00:12',
    level: 'low',
    service: 'monitoring-service',
    title: 'Disk Space Warning',
    message: 'Server disk usage at 75%',
    source: 'app-server-02',
    status: 'active',
    acknowledged: false,
    affectedUsers: 0
  }
])

const selectedAlert = ref<typeof alerts.value[0] | null>(null)

// Computed
const filteredAlerts = computed(() => {
  return alerts.value.filter(alert => {
    const matchesLevel = selectedLevel.value === 'All' || alert.level === selectedLevel.value.toLowerCase()
    const matchesStatus = selectedStatus.value === 'All' || alert.status === selectedStatus.value.toLowerCase()
    const matchesSearch = searchQuery.value === '' ||
      alert.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      alert.service.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      alert.message.toLowerCase().includes(searchQuery.value.toLowerCase())
    return matchesLevel && matchesStatus && matchesSearch
  })
})

const stats = computed(() => {
  return {
    total: alerts.value.filter(a => a.status === 'active').length,
    critical: alerts.value.filter(a => a.level === 'critical' && a.status === 'active').length,
    high: alerts.value.filter(a => a.level === 'high' && a.status === 'active').length,
    resolved: alerts.value.filter(a => a.status === 'resolved').length
  }
})

// Methods
const goToDashboard = () => {
  router.push('/')
}

const getLevelIcon = (level: string) => {
  switch (level) {
    case 'critical':
      return AlertCircle
    case 'high':
      return AlertTriangle
    case 'medium':
      return Bell
    case 'low':
      return Info
    default:
      return Bell
  }
}

const getLevelClass = (level: string) => {
  return `alert-level-${level}`
}

const acknowledgeAlert = (id: number) => {
  const alert = alerts.value.find(a => a.id === id)
  if (alert) {
    alert.acknowledged = true
  }
}

const resolveAlert = (id: number) => {
  const alert = alerts.value.find(a => a.id === id)
  if (alert) {
    alert.status = 'resolved'
  }
}

const viewAlertDetails = (alert: typeof alerts.value[0]) => {
  selectedAlert.value = alert
}

const getStatusBadgeClass = (status: string) => {
  return status === 'active' ? 'status-active' : 'status-resolved'
}
</script>

<template>
  <div class="alerts-container">
    <!-- Page Header -->
    <div class="page-header">
      <div class="header-content">
        <button class="back-button" @click="goToDashboard">
          ← 返回仪表板
        </button>
        <div class="header-title">
          <AlertTriangle :size="20" />
          <h1>告警管理</h1>
        </div>
        <p class="header-description">监控和管理系统告警及事件</p>
      </div>
      <div class="header-actions">
        <button class="action-btn" @click="() => { searchQuery = ''; selectedLevel = 'All'; selectedStatus = 'All' }">
          <Filter :size="14" />
          清除筛选
        </button>
        <button class="action-btn primary">
          <ExternalLink :size="14" />
          配置规则
        </button>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="stats-grid">
      <div class="stat-card stat-active">
        <div class="stat-header">
          <span class="stat-label">Active Alerts</span>
          <Bell :size="20" class="stat-icon" />
        </div>
        <div class="stat-value">{{ stats.total }}</div>
        <div class="stat-change">Requires attention</div>
      </div>

      <div class="stat-card stat-critical">
        <div class="stat-header">
          <span class="stat-label">Critical</span>
          <AlertCircle :size="20" class="stat-icon" />
        </div>
        <div class="stat-value">{{ stats.critical }}</div>
        <div class="stat-change">Immediate action needed</div>
      </div>

      <div class="stat-card stat-high">
        <div class="stat-header">
          <span class="stat-label">High Priority</span>
          <AlertTriangle :size="20" class="stat-icon" />
        </div>
        <div class="stat-value">{{ stats.high }}</div>
        <div class="stat-change">Urgent attention</div>
      </div>

      <div class="stat-card stat-resolved">
        <div class="stat-header">
          <span class="stat-label">Resolved Today</span>
          <CheckCircle :size="20" class="stat-icon" />
        </div>
        <div class="stat-value">{{ stats.resolved }}</div>
        <div class="stat-change">Successfully handled</div>
      </div>
    </div>

    <!-- Filters Bar -->
    <div class="filters-bar">
      <div class="filter-group">
        <Search :size="16" class="filter-icon" />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search alerts..."
          class="search-input"
        />
      </div>

      <div class="filter-group">
        <Filter :size="16" class="filter-icon" />
        <select v-model="selectedLevel" class="filter-select">
          <option v-for="level in alertLevels" :key="level" :value="level">
            {{ level }} Level
          </option>
        </select>
      </div>

      <div class="filter-group">
        <CheckCircle :size="16" class="filter-icon" />
        <select v-model="selectedStatus" class="filter-select">
          <option value="All">All Status</option>
          <option value="active">Active</option>
          <option value="resolved">Resolved</option>
        </select>
      </div>
    </div>

    <!-- Alerts List -->
    <div class="alerts-list">
      <div
        v-for="alert in filteredAlerts"
        :key="alert.id"
        :class="['alert-item', getLevelClass(alert.level)]"
      >
        <!-- Alert Header -->
        <div class="alert-header">
          <div class="alert-header-left">
            <component :is="getLevelIcon(alert.level)" :size="20" class="alert-icon" />
            <div class="alert-meta">
              <div class="alert-title">{{ alert.title }}</div>
              <div class="alert-service">{{ alert.service }} · {{ alert.source }}</div>
            </div>
          </div>
          <div class="alert-header-right">
            <span :class="['status-badge', getStatusBadgeClass(alert.status)]">
              {{ alert.status.charAt(0).toUpperCase() + alert.status.slice(1) }}
            </span>
            <Clock :size="14" class="time-icon" />
            <span class="alert-time">{{ alert.timestamp }}</span>
          </div>
        </div>

        <!-- Alert Body -->
        <div class="alert-body">
          <p class="alert-message">{{ alert.message }}</p>

          <!-- Affected Users -->
          <div v-if="alert.affectedUsers > 0" class="affected-users">
            <AlertTriangle :size="14" />
            <span>{{ alert.affectedUsers }} users affected</span>
          </div>
        </div>

        <!-- Alert Actions -->
        <div class="alert-actions">
          <button
            v-if="!alert.acknowledged && alert.status === 'active'"
            class="action-button acknowledge"
            @click="acknowledgeAlert(alert.id)"
          >
            <Check :size="14" />
            Acknowledge
          </button>

          <button
            v-if="alert.status === 'active'"
            class="action-button resolve"
            @click="resolveAlert(alert.id)"
          >
            <CheckCircle :size="14" />
            Resolve
          </button>

          <button
            class="action-button details"
            @click="viewAlertDetails(alert)"
          >
            <ExternalLink :size="14" />
            View Details
          </button>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="filteredAlerts.length === 0" class="empty-state">
        <CheckCircle :size="48" class="empty-icon" />
        <h3>No Alerts Found</h3>
        <p>Try adjusting your filters or search criteria</p>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="filteredAlerts.length > 0" class="pagination">
      <ChevronLeft :size="16" class="pagination-arrow" />
      <div class="page-number active">1</div>
      <div class="page-number">2</div>
      <div class="page-number">3</div>
      <ChevronRight :size="16" class="pagination-arrow" />
    </div>

    <!-- Alert Details Modal -->
    <div v-if="selectedAlert" class="modal-overlay" @click="selectedAlert = null">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h2>Alert Details</h2>
          <button class="close-btn" @click="selectedAlert = null">
            <X :size="20" />
          </button>
        </div>

        <div class="modal-body">
          <div class="detail-section">
            <div class="detail-row">
              <span class="detail-label">Level:</span>
              <span :class="['detail-value', 'level-badge', getLevelClass(selectedAlert.level)]">
                {{ selectedAlert.level.toUpperCase() }}
              </span>
            </div>

            <div class="detail-row">
              <span class="detail-label">Status:</span>
              <span :class="['detail-value', 'status-badge', getStatusBadgeClass(selectedAlert.status)]">
                {{ selectedAlert.status.charAt(0).toUpperCase() + selectedAlert.status.slice(1) }}
              </span>
            </div>

            <div class="detail-row">
              <span class="detail-label">Service:</span>
              <span class="detail-value">{{ selectedAlert.service }}</span>
            </div>

            <div class="detail-row">
              <span class="detail-label">Source:</span>
              <span class="detail-value">{{ selectedAlert.source }}</span>
            </div>

            <div class="detail-row">
              <span class="detail-label">Timestamp:</span>
              <span class="detail-value">{{ selectedAlert.timestamp }}</span>
            </div>

            <div class="detail-row">
              <span class="detail-label">Affected Users:</span>
              <span class="detail-value">{{ selectedAlert.affectedUsers }}</span>
            </div>
          </div>

          <div class="detail-section full">
            <span class="detail-label">Title:</span>
            <span class="detail-value">{{ selectedAlert.title }}</span>
          </div>

          <div class="detail-section full">
            <span class="detail-label">Message:</span>
            <p class="detail-value message">{{ selectedAlert.message }}</p>
          </div>

          <div class="modal-actions">
            <button
              v-if="selectedAlert.status === 'active'"
              class="modal-action-btn resolve"
              @click="resolveAlert(selectedAlert.id); selectedAlert = null"
            >
              <CheckCircle :size="16" />
              Resolve Alert
            </button>

            <button
              class="modal-action-btn close"
              @click="selectedAlert = null"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.alerts-container {
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
  background: #45a049;
}

/* Stats Grid */
.stats-grid {
  display: flex;
  gap: var(--spacing-2xl);
}

.stat-card {
  flex: 1;
  border: 1px solid var(--border-light);
  padding: 28px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  background-color: var(--bg-white);
  border-radius: var(--border-radius);
}

.stat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.stat-label {
  font-size: var(--font-size-caption-1);
  color: var(--text-gray);
  font-family: var(--font-family);
}

.stat-icon {
  color: var(--text-gray);
}

.stat-value {
  font-size: 36px;
  font-weight: 600;
  color: var(--text-main);
  font-family: var(--font-family);
}

.stat-change {
  font-size: var(--font-size-caption-1);
  color: var(--text-gray);
  font-family: var(--font-family);
}

.stat-critical .stat-value,
.stat-critical .stat-icon {
  color: var(--status-error);
}

.stat-high .stat-value,
.stat-high .stat-icon {
  color: var(--status-warning);
}

.stat-resolved .stat-value,
.stat-resolved .stat-icon {
  color: var(--status-success);
}

.stat-active .stat-value,
.stat-active .stat-icon {
  color: var(--text-main);
}

/* Filters Bar */
.filters-bar {
  display: flex;
  gap: var(--spacing-md);
}

.filter-group {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: 8px 16px;
  border: 1px solid var(--border-light);
  background: var(--bg-white);
  border-radius: var(--border-radius);
}

.filter-icon {
  color: var(--text-gray);
}

.search-input {
  border: none;
  outline: none;
  font-size: var(--font-size-subhead);
  font-family: var(--font-family);
  width: 200px;
  color: var(--text-main);
}

.filter-select {
  border: none;
  outline: none;
  font-size: var(--font-size-subhead);
  font-family: var(--font-family);
  background: transparent;
  cursor: pointer;
  color: var(--text-main);
}

/* Alerts List */
.alerts-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.alert-item {
  border: 1px solid var(--border-light);
  border-left: 4px solid;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  background: var(--bg-white);
  border-radius: var(--border-radius-lg);
}

.alert-item:hover {
  background: var(--bg-elevated);
}

.alert-level-critical {
  border-left-color: var(--status-error);
}

.alert-level-high {
  border-left-color: var(--status-warning);
}

.alert-level-medium {
  border-left-color: var(--status-info);
}

.alert-level-low {
  border-left-color: var(--text-light);
}

/* Alert Header */
.alert-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.alert-header-left {
  display: flex;
  gap: 12px;
  align-items: flex-start;
}

.alert-icon {
  flex-shrink: 0;
}

.alert-level-critical .alert-icon {
  color: var(--status-error);
}

.alert-level-high .alert-icon {
  color: var(--status-warning);
}

.alert-level-medium .alert-icon {
  color: var(--status-info);
}

.alert-level-low .alert-icon {
  color: var(--text-light);
}

.alert-meta {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.alert-title {
  font-size: var(--font-size-title-3);
  font-weight: 600;
  color: var(--text-main);
  font-family: var(--font-family);
}

.alert-service {
  font-size: var(--font-size-caption-1);
  color: var(--text-gray);
  font-family: var(--font-family);
}

.alert-header-right {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.status-badge {
  padding: 4px 12px;
  font-size: var(--font-size-caption-2);
  font-weight: 500;
  border-radius: var(100px);
  font-family: var(--font-family);
}

.status-active {
  background: #FFF3E0;
  color: var(--status-warning);
}

.status-resolved {
  background: var(--accent-light);
  color: var(--status-success);
}

.time-icon {
  color: var(--text-gray);
}

.alert-time {
  font-size: var(--font-size-caption-1);
  color: var(--text-gray);
  font-family: 'Courier New', monospace;
}

/* Alert Body */
.alert-body {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.alert-message {
  font-size: var(--font-size-body);
  color: var(--text-main);
  margin: 0;
  font-family: var(--font-family);
  line-height: 1.5;
}

.affected-users {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  background: #FFF3E0;
  border-radius: var(--border-radius-sm);
  font-size: var(--font-size-caption-1);
  color: #E65100;
  font-weight: 600;
  width: fit-content;
  font-family: var(--font-family);
}

/* Alert Actions */
.alert-actions {
  display: flex;
  gap: var(--spacing-sm);
}

.action-button {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border: 1px solid var(--border-light);
  background: var(--bg-white);
  font-size: var(--font-size-caption-1);
  font-weight: 500;
  cursor: pointer;
  font-family: var(--font-family);
  border-radius: var(--border-radius);
  transition: all 0.2s ease;
}

.action-button:hover {
  border-color: var(--primary-green);
  color: var(--primary-green);
}

.action-button.acknowledge {
  color: var(--status-info);
}

.action-button.acknowledge:hover {
  border-color: var(--status-info);
  background: #E3F2FD;
}

.action-button.resolve {
  color: var(--status-success);
}

.action-button.resolve:hover {
  border-color: var(--status-success);
  background: var(--accent-light);
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
  color: var(--status-success);
}

.empty-state h3 {
  margin: 0;
  font-size: var(--font-size-title-3);
  font-weight: 600;
  color: var(--text-main);
  font-family: var(--font-family);
}

.empty-state p {
  margin: 0;
  font-size: var(--font-size-body);
  color: var(--text-gray);
  font-family: var(--font-family);
}

/* Pagination */
.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
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
  border-radius: var(--border-radius-sm);
  transition: all 0.2s ease;
}

.page-number:hover {
  background-color: var(--bg-elevated);
}

.page-number.active {
  background-color: var(--text-main);
  color: var(--bg-white);
  border-color: var(--text-main);
}

.pagination-arrow {
  color: var(--text-gray);
  cursor: pointer;
  transition: color 0.2s ease;
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
  border-radius: var(--border-radius-lg);
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
  cursor: pointer;
  color: var(--text-gray);
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s ease;
}

.close-btn:hover {
  color: var(--text-main);
}

.modal-body {
  padding: var(--spacing-2xl);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2xl);
}

.detail-section {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--spacing-lg);
}

.detail-section.full {
  grid-template-columns: 1fr;
}

.detail-row {
  display: flex;
  gap: var(--spacing-sm);
  align-items: center;
}

.detail-label {
  font-weight: 500;
  color: var(--text-gray);
  font-size: var(--font-size-subhead);
  min-width: 80px;
  font-family: var(--font-family);
}

.detail-value {
  color: var(--text-main);
  font-size: var(--font-size-subhead);
  font-family: var(--font-family);
}

.detail-value.message {
  background: var(--bg-elevated);
  padding: var(--spacing-md);
  border-radius: var(--border-radius-sm);
  line-height: 1.6;
  margin: 0;
}

.level-badge {
  padding: 4px 12px;
  font-size: var(--font-size-caption-2);
  font-weight: 500;
  border-radius: var(100px);
  font-family: var(--font-family);
}

.alert-level-critical .level-badge {
  background: var(--status-error-bg);
  color: var(--status-error);
}

.alert-level-high .level-badge {
  background: #FFF3E0;
  color: var(--status-warning);
}

.alert-level-medium .level-badge {
  background: #E3F2FD;
  color: var(--status-info);
}

.alert-level-low .level-badge {
  background: var(--bg-muted);
  color: var(--text-light);
}

.modal-actions {
  display: flex;
  gap: var(--spacing-md);
  justify-content: flex-end;
}

.modal-action-btn {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: 10px 20px;
  border: 1px solid var(--border-light);
  background: var(--bg-white);
  font-size: var(--font-size-subhead);
  font-weight: 500;
  cursor: pointer;
  font-family: var(--font-family);
  border-radius: var(--border-radius);
  transition: all 0.2s ease;
}

.modal-action-btn.resolve {
  background: var(--status-success);
  color: var(--bg-white);
  border-color: var(--status-success);
}

.modal-action-btn.resolve:hover {
  background: #45a049;
  border-color: #45a049;
}

.modal-action-btn.close:hover {
  border-color: var(--primary-green);
}
</style>
