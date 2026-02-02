<script setup lang="ts">
import { onMounted, ref } from 'vue'
import type { Activity } from '@/types'
import { mockActivities } from '@/mock/data'

const activities = ref<Activity[]>([])

onMounted(() => {
  activities.value = mockActivities
})

const getStatusClass = (type: Activity['type']) => {
  const classes = {
    success: 'text-positive',
    warning: 'text-warning',
    info: 'text-info'
  }
  return classes[type]
}

const getIndicatorClass = (type: Activity['type']) => {
  const classes = {
    success: 'dot-positive',
    warning: 'dot-warning',
    info: 'dot-info'
  }
  return classes[type]
}
</script>

<template>
  <div class="activity-panel">
    <div class="section-header">
      <div class="section-title-group">
        <div class="section-category">系统事件</div>
        <h2 class="section-title">活动日志</h2>
      </div>
      <div class="view-all">查看全部 >></div>
    </div>

    <div class="activities-list">
      <div v-for="activity in activities" :key="activity.id" class="activity-item">
        <div class="activity-indicator" :class="getIndicatorClass(activity.type)"></div>
        <div class="activity-content">
          <div class="activity-title">{{ activity.title }}</div>
          <div class="activity-desc">{{ activity.description }}</div>
        </div>
        <div class="activity-badge" :class="getStatusClass(activity.type)">
          {{ activity.badge }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.activity-panel {
  width: 320px;
  background-color: var(--bg-white);
  border: 1px solid var(--border-light);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-xl);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-base);
  box-shadow: var(--shadow-card);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.section-title-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
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

.view-all {
  font-size: 9px;
  font-weight: 600;
  color: var(--primary-green);
  letter-spacing: 1px;
  text-transform: uppercase;
  cursor: pointer;
  font-family: var(--font-family);
}

.activities-list {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.activity-item {
  display: flex;
  gap: var(--spacing-md);
  padding-top: var(--spacing-base);
  border-top: 1px solid var(--border-light);
  align-items: center;
}

.activity-indicator {
  width: 3px;
  height: 36px;
  border-radius: var(--border-radius-sm);
}

.activity-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.activity-title {
  font-size: var(--font-size-callout);
  font-weight: 600;
  color: var(--text-main);
  letter-spacing: 0.5px;
  font-family: var(--font-family);
}

.activity-desc {
  font-size: var(--font-size-caption-2);
  color: var(--text-gray);
  font-family: var(--font-family);
}

.activity-badge {
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
  font-family: var(--font-family);
}

.dot-positive {
  background-color: var(--status-success);
}

.dot-warning {
  background-color: var(--status-warning);
}

.dot-info {
  background-color: var(--status-info);
}

.text-positive {
  color: var(--status-success);
}

.text-warning {
  color: var(--status-warning);
}

.text-info {
  color: var(--status-info);
}
</style>
