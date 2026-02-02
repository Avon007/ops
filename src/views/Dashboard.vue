<script setup lang="ts">
import { ref } from 'vue'
import { X, Loader2, CheckCircle, XCircle, Rocket } from 'lucide-vue-next'
import PageHeader from '@/components/PageHeader.vue'
import MetricCard from '@/components/MetricCard.vue'
import ServerTable from '@/components/ServerTable.vue'
import ActivityPanel from '@/components/ActivityPanel.vue'
import Terminal from '@/components/Terminal.vue'
import { mockMetrics, mockActivities } from '@/mock/data'

const metrics = ref(mockMetrics)
const activities = ref(mockActivities)
const isRefreshing = ref(false)
const showDeployModal = ref(false)
const deployStatus = ref<'idle' | 'deploying' | 'success' | 'error'>('idle')
const deployMessage = ref('')

const handleRefresh = async () => {
  if (isRefreshing.value) return

  isRefreshing.value = true

  try {
    // 模拟数据刷新
    await new Promise(resolve => setTimeout(resolve, 1500))

    // 更新指标数据（添加随机变化）
    metrics.value = metrics.value.map(metric => ({
      ...metric,
      value: metric.value,
      change: Math.floor(Math.random() * 20) - 10
    }))

    // 更新活动列表
    activities.value = [
      ...activities.value,
      {
        id: `act-${Date.now()}`,
        title: '数据已刷新',
        description: '系统数据更新成功',
        type: 'success' as const,
        badge: '系统',
        timestamp: '刚刚'
      }
    ].slice(0, 5)

    console.log('✅ 数据刷新成功')
  } catch (error) {
    console.error('❌ 刷新失败:', error)
  } finally {
    isRefreshing.value = false
  }
}

const handleDeploy = () => {
  showDeployModal.value = true
  deployStatus.value = 'idle'
  deployMessage.value = ''
}

const executeDeploy = async () => {
  deployStatus.value = 'deploying'
  deployMessage.value = '正在准备部署...'

  try {
    // 模拟部署过程
    await new Promise(resolve => setTimeout(resolve, 2000))
    deployMessage.value = '正在部署应用...'

    await new Promise(resolve => setTimeout(resolve, 3000))
    deployMessage.value = '正在验证部署...'

    await new Promise(resolve => setTimeout(resolve, 1500))

    deployStatus.value = 'success'
    deployMessage.value = '部署成功！应用已上线。'

    // 添加到活动列表
    activities.value = [
      {
        id: `act-${Date.now()}`,
        title: '部署成功',
        description: '应用新版本已成功部署到生产环境',
        type: 'success',
        badge: '部署',
        timestamp: '刚刚'
      },
      ...activities.value
    ].slice(0, 5)

  } catch (error) {
    deployStatus.value = 'error'
    deployMessage.value = '部署失败，请检查日志并重试。'
  }
}

const closeDeployModal = () => {
  showDeployModal.value = false
  deployStatus.value = 'idle'
  deployMessage.value = ''
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
        @refresh="handleRefresh"
        @deploy="handleDeploy"
      />

      <!-- Banner Alert -->
      <div class="banner">
        <div class="banner-content">
          <div class="banner-tag">告警</div>
          <div class="banner-message">
            3 台服务器需要关注 · app-server-02 的 CPU 使用率超过 90%
          </div>
        </div>
        <X :size="14" class="banner-dismiss" />
      </div>

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

        <!-- Right Panel (Server Status & Logs) -->
        <div class="right-panel">
          <server-table />
          <activity-panel />
        </div>
      </div>
    </main>

    <!-- Deploy Modal -->
    <div v-if="showDeployModal" class="modal-overlay" @click.self="closeDeployModal">
      <div class="modal-container">
        <div class="modal-header">
          <div class="modal-title-group">
            <Rocket :size="20" />
            <h2 class="modal-title">应用部署</h2>
          </div>
          <button class="modal-close" @click="closeDeployModal">
            <X :size="18" />
          </button>
        </div>

        <div class="modal-body">
          <div v-if="deployStatus === 'idle'" class="deploy-info">
            <div class="info-section">
              <h3>部署信息</h3>
              <div class="info-row">
                <span class="info-label">应用名称：</span>
                <span class="info-value">运维助手系统</span>
              </div>
              <div class="info-row">
                <span class="info-label">当前版本：</span>
                <span class="info-value">v1.0.0</span>
              </div>
              <div class="info-row">
                <span class="info-label">目标版本：</span>
                <span class="info-value">v1.1.0</span>
              </div>
              <div class="info-row">
                <span class="info-label">部署环境：</span>
                <span class="info-value">生产环境</span>
              </div>
            </div>

            <div class="deploy-warning">
              <p>⚠️ 部署将短暂影响服务，建议在低峰时段执行</p>
            </div>
          </div>

          <div v-else class="deploy-progress">
            <div class="progress-header">
              <Loader2 v-if="deployStatus === 'deploying'" :size="24" class="spin" />
              <CheckCircle v-else-if="deployStatus === 'success'" :size="24" class="icon-success" />
              <XCircle v-else-if="deployStatus === 'error'" :size="24" class="icon-error" />

              <div class="progress-text">
                <p class="progress-message">{{ deployMessage }}</p>
                <p v-if="deployStatus === 'deploying'" class="progress-detail">正在执行部署任务，请稍候...</p>
              </div>
            </div>

            <div class="progress-steps">
              <div class="step" :class="{ active: deployStatus !== 'idle' }">
                <div class="step-icon">1</div>
                <div class="step-label">准备部署</div>
              </div>
              <div class="step-line"></div>
              <div class="step" :class="{ active: deployStatus === 'deploying' || deployStatus === 'success' || deployStatus === 'error' }">
                <div class="step-icon">2</div>
                <div class="step-label">部署应用</div>
              </div>
              <div class="step-line"></div>
              <div class="step" :class="{ active: deployStatus === 'success' || deployStatus === 'error' }">
                <div class="step-icon">3</div>
                <div class="step-label">验证部署</div>
              </div>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button v-if="deployStatus === 'idle'" class="btn btn-secondary" @click="closeDeployModal">
            取消
          </button>
          <button
            v-if="deployStatus === 'idle'"
            class="btn btn-primary"
            @click="executeDeploy"
          >
            <Rocket :size="16" />
            开始部署
          </button>
          <button
            v-if="deployStatus !== 'idle'"
            class="btn btn-primary"
            :disabled="deployStatus === 'deploying'"
            @click="closeDeployModal"
          >
            {{ deployStatus === 'deploying' ? '部署中...' : '完成' }}
          </button>
        </div>
      </div>
    </div>
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

.banner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px;
  background-color: var(--accent-light);
  border-left: 3px solid var(--primary-green);
  border-radius: var(--border-radius);
  gap: var(--spacing-md);
}

.banner-content {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.banner-tag {
  padding: 3px 6px;
  background-color: var(--primary-green);
  color: var(--bg-white);
  font-size: 8px;
  font-weight: 700;
  letter-spacing: 1px;
  border-radius: var(--border-radius-sm);
  font-family: var(--font-family);
}

.banner-message {
  font-size: var(--font-size-caption-1);
  color: var(--text-main);
  font-family: var(--font-family);
}

.banner-dismiss {
  color: var(--text-gray);
  cursor: pointer;
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

/* Modal Overlay */
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
  padding: var(--spacing-lg);
}

.modal-container {
  background: var(--bg-white);
  border-radius: var(--border-radius-lg);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  width: 100%;
  max-width: 500px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-lg);
  border-bottom: 1px solid var(--border-color);
}

.modal-title-group {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  color: var(--text-main);
}

.modal-title {
  font-size: 18px;
  font-weight: 600;
  margin: 0;
  font-family: var(--font-family);
}

.modal-close {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  border-radius: var(--border-radius);
  cursor: pointer;
  color: var(--text-gray);
  transition: all 0.2s;
}

.modal-close:hover {
  background: var(--bg-elevated);
  color: var(--text-main);
}

.modal-body {
  padding: var(--spacing-lg);
}

.deploy-info {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.info-section h3 {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-main);
  margin: 0 0 var(--spacing-md) 0;
  font-family: var(--font-family);
}

.info-row {
  display: flex;
  padding: var(--spacing-sm) 0;
  font-size: 14px;
  font-family: var(--font-family);
}

.info-label {
  color: var(--text-gray);
  min-width: 100px;
}

.info-value {
  color: var(--text-main);
  font-weight: 500;
}

.deploy-warning {
  padding: var(--spacing-md);
  background: var(--accent-light);
  border-left: 3px solid var(--accent-warm);
  border-radius: var(--border-radius);
}

.deploy-warning p {
  margin: 0;
  font-size: 13px;
  color: var(--text-main);
  font-family: var(--font-family);
}

.deploy-progress {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.progress-header {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.icon-success {
  color: var(--status-success);
}

.icon-error {
  color: var(--status-negative);
}

.progress-text {
  flex: 1;
}

.progress-message {
  font-size: 15px;
  font-weight: 600;
  color: var(--text-main);
  margin: 0 0 var(--spacing-xs) 0;
  font-family: var(--font-family);
}

.progress-detail {
  font-size: 13px;
  color: var(--text-gray);
  margin: 0;
  font-family: var(--font-family);
}

.progress-steps {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-lg) 0;
}

.step {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-sm);
  opacity: 0.4;
  transition: opacity 0.3s;
}

.step.active {
  opacity: 1;
}

.step-icon {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--bg-elevated);
  border: 2px solid var(--border-color);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 600;
  color: var(--text-gray);
  font-family: var(--font-family);
}

.step.active .step-icon {
  background: var(--primary-green);
  border-color: var(--primary-green);
  color: var(--bg-white);
}

.step-label {
  font-size: 12px;
  color: var(--text-gray);
  font-family: var(--font-family);
}

.step.active .step-label {
  color: var(--text-main);
  font-weight: 500;
}

.step-line {
  width: 60px;
  height: 2px;
  background: var(--border-color);
  margin: 0 var(--spacing-xs);
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: var(--spacing-md);
  padding: var(--spacing-lg);
  border-top: 1px solid var(--border-color);
}

.btn {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm) var(--spacing-lg);
  border-radius: var(--border-radius);
  font-size: 14px;
  font-weight: 500;
  font-family: var(--font-family);
  cursor: pointer;
  transition: all 0.2s;
  border: none;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-secondary {
  background: transparent;
  color: var(--text-gray);
  border: 1px solid var(--border-color);
}

.btn-secondary:hover:not(:disabled) {
  background: var(--bg-elevated);
  border-color: var(--border-strong);
}

.btn-primary {
  background: var(--primary-green);
  color: var(--bg-white);
}

.btn-primary:hover:not(:disabled) {
  background: var(--status-positive);
  transform: translateY(-1px);
  box-shadow: var(--shadow-elevated);
}
</style>
