<script setup lang="ts">
/**
 * Dashboard View
 * 运维监控中心主页面
 *
 * 优化内容:
 * 1. 使用 Pinia store 管理状态
 * 2. 使用 composables 提取逻辑
 * 3. 拆分为更小的子组件
 * 4. 遵循 Vue 3 Composition API 最佳实践
 */

import { computed } from 'vue'
import PageHeader from '@/components/PageHeader.vue'
import MetricCard from '@/components/MetricCard.vue'
import ActivityPanel from '@/components/ActivityPanel.vue'
import Terminal from '@/components/Terminal.vue'
import BannerAlert from '@/components/BannerAlert.vue'
import DeployModal from '@/components/DeployModal.vue'

// Composables
import { useRefresh } from '@/composables/useRefresh'
import { useDeployment } from '@/composables/useDeployment'

// Stores
import { useDashboardStore } from '@/stores/dashboard'

// Store
const dashboardStore = useDashboardStore()

// Composables
const { isRefreshing, canRefresh, handleRefresh } = useRefresh()
const {
  showDeployModal,
  deployStatus,
  deployMessage,
  isDeploying,
  openDeployModal,
  closeDeployModal,
  executeDeploy
} = useDeployment({
  onSuccess: (message) => {
    console.log('✅', message)
  },
  onError: (message) => {
    console.error('❌', message)
  }
})

// Computed
const metrics = computed(() => dashboardStore.metrics)
const bannerVisible = computed(() => dashboardStore.bannerVisible)

// Methods
const handleRefreshData = async () => {
  await handleRefresh(
    metrics.value,
    dashboardStore.activities,
    (newMetrics, newActivities) => {
      dashboardStore.updateMetrics(newMetrics)
      dashboardStore.updateActivities(newActivities)
    }
  )
}

const handleExecuteDeploy = async () => {
  await executeDeploy((activity) => {
    dashboardStore.addActivity(activity)
  })
}

const handleDismissBanner = () => {
  dashboardStore.hideBanner()
}
</script>

<template>
  <div class="dashboard-container">
    <!-- Main Content -->
    <main class="main-content">
      <!-- Page Header -->
      <page-header
        title="运维监控中心"
        subtitle="实时监控系统状态 · 自动告警响应 · 快速故障排查"
        :is-refreshing="isRefreshing"
        :can-refresh="canRefresh"
        @refresh="handleRefreshData"
        @deploy="openDeployModal"
      />

      <!-- Banner Alert -->
      <BannerAlert
        :visible="bannerVisible"
        @dismiss="handleDismissBanner"
      />

      <!-- Metric Cards -->
      <div class="metrics-row">
        <metric-card
          v-for="metric in metrics"
          :key="metric.label"
          v-bind="metric"
        />
      </div>

      <!-- Main Content Area with Terminal and Right Panel -->
      <div class="main-area">
        <!-- Terminal (Center) -->
        <div class="terminal-section">
          <Terminal />
        </div>

        <!-- Right Panel (Activity) -->
        <div class="right-panel">
          <activity-panel />
        </div>
      </div>
    </main>

    <!-- Deploy Modal -->
    <DeployModal
      :visible="showDeployModal"
      :status="deployStatus"
      :message="deployMessage"
      @close="closeDeployModal"
      @deploy="handleExecuteDeploy"
    />
  </div>
</template>

<style scoped>
.dashboard-container {
  width: 100%;
  max-width: 1600px;
  margin: 0 auto;
  min-height: 100vh;
  background-color: var(--bg-body);
  position: relative;
}

.main-content {
  padding: var(--spacing-2xl) var(--spacing-2xl);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2xl);
  position: relative;
}

.metrics-row {
  display: flex;
  gap: var(--spacing-base);
}

.main-area {
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: var(--spacing-lg);
  align-items: start;
}

.terminal-section {
  height: 600px;
}

.right-panel {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

/* Responsive */
@media (max-width: 1200px) {
  .main-area {
    grid-template-columns: 1fr;
  }

  .terminal-section {
    height: 500px;
  }
}

@media (max-width: 768px) {
  .main-content {
    padding: var(--spacing-lg);
  }

  .metrics-row {
    flex-direction: column;
  }
}
</style>
