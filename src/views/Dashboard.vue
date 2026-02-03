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
 * 5. 支持拖拽和调整大小交互功能
 * 6. 使用 composables 封装布局逻辑
 */

import { computed, ref } from 'vue'
import PageHeader from '@/components/PageHeader.vue'
import MetricCard from '@/components/MetricCard.vue'
import ActivityPanel from '@/components/ActivityPanel.vue'
import Terminal from '@/components/Terminal.vue'
import BannerAlert from '@/components/BannerAlert.vue'
import DeployModal from '@/components/DeployModal.vue'

// Composables
import { useRefresh, useDeployment, useLayoutConfig } from '@/composables'

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

const { layoutClasses, metricsGridStyle, cardSize } = useLayoutConfig()

// Computed
const metrics = computed(() => dashboardStore.metrics)
const bannerVisible = computed(() => dashboardStore.bannerVisible)

// Interactive Features State
const enableDraggable = ref(true)
const enableResizable = ref(true)
const draggedMetric = ref<string | null>(null)

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

// Drag and Drop Handlers
const handleMetricDragStart = (metricLabel: string) => {
  draggedMetric.value = metricLabel
  console.log(`开始拖拽: ${metricLabel}`)
}

const handleMetricDragEnd = () => {
  console.log(`结束拖拽: ${draggedMetric.value}`)
  draggedMetric.value = null
}

// Resize Handlers
const handleActivityResize = (size: { width: number; height: number }) => {
  console.log(`活动面板调整大小: ${size.width}px`)
}

const handleActivityResizeStart = () => {
  console.log('开始调整活动面板大小')
}

const handleActivityResizeEnd = () => {
  console.log('结束调整活动面板大小')
}

const handleTerminalResize = (size: { width: number; height: number }) => {
  console.log(`终端调整大小: ${size.height}px`)
}

const handleTerminalResizeStart = () => {
  console.log('开始调整终端大小')
}

const handleTerminalResizeEnd = () => {
  console.log('结束调整终端大小')
}
</script>

<template>
  <div class="dashboard-container" :class="layoutClasses">
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
      <div class="metrics-row" :style="metricsGridStyle">
        <metric-card
          v-for="metric in metrics"
          :key="metric.label"
          v-bind="metric"
          :size="cardSize"
          :draggable="enableDraggable"
          @drag-start="() => handleMetricDragStart(metric.label)"
          @drag-end="handleMetricDragEnd"
        />
      </div>

      <!-- Main Content Area with Terminal and Right Panel -->
      <div class="main-area">
        <!-- Terminal (Center) -->
        <div class="terminal-section">
          <Terminal
            :resizable="enableResizable"
            @resize="handleTerminalResize"
            @resize-start="handleTerminalResizeStart"
            @resize-end="handleTerminalResizeEnd"
          />
        </div>

        <!-- Right Panel (Activity) -->
        <div class="right-panel">
          <activity-panel
            :resizable="enableResizable"
            @resize="handleActivityResize"
            @resize-start="handleActivityResizeStart"
            @resize-end="handleActivityResizeEnd"
          />
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
  transition: all 0.3s ease;
}

.main-content {
  padding: var(--spacing-2xl) var(--spacing-2xl);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2xl);
  position: relative;
  transition: all 0.3s ease;
}

/* Layout Modes */
.dashboard-container.layout-compact .main-content {
  gap: var(--spacing-base);
  padding: var(--spacing-lg) var(--spacing-lg);
}

.dashboard-container.layout-spacious .main-content {
  gap: var(--spacing-3xl);
  padding: var(--spacing-3xl) var(--spacing-3xl);
}

/* Gap Sizes */
.dashboard-container.gap-small .metrics-row {
  gap: var(--spacing-sm);
}

.dashboard-container.gap-medium .metrics-row {
  gap: var(--spacing-base);
}

.dashboard-container.gap-large .metrics-row {
  gap: var(--spacing-lg);
}

.metrics-row {
  display: grid;
  gap: var(--spacing-base);
  transition: all 0.3s ease;
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
