<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Eye, RefreshCw, RotateCcw, ChevronLeft, ChevronRight, Rocket } from 'lucide-vue-next'

const router = useRouter()

// Metrics data
const metrics = ref([
  {
    label: 'Total Deployments',
    value: '1,284',
    change: '+12% this month',
    trend: 'up'
  },
  {
    label: 'Active Deployments',
    value: '47',
    status: 'All systems operational'
  },
  {
    label: 'Success Rate',
    value: '98.5%',
    change: '+2.3% improvement',
    trend: 'up'
  },
  {
    label: 'Failed Deployments',
    value: '3',
    change: '-5 from last week',
    trend: 'down'
  }
])

// Deployment data
const deployments = ref([
  {
    id: 1,
    name: 'frontend-v2.4.1',
    environment: 'Production',
    status: 'success',
    date: 'Jan 29, 2026',
    duration: '2m 34s'
  },
  {
    id: 2,
    name: 'api-service-v3.1.0',
    environment: 'Staging',
    status: 'deploying',
    date: 'Jan 29, 2026',
    duration: '1m 12s'
  },
  {
    id: 3,
    name: 'backend-v1.8.5',
    environment: 'Production',
    status: 'success',
    date: 'Jan 28, 2026',
    duration: '3m 45s'
  },
  {
    id: 4,
    name: 'mobile-app-v2.0.3',
    environment: 'Development',
    status: 'failed',
    date: 'Jan 28, 2026',
    duration: '0m 45s'
  },
  {
    id: 5,
    name: 'auth-service-v4.2.1',
    environment: 'Production',
    status: 'success',
    date: 'Jan 27, 2026',
    duration: '1m 56s'
  }
])

const currentPage = ref(1)
const totalPages = 3

const goToDashboard = () => {
  router.push('/')
}

const handleNewDeployment = () => {
  console.log('Creating new deployment...')
}

const viewDeployment = (id: number) => {
  console.log('Viewing deployment:', id)
}

const retryDeployment = (id: number) => {
  console.log('Retrying deployment:', id)
}

const rollbackDeployment = (id: number) => {
  console.log('Rolling back deployment:', id)
}

const getStatusClass = (status: string) => {
  switch (status) {
    case 'success':
      return 'status-success'
    case 'deploying':
      return 'status-deploying'
    case 'failed':
      return 'status-failed'
    default:
      return ''
  }
}

const getStatusText = (status: string) => {
  switch (status) {
    case 'success':
      return 'Success'
    case 'deploying':
      return 'Deploying'
    case 'failed':
      return 'Failed'
    default:
      return status
  }
}
</script>

<template>
  <div class="deployments-container">
    <!-- Page Header -->
    <div class="page-header">
      <div class="header-content">
        <button class="back-button" @click="goToDashboard">
          ← 返回仪表板
        </button>
        <div class="header-title">
          <Rocket :size="20" />
          <h1>部署管理</h1>
        </div>
        <p class="header-description">管理和监控应用程序部署状态</p>
      </div>
      <div class="header-actions">
        <button class="btn-new-deployment" @click="handleNewDeployment">
          新建部署
        </button>
      </div>
    </div>

    <!-- Metrics Grid -->
    <div class="metrics-grid">
      <div v-for="(metric, index) in metrics" :key="index" class="metric-card">
        <div class="metric-header">
          <span class="metric-label">{{ metric.label }}</span>
        </div>
        <div class="metric-value">{{ metric.value }}</div>
        <div class="metric-change" v-if="metric.change">
          <RefreshCw :size="14" />
          <span>{{ metric.change }}</span>
        </div>
        <div class="metric-status" v-else-if="metric.status">
          <div class="status-dot"></div>
          <span>{{ metric.status }}</span>
        </div>
      </div>
    </div>

    <!-- Deployments Table Section -->
    <div class="table-section">
      <div class="table-header">
        <h2 class="table-title">Recent Deployments</h2>
        <div class="table-filters">
          <button class="filter-btn">
            Filter
          </button>
          <button class="search-btn">
            Search
          </button>
        </div>
      </div>

      <div class="table-container">
        <table class="deployments-table">
          <thead>
            <tr>
              <th>Deployment</th>
              <th>Environment</th>
              <th>Status</th>
              <th>Date</th>
              <th>Duration</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="deployment in deployments" :key="deployment.id">
              <td class="deployment-name">{{ deployment.name }}</td>
              <td>{{ deployment.environment }}</td>
              <td>
                <span :class="['status-badge', getStatusClass(deployment.status)]">
                  <span class="status-dot"></span>
                  {{ getStatusText(deployment.status) }}
                </span>
              </td>
              <td>{{ deployment.date }}</td>
              <td>{{ deployment.duration }}</td>
              <td class="actions-cell">
                <Eye :size="16" class="action-icon" @click="viewDeployment(deployment.id)" />
                <RefreshCw
                  v-if="deployment.status === 'failed'"
                  :size="16"
                  class="action-icon action-retry"
                  @click="retryDeployment(deployment.id)"
                />
                <RotateCcw
                  v-if="deployment.status === 'success'"
                  :size="16"
                  class="action-icon"
                  @click="rollbackDeployment(deployment.id)"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="pagination">
        <ChevronLeft :size="16" class="pagination-arrow" />
        <div :class="['page-number', { active: currentPage === 1 }]">1</div>
        <div :class="['page-number', { active: currentPage === 2 }]">2</div>
        <div :class="['page-number', { active: currentPage === 3 }]">3</div>
        <ChevronRight :size="16" class="pagination-arrow" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.deployments-container {
  width: 100%;
  max-width: 1600px;
  margin: 0 auto;
  padding: var(--spacing-2xl) var(--spacing-2xl);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xl);
  min-height: 100vh;
  background-color: var(--bg-white);
}

/* Page Header */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: var(--spacing-lg);
  flex-wrap: wrap;
}

.header-content {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  flex: 1;
  min-width: 280px;
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
  font-size: 28px;
  font-weight: 600;
  margin: 0;
  font-family: var(--font-family);
  line-height: 1.2;
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

.btn-new-deployment {
  padding: var(--spacing-md) var(--spacing-lg);
  background-color: var(--primary-green);
  border: none;
  border-radius: var(--border-radius);
  color: var(--bg-white);
  font-size: var(--font-size-caption-2);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: var(--font-family);
}

.btn-new-deployment:hover {
  background-color: #45a049;
  transform: translateY(-1px);
}

/* Metrics Grid */
.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: var(--spacing-lg);
}

.metric-card {
  border: 1px solid var(--border-light);
  padding: var(--spacing-xl);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  background-color: var(--bg-white);
  border-radius: var(--border-radius);
  transition: all 0.2s ease;
}

.metric-card:hover {
  box-shadow: var(--shadow-elevated);
  transform: translateY(-2px);
}

.metric-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.metric-label {
  font-size: var(--font-size-caption-1);
  color: var(--text-gray);
  font-family: var(--font-family);
}

.metric-value {
  font-size: 32px;
  font-weight: 600;
  color: var(--text-main);
  letter-spacing: -0.5px;
  font-family: var(--font-family);
  line-height: 1.1;
}

.metric-change {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: var(--font-size-caption-1);
  color: var(--text-gray);
  font-family: var(--font-family);
}

.metric-status {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: var(--font-size-caption-1);
  color: var(--text-gray);
  font-family: var(--font-family);
}

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: var(--status-success);
}

/* Table Section */
.table-section {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2xl);
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--spacing-md);
  flex-wrap: wrap;
}

.table-title {
  font-size: var(--font-size-title-3);
  font-weight: 600;
  color: var(--text-main);
  margin: 0;
  font-family: var(--font-family);
}

.table-filters {
  display: flex;
  gap: 12px;
}

.filter-btn,
.search-btn {
  padding: 8px 16px;
  border: 1px solid var(--border-light);
  background: var(--bg-white);
  color: var(--text-main);
  font-size: var(--font-size-caption-1);
  font-weight: 500;
  cursor: pointer;
  font-family: var(--font-family);
  border-radius: var(--border-radius);
  transition: all 0.2s ease;
}

.filter-btn:hover,
.search-btn:hover {
  background-color: var(--bg-elevated);
  border-color: var(--primary-green);
}

/* Table */
.table-container {
  width: 100%;
  border: 1px solid var(--border-light);
  border-radius: var(--border-radius);
  overflow-x: auto;
  overflow-y: visible;
}

.deployments-table {
  width: 100%;
  min-width: 800px;
  border-collapse: collapse;
}

.deployments-table thead {
  background-color: var(--bg-elevated);
}

.deployments-table th {
  padding: var(--spacing-md) var(--spacing-lg);
  text-align: left;
  font-size: var(--font-size-caption-2);
  font-weight: 500;
  color: var(--text-gray);
  font-family: var(--font-family);
  white-space: nowrap;
}

.deployments-table td {
  padding: var(--spacing-lg);
  border-top: 1px solid var(--border-light);
  font-size: var(--font-size-subhead);
  color: var(--text-main);
  font-family: var(--font-family);
}

.deployment-name {
  font-weight: 500;
}

/* Status Badge */
.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  font-size: var(--font-size-caption-2);
  font-weight: 500;
  font-family: var(--font-family);
  border-radius: var(--border-radius-sm);
}

.status-success {
  background-color: var(--status-success);
  color: var(--bg-white);
}

.status-deploying {
  background-color: var(--text-main);
  color: var(--bg-white);
}

.status-failed {
  background-color: var(--status-error);
  color: var(--bg-white);
}

/* Actions */
.actions-cell {
  display: flex;
  gap: 8px;
  justify-content: center;
}

.action-icon {
  cursor: pointer;
  color: var(--text-gray);
  transition: color 0.2s ease;
}

.action-icon:hover {
  color: var(--text-main);
}

.action-retry {
  color: var(--status-error);
}

.action-retry:hover {
  color: var(--text-main);
}

/* Pagination */
.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
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
  color: var(--text-main);
  font-family: var(--font-family);
  cursor: pointer;
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

/* Responsive Design */
@media (max-width: 1200px) {
  .deployments-container {
    width: 95%;
  }

  .metrics-grid {
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: var(--spacing-md);
  }
}

@media (max-width: 768px) {
  .deployments-container {
    width: 100%;
    padding: var(--spacing-lg) var(--spacing-md);
  }

  .page-header {
    flex-direction: column;
    align-items: stretch;
  }

  .header-actions {
    width: 100%;
  }

  .btn-new-deployment {
    width: 100%;
    justify-content: center;
  }

  .header-title h1 {
    font-size: 24px;
  }

  .metrics-grid {
    grid-template-columns: 1fr;
    gap: var(--spacing-md);
  }

  .metric-card {
    padding: var(--spacing-lg);
  }

  .metric-value {
    font-size: 28px;
  }

  .table-header {
    flex-direction: column;
    align-items: stretch;
  }

  .table-filters {
    width: 100%;
    justify-content: stretch;
  }

  .filter-btn,
  .search-btn {
    flex: 1;
  }

  .deployments-table th,
  .deployments-table td {
    padding: var(--spacing-md);
  }
}

@media (max-width: 480px) {
  .header-title h1 {
    font-size: 20px;
  }

  .metric-value {
    font-size: 24px;
  }

  .deployment-name {
    max-width: 150px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>
