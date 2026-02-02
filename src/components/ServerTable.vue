<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Filter } from 'lucide-vue-next'
import type { Server } from '@/types'
import { fetchServers } from '@/mock/api'

const servers = ref<Server[]>([])
const loading = ref(false)

onMounted(async () => {
  loading.value = true
  const response = await fetchServers()
  if (response.success && response.data) {
    servers.value = response.data
  }
  loading.value = false
})

const getStatusClass = (status: Server['status']) => {
  const classes = {
    online: 'text-positive',
    warning: 'text-warning',
    offline: 'text-negative'
  }
  return classes[status]
}

const getIndicatorClass = (status: Server['status']) => {
  const classes = {
    online: 'dot-positive',
    warning: 'dot-warning',
    offline: 'dot-negative'
  }
  return classes[status]
}
</script>

<template>
  <div class="table-section">
    <div class="section-header">
      <div class="section-title-group">
        <div class="section-category">服务器基础设施</div>
        <h2 class="section-title">服务器状态</h2>
      </div>
      <button class="btn-filter">
        <Filter :size="14" />
        <span>筛选</span>
      </button>
    </div>

    <div v-if="loading" class="loading">加载中...</div>
    <div v-else class="table-container">
      <!-- Table Header -->
      <div class="table-header-row">
        <div class="th-server">服务器</div>
        <div class="th-status">状态</div>
        <div class="th-uptime">运行时间</div>
        <div class="th-load">负载</div>
        <div class="th-actions">操作</div>
      </div>

      <!-- Table Rows -->
      <div v-for="server in servers" :key="server.id" class="table-row">
        <div class="row-indicator" :class="getIndicatorClass(server.status)"></div>
        <div class="row-content">
          <div class="cell-server">
            <div class="server-name">{{ server.name }}</div>
            <div class="server-ip">{{ server.ip }}</div>
          </div>
          <div class="cell-status" :class="getStatusClass(server.status)">
            {{ server.status.toUpperCase() }}
          </div>
          <div class="cell-uptime">{{ server.uptime }}</div>
          <div class="cell-load">{{ server.load.map(l => l.toFixed(2)).join(' ') }}</div>
          <div class="cell-actions">
            <button class="action-btn">SSH</button>
            <button class="action-btn">LOGS</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.table-section {
  flex: 1;
  background-color: var(--bg-white);
  border: 1px solid var(--border-light);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-xl);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-base);
  box-shadow: var(--shadow-card);
  overflow: hidden;
  min-width: 0;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-shrink: 0;
}

.section-title-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}

.section-category {
  font-size: 9px;
  font-weight: 600;
  color: var(--text-light);
  letter-spacing: 1px;
  text-transform: uppercase;
  font-family: var(--font-family);
}

.section-title {
  font-size: var(--font-size-title-3);
  font-weight: 600;
  color: var(--text-main);
  font-family: var(--font-family);
}

.btn-filter {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 14px;
  background: transparent;
  border: 1px solid var(--border-light);
  border-radius: var(--border-radius);
  font-size: var(--font-size-caption-2);
  font-weight: 500;
  color: var(--text-gray);
  cursor: pointer;
  font-family: var(--font-family);
  flex-shrink: 0;
  white-space: nowrap;
}

.btn-filter:hover {
  border-color: var(--primary-green);
  color: var(--primary-green);
}

.loading {
  padding: var(--spacing-xl);
  text-align: center;
  color: var(--text-gray);
}

.table-container {
  display: flex;
  flex-direction: column;
  gap: 0;
  overflow: hidden;
  min-width: 0;
}

.table-header-row {
  display: flex;
  padding: 12px var(--spacing-base);
  background-color: var(--bg-elevated);
  border-radius: var(--border-radius);
  flex-shrink: 0;
  min-width: 0;
}

.th-server {
  flex: 0 0 180px;
  font-size: 9px;
  font-weight: 700;
  color: var(--text-light);
  letter-spacing: 1px;
  font-family: var(--font-family);
  min-width: 0;
}

.th-status {
  flex: 0 0 80px;
  font-size: 9px;
  font-weight: 700;
  color: var(--text-light);
  letter-spacing: 1px;
  font-family: var(--font-family);
}

.th-uptime {
  flex: 0 0 100px;
  font-size: 9px;
  font-weight: 700;
  color: var(--text-light);
  letter-spacing: 1px;
  font-family: var(--font-family);
}

.th-load {
  flex: 1;
  font-size: 9px;
  font-weight: 700;
  color: var(--text-light);
  letter-spacing: 1px;
  font-family: var(--font-family);
  min-width: 80px;
}

.th-actions {
  flex: 0 0 auto;
  font-size: 9px;
  font-weight: 700;
  color: var(--text-light);
  letter-spacing: 1px;
  font-family: var(--font-family);
}

.table-row {
  display: flex;
  padding: 14px var(--spacing-base);
  border-top: 1px solid var(--border-light);
  flex-shrink: 0;
  min-width: 0;
}

.row-indicator {
  width: 3px;
  height: auto;
  border-radius: var(--border-radius-sm);
  margin-right: var(--spacing-base);
  flex-shrink: 0;
}

.row-content {
  flex: 1;
  display: flex;
  align-items: center;
  min-width: 0;
  gap: var(--spacing-base);
}

.cell-server {
  flex: 0 0 180px;
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.server-name {
  font-size: var(--font-size-subhead);
  font-weight: 600;
  color: var(--text-main);
  font-family: var(--font-family);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.server-ip {
  font-size: var(--font-size-caption-2);
  color: var(--text-gray);
  font-family: var(--font-family);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.cell-status {
  flex: 0 0 80px;
  font-size: var(--font-size-caption-1);
  font-weight: 600;
  font-family: var(--font-family);
}

.cell-uptime {
  flex: 0 0 100px;
  font-size: var(--font-size-caption-1);
  font-weight: 600;
  font-family: var(--font-family);
  color: var(--text-main);
  white-space: nowrap;
}

.cell-load {
  flex: 1;
  font-size: var(--font-size-caption-1);
  font-weight: 600;
  font-family: var(--font-family);
  color: var(--text-main);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  min-width: 0;
}

.cell-actions {
  flex: 0 0 auto;
  display: flex;
  gap: 6px;
}

.action-btn {
  padding: 6px 10px;
  background: transparent;
  border: 1px solid var(--border-light);
  border-radius: var(--border-radius);
  font-size: 9px;
  font-weight: 600;
  color: var(--text-gray);
  cursor: pointer;
  font-family: var(--font-family);
  letter-spacing: 1px;
  white-space: nowrap;
}

.action-btn:hover {
  border-color: var(--primary-green);
  color: var(--primary-green);
}

.dot-positive {
  background-color: var(--status-success);
}

.dot-warning {
  background-color: var(--status-warning);
}

.dot-negative {
  background-color: var(--accent-warm-red);
}
</style>
