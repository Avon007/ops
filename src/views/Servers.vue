<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import {
  Search,
  Filter,
  Server,
  Activity,
  Cpu,
  HardDrive,
  MemoryStick,
  RefreshCw,
  Power,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Plus,
  X
} from 'lucide-vue-next'
import { useServersStore } from '@/stores/servers'
import { useServerFilter, useServerHelpers } from '@/composables'
import type { Server as ServerType } from '@/stores/servers'

const router = useRouter()
const serversStore = useServersStore()

// Composables
const {
  selectedStatus,
  selectedEnvironment,
  searchQuery,
  filteredServers,
  hasActiveFilters,
  clearFilters
} = useServerFilter(() => serversStore.servers)

const {
  getStatusIcon,
  getStatusClass,
  getResourceClass
} = useServerHelpers()

// Local State
const selectedServer = ref<ServerType | null>(null)

// Computed from Store
const stats = serversStore.stats

// Methods
const goToDashboard = () => {
  router.push('/')
}

const handleClearFilters = () => {
  clearFilters()
}

const restartServer = async (id: number) => {
  const server = serversStore.getServerById(id)
  if (server && confirm(`Are you sure you want to restart ${server.name}?`)) {
    await serversStore.restartServer(id)
  }
}

const stopServer = async (id: number) => {
  const server = serversStore.getServerById(id)
  if (server && confirm(`Are you sure you want to stop ${server.name}?`)) {
    await serversStore.stopServer(id)
  }
}

const refreshServer = (id: number) => {
  serversStore.refreshServer(id)
}

const viewServerDetails = (server: ServerType) => {
  serversStore.setSelectedServer(server)
  selectedServer.value = server
}

const closeModal = () => {
  selectedServer.value = null
  serversStore.setSelectedServer(null)
}
</script>

<template>
  <div class="servers-container">
    <!-- Page Header -->
    <div class="page-header">
      <div class="header-content">
        <button class="back-button" @click="goToDashboard">
          ← 返回仪表板
        </button>
        <div class="header-title">
          <Server :size="20" />
          <h1>服务器管理</h1>
        </div>
        <p class="header-description">监控和管理服务器基础设施</p>
      </div>
      <div class="header-actions">
        <button class="action-btn" @click="handleClearFilters" :disabled="!hasActiveFilters">
          <Filter :size="14" />
          清除筛选
        </button>
        <button class="action-btn primary">
          <Plus :size="14" />
          添加服务器
        </button>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="stats-grid">
      <div class="stat-card stat-total">
        <div class="stat-header">
          <span class="stat-label">Total Servers</span>
          <Server :size="20" class="stat-icon" />
        </div>
        <div class="stat-value">{{ stats.total }}</div>
        <div class="stat-change">All environments</div>
      </div>

      <div class="stat-card stat-online">
        <div class="stat-header">
          <span class="stat-label">Online</span>
          <CheckCircle :size="20" class="stat-icon" />
        </div>
        <div class="stat-value">{{ stats.online }}</div>
        <div class="stat-change">Operational</div>
      </div>

      <div class="stat-card stat-warning">
        <div class="stat-header">
          <span class="stat-label">Warning</span>
          <AlertTriangle :size="20" class="stat-icon" />
        </div>
        <div class="stat-value">{{ stats.warning }}</div>
        <div class="stat-change">Needs attention</div>
      </div>

      <div class="stat-card stat-offline">
        <div class="stat-header">
          <span class="stat-label">Offline</span>
          <XCircle :size="20" class="stat-icon" />
        </div>
        <div class="stat-value">{{ stats.offline }}</div>
        <div class="stat-change">Unavailable</div>
      </div>
    </div>

    <!-- Filters Bar -->
    <div class="filters-bar">
      <div class="filter-group">
        <Search :size="16" class="filter-icon" />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search servers..."
          class="search-input"
        />
      </div>

      <div class="filter-group">
        <Activity :size="16" class="filter-icon" />
        <select v-model="selectedStatus" class="filter-select">
          <option value="All">All Status</option>
          <option value="online">Online</option>
          <option value="warning">Warning</option>
          <option value="offline">Offline</option>
        </select>
      </div>

      <div class="filter-group">
        <Server :size="16" class="filter-icon" />
        <select v-model="selectedEnvironment" class="filter-select">
          <option value="All">All Environments</option>
          <option value="Production">Production</option>
          <option value="Staging">Staging</option>
          <option value="Development">Development</option>
        </select>
      </div>
    </div>

    <!-- Servers Grid -->
    <div class="servers-grid">
      <div
        v-for="server in filteredServers"
        :key="server.id"
        :class="['server-card', getStatusClass(server.status)]"
      >
        <!-- Server Header -->
        <div class="server-header">
          <div class="server-header-left">
            <component :is="getStatusIcon(server.status)" :size="20" class="server-status-icon" />
            <div class="server-info">
              <div class="server-name">{{ server.name }}</div>
              <div class="server-ip">{{ server.ip }}</div>
            </div>
          </div>
          <div class="server-environment">
            {{ server.environment }}
          </div>
        </div>

        <!-- Server Metrics -->
        <div class="server-metrics">
          <!-- CPU -->
          <div class="metric">
            <div class="metric-header">
              <Cpu :size="14" class="metric-icon" />
              <span class="metric-label">CPU</span>
              <span :class="['metric-value', getResourceClass(server.cpu)]">{{ server.cpu }}%</span>
            </div>
            <div class="metric-bar">
              <div
                :class="['metric-fill', getResourceClass(server.cpu)]"
                :style="{ width: server.status === 'offline' ? '0%' : `${server.cpu}%` }"
              ></div>
            </div>
          </div>

          <!-- Memory -->
          <div class="metric">
            <div class="metric-header">
              <MemoryStick :size="14" class="metric-icon" />
              <span class="metric-label">Memory</span>
              <span :class="['metric-value', getResourceClass(server.memory)]">{{ server.memory }}%</span>
            </div>
            <div class="metric-bar">
              <div
                :class="['metric-fill', getResourceClass(server.memory)]"
                :style="{ width: server.status === 'offline' ? '0%' : `${server.memory}%` }"
              ></div>
            </div>
          </div>

          <!-- Disk -->
          <div class="metric">
            <div class="metric-header">
              <HardDrive :size="14" class="metric-icon" />
              <span class="metric-label">Disk</span>
              <span :class="['metric-value', getResourceClass(server.disk)]">{{ server.disk }}%</span>
            </div>
            <div class="metric-bar">
              <div
                :class="['metric-fill', getResourceClass(server.disk)]"
                :style="{ width: `${server.disk}%` }"
              ></div>
            </div>
          </div>
        </div>

        <!-- Server Details -->
        <div class="server-details">
          <div class="detail-item">
            <Activity :size="14" class="detail-icon" />
            <span class="detail-label">Uptime:</span>
            <span class="detail-value">{{ server.uptime }}</span>
          </div>
          <div class="detail-item">
            <Server :size="14" class="detail-icon" />
            <span class="detail-label">Region:</span>
            <span class="detail-value">{{ server.region }}</span>
          </div>
        </div>

        <!-- Services Tags -->
        <div class="services-tags">
          <div
            v-for="service in server.services"
            :key="service"
            class="service-tag"
          >
            {{ service }}
          </div>
        </div>

        <!-- Server Actions -->
        <div class="server-actions">
          <button
            class="action-icon-btn"
            @click="refreshServer(server.id)"
            title="Refresh"
          >
            <RefreshCw :size="14" />
          </button>

          <button
            v-if="server.status !== 'offline'"
            class="action-icon-btn"
            @click="restartServer(server.id)"
            title="Restart"
          >
            <RotateCcw :size="14" />
          </button>

          <button
            class="action-icon-btn"
            :class="{ 'danger': server.status !== 'offline' }"
            @click="stopServer(server.id)"
            :title="server.status === 'offline' ? 'Start' : 'Stop'"
          >
            <Power :size="14" />
          </button>

          <button
            class="action-btn-view"
            @click="viewServerDetails(server)"
          >
            <ExternalLink :size="14" />
            Details
          </button>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="filteredServers.length === 0" class="empty-state">
        <Server :size="48" class="empty-icon" />
        <h3>No Servers Found</h3>
        <p>Try adjusting your filters or search criteria</p>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="filteredServers.length > 0" class="pagination">
      <ChevronLeft :size="16" class="pagination-arrow" />
      <div class="page-number active">1</div>
      <div class="page-number">2</div>
      <div class="page-number">3</div>
      <ChevronRight :size="16" class="pagination-arrow" />
    </div>

    <!-- Server Details Modal -->
    <div v-if="selectedServer" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h2>Server Details</h2>
          <button class="close-btn" @click="closeModal">
            <X :size="20" />
          </button>
        </div>

        <div class="modal-body">
          <div class="detail-section">
            <div class="detail-row">
              <span class="detail-label">Server Name:</span>
              <span class="detail-value">{{ selectedServer.name }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">IP Address:</span>
              <span class="detail-value">{{ selectedServer.ip }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Environment:</span>
              <span class="detail-value">{{ selectedServer.environment }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Status:</span>
              <span :class="['detail-value', 'status-badge', getStatusClass(selectedServer.status)]">
                {{ selectedServer.status.charAt(0).toUpperCase() + selectedServer.status.slice(1) }}
              </span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Region:</span>
              <span class="detail-value">{{ selectedServer.region }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Uptime:</span>
              <span class="detail-value">{{ selectedServer.uptime }}</span>
            </div>
          </div>

          <div class="detail-section full">
            <span class="detail-label">Services:</span>
            <div class="services-list">
              <div
                v-for="service in selectedServer.services"
                :key="service"
                class="service-tag-large"
              >
                {{ service }}
              </div>
            </div>
          </div>

          <div class="detail-section full">
            <span class="detail-label">Last Check:</span>
            <span class="detail-value">{{ selectedServer.lastCheck }}</span>
          </div>

          <div class="modal-actions">
            <button
              class="modal-action-btn"
              @click="() => { selectedServer && refreshServer(selectedServer.id); closeModal() }"
            >
              <RefreshCw :size="16" />
              Refresh
            </button>

            <button
              v-if="selectedServer && selectedServer.status !== 'offline'"
              class="modal-action-btn warning"
              @click="() => { selectedServer && restartServer(selectedServer.id); closeModal() }"
            >
              <RotateCcw :size="16" />
              Restart Server
            </button>

            <button
              class="modal-action-btn close"
              @click="closeModal"
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
.servers-container {
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

.action-btn:hover:not(:disabled) {
  border-color: var(--primary-green);
}

.action-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
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
  gap: 16px;
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

.stat-online .stat-value,
.stat-online .stat-icon {
  color: var(--status-success);
}

.stat-warning .stat-value,
.stat-warning .stat-icon {
  color: var(--status-warning);
}

.stat-offline .stat-value,
.stat-offline .stat-icon {
  color: var(--status-error);
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

/* Servers Grid */
.servers-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 24px;
}

.server-card {
  border: 1px solid var(--border-light);
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  background: var(--bg-white);
  transition: all 0.2s ease;
}

.server-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* Server Header */
.server-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.server-header-left {
  display: flex;
  gap: 12px;
  align-items: flex-start;
}

.server-status-icon {
  flex-shrink: 0;
}

.server-status-online .server-status-icon {
  color: var(--status-success);
}

.server-status-warning .server-status-icon {
  color: var(--status-warning);
}

.server-status-offline .server-status-icon {
  color: var(--status-error);
}

.server-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.server-name {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-main);
  font-family: var(--font-family);
}

.server-ip {
  font-size: var(--font-size-caption-1);
  color: var(--text-gray);
  font-family: var(--font-family);
}

.server-environment {
  padding: 4px 12px;
  background: var(--bg-muted);
  color: var(--text-light);
  font-size: var(--font-size-caption-2);
  font-weight: 500;
  border-radius: var(100px);
  font-family: var(--font-family);
}

/* Server Metrics */
.server-metrics {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.metric {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.metric-header {
  display: flex;
  align-items: center;
  gap: 8px;
}

.metric-icon {
  color: var(--text-gray);
}

.metric-label {
  font-size: var(--font-size-caption-1);
  color: var(--text-gray);
  font-family: var(--font-family);
}

.metric-value {
  margin-left: auto;
  font-size: var(--font-size-caption-1);
  font-weight: 600;
  font-family: var(--font-family);
}

.metric-value.resource-normal {
  color: var(--status-success);
}

.metric-value.resource-warning {
  color: var(--status-warning);
}

.metric-value.resource-critical {
  color: var(--status-error);
}

.metric-bar {
  width: 100%;
  height: 6px;
  background: var(--bg-muted);
  border-radius: var(--border-radius-sm);
  overflow: hidden;
}

.metric-fill {
  height: 100%;
  border-radius: var(--border-radius-sm);
  transition: width 0.3s ease;
}

.metric-fill.resource-normal {
  background: var(--status-success);
}

.metric-fill.resource-warning {
  background: var(--status-warning);
}

.metric-fill.resource-critical {
  background: var(--status-error);
}

/* Server Details */
.server-details {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: var(--font-size-caption-1);
  font-family: var(--font-family);
}

.detail-icon {
  color: var(--text-gray);
}

.detail-label {
  color: var(--text-gray);
}

.detail-value {
  margin-left: auto;
  color: var(--text-main);
  font-weight: 500;
}

/* Services Tags */
.services-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.service-tag {
  padding: 4px 10px;
  background: var(--bg-muted);
  color: var(--text-main);
  font-size: var(--font-size-caption-2);
  font-weight: 500;
  border-radius: var(--border-radius-sm);
  font-family: var(--font-family);
}

/* Server Actions */
.server-actions {
  display: flex;
  gap: 8px;
  align-items: center;
  padding-top: 12px;
  border-top: 1px solid var(--border-light);
}

.action-icon-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: 1px solid var(--border-light);
  background: var(--bg-white);
  cursor: pointer;
  color: var(--text-gray);
  transition: all 0.2s ease;
}

.action-icon-btn:hover {
  border-color: var(--text-main);
  color: var(--text-main);
}

.action-icon-btn.danger:hover {
  border-color: var(--status-error);
  color: var(--status-error);
}

.action-btn-view {
  margin-left: auto;
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
}

.action-btn-view:hover {
  border-color: var(--status-error);
  color: var(--status-error);
}

/* Empty State */
.empty-state {
  grid-column: 1 / -1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  gap: 16px;
  text-align: center;
}

.empty-icon {
  color: var(--text-gray);
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
  cursor: pointer;
  color: var(--text-gray);
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
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
  gap: 16px;
}

.detail-section.full {
  grid-template-columns: 1fr;
}

.detail-row {
  display: flex;
  gap: 8px;
  align-items: center;
}

.detail-label {
  font-weight: 500;
  color: var(--text-gray);
  font-size: 13px;
  min-width: 100px;
  font-family: var(--font-family);
}

.detail-value {
  color: var(--text-main);
  font-size: 13px;
  font-family: var(--font-family);
}

.status-badge {
  padding: 4px 12px;
  font-size: var(--font-size-caption-2);
  font-weight: 500;
  border-radius: var(100px);
  font-family: var(--font-family);
}

.server-status-online .status-badge {
  background: var(--accent-light);
  color: var(--status-success);
}

.server-status-warning .status-badge {
  background: #FFF3E0;
  color: var(--status-warning);
}

.server-status-offline .status-badge {
  background: var(--status-error-bg);
  color: var(--status-error);
}

.services-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.service-tag-large {
  padding: 6px 12px;
  background: var(--bg-muted);
  color: var(--text-main);
  font-size: var(--font-size-caption-1);
  font-weight: 500;
  border-radius: var(--border-radius-sm);
  font-family: var(--font-family);
}

.modal-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

.modal-action-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  border: 1px solid var(--border-light);
  background: var(--bg-white);
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  font-family: var(--font-family);
}

.modal-action-btn.warning {
  background: var(--status-warning);
  color: var(--bg-white);
  border-color: var(--status-warning);
}

.modal-action-btn.warning:hover {
  background: #E65100;
  border-color: #E65100;
}

.modal-action-btn.close:hover {
  border-color: var(--text-main);
}
</style>
