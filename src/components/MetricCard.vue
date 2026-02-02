<script setup lang="ts">
import { computed } from 'vue'
import { ArrowUp, ArrowDown, Minus } from 'lucide-vue-next'

import type { Metric } from '@/types'

const props = defineProps<Metric>()

const changeIcon = computed(() => {
  if (props.changeType === 'up') return ArrowUp
  if (props.changeType === 'down') return ArrowDown
  return Minus
})

const changeClass = computed(() => {
  if (props.changeType === 'stable') return 'text-secondary'
  if (props.change > 0) return 'text-positive'
  if (props.change < 0) return 'text-negative'
  return 'text-secondary'
})
</script>

<template>
  <div class="metric-card">
    <div class="metric-header">
      <span class="metric-label">{{ label }}</span>
      <div class="metric-dot" :class="`dot-${status}`"></div>
    </div>
    <div class="metric-value">{{ value }}</div>
    <div class="metric-change" :class="changeClass">
      <component :is="changeIcon" :size="12" />
      <span>{{ Math.abs(change) }}%</span>
    </div>
  </div>
</template>

<style scoped>
.metric-card {
  flex: 1;
  background-color: var(--bg-white);
  border: 1px solid var(--border-light);
  border-radius: var(--border-radius-lg);
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  box-shadow: var(--shadow-card);
}

.metric-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.metric-label {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-light);
  letter-spacing: 1px;
  text-transform: uppercase;
  font-family: var(--font-family);
}

.metric-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.metric-value {
  font-size: var(--font-size-large-title);
  font-weight: 700;
  color: var(--text-main);
  letter-spacing: -1px;
  font-family: var(--font-family);
}

.metric-change {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: var(--font-size-caption-1);
  font-weight: 600;
  font-family: var(--font-family);
}

.text-positive {
  color: var(--status-success);
}

.text-warning {
  color: var(--status-warning);
}

.text-negative {
  color: var(--accent-warm-red);
}

.text-secondary {
  color: var(--text-gray);
}
</style>
