<script setup lang="ts">
import { RefreshCw, Rocket, Loader2 } from 'lucide-vue-next'

interface Props {
  title: string
  subtitle?: string
  breadcrumbs?: string
  isRefreshing?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isRefreshing: false
})

const emit = defineEmits<{
  (e: 'refresh'): void
  (e: 'deploy'): void
}>()
</script>

<template>
  <div class="page-header">
    <div v-if="breadcrumbs" class="breadcrumbs">{{ breadcrumbs }}</div>
    <div class="title-row">
      <div class="title-group">
        <h1 class="page-title">{{ title }}</h1>
        <p v-if="subtitle" class="page-subtitle">{{ subtitle }}</p>
      </div>
      <div class="actions">
        <button class="btn btn-outline" @click="emit('refresh')" :disabled="isRefreshing">
          <Loader2 v-if="isRefreshing" :size="14" class="spin" />
          <RefreshCw v-else :size="14" />
          <span>{{ isRefreshing ? '刷新中...' : '刷新' }}</span>
        </button>
        <button class="btn btn-primary" @click="emit('deploy')">
          <Rocket :size="14" />
          <span>部署</span>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page-header {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.breadcrumbs {
  font-size: var(--font-size-caption-1);
  color: var(--text-gray);
  font-family: var(--font-family);
}

.title-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: var(--spacing-5xl);
}

.title-group {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  flex: 1;
}

.page-title {
  font-size: 34px;
  font-weight: 600;
  color: var(--text-main);
  letter-spacing: -1px;
  font-family: var(--font-family);
}

.page-subtitle {
  font-size: var(--font-size-body);
  color: var(--text-gray);
  font-family: var(--font-family);
}

.actions {
  display: flex;
  gap: var(--spacing-md);
}

.btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 18px;
  border-radius: var(--border-radius);
  font-size: var(--font-size-caption-2);
  font-weight: 600;
  font-family: var(--font-family);
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
}

.btn-outline {
  background: transparent;
  color: var(--text-gray);
  border: 1px solid var(--border-light);
}

.btn-outline:hover {
  border-color: var(--primary-green);
  color: var(--primary-green);
}

.btn-primary {
  background-color: var(--primary-green);
  color: var(--bg-white);
}

.btn-primary:hover {
  background-color: var(--status-positive);
  transform: translateY(-1px);
  box-shadow: var(--shadow-elevated);
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>
