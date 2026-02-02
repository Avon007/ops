<script setup lang="ts">
import { ref, computed } from 'vue'
import { X, Loader2, CheckCircle, XCircle, Rocket } from 'lucide-vue-next'
import type { DeploymentStatus } from '@/composables'

interface Props {
  visible: boolean
  status: DeploymentStatus
  message: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  close: []
  deploy: []
}>()

// Progress steps
const steps = computed(() => [
  { id: 1, label: '准备部署', active: props.status !== 'idle' },
  { id: 2, label: '部署应用', active: ['deploying', 'success', 'error'].includes(props.status) },
  { id: 3, label: '验证部署', active: ['success', 'error'].includes(props.status) }
])

const isIdle = computed(() => props.status === 'idle')
const isDeploying = computed(() => props.status === 'deploying')
const isSuccess = computed(() => props.status === 'success')
const isError = computed(() => props.status === 'error')

const handleClose = () => emit('close')
const handleDeploy = () => emit('deploy')
</script>

<template>
  <Transition name="modal">
    <div v-if="visible" class="modal-overlay" @click.self="handleClose">
      <div class="modal-container">
        <!-- Header -->
        <div class="modal-header">
          <div class="modal-title-group">
            <Rocket :size="20" />
            <h2 class="modal-title">应用部署</h2>
          </div>
          <button class="modal-close" @click="handleClose">
            <X :size="18" />
          </button>
        </div>

        <!-- Body -->
        <div class="modal-body">
          <!-- Idle State -->
          <div v-if="isIdle" class="deploy-info">
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

          <!-- Progress State -->
          <div v-else class="deploy-progress">
            <div class="progress-header">
              <Loader2 v-if="isDeploying" :size="24" class="spin" />
              <CheckCircle v-else-if="isSuccess" :size="24" class="icon-success" />
              <XCircle v-else-if="isError" :size="24" class="icon-error" />

              <div class="progress-text">
                <p class="progress-message">{{ message }}</p>
                <p v-if="isDeploying" class="progress-detail">正在执行部署任务，请稍候...</p>
              </div>
            </div>

            <div class="progress-steps">
              <div
                v-for="step in steps"
                :key="step.id"
                class="step"
                :class="{ active: step.active }"
              >
                <div class="step-icon">{{ step.id }}</div>
                <div class="step-label">{{ step.label }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="modal-footer">
          <button v-if="isIdle" class="btn btn-secondary" @click="handleClose">
            取消
          </button>
          <button v-if="isIdle" class="btn btn-primary" @click="handleDeploy">
            <Rocket :size="16" />
            开始部署
          </button>
          <button
            v-if="!isIdle"
            class="btn btn-primary"
            :disabled="isDeploying"
            @click="handleClose"
          >
            {{ isDeploying ? '部署中...' : '完成' }}
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
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
  gap: var(--spacing-xs);
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

/* Modal Transition */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-active .modal-container,
.modal-leave-active .modal-container {
  transition: transform 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-container,
.modal-leave-to .modal-container {
  transform: scale(0.9);
}
</style>
