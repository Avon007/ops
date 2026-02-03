<script setup lang="ts">
/**
 * MetricCard Component
 * 指标卡片组件
 *
 * 显示关键指标，支持拖拽重新排序，响应卡片大小设置
 *
 * 职责：
 * - 渲染指标卡片UI
 * - 响应size prop变化
 * - 集成拖拽功能
 */

import { computed } from 'vue'
import { ArrowUp, ArrowDown, Minus, GripVertical } from 'lucide-vue-next'
import { useDraggable } from '@/composables'
import type { CardSize } from '@/types'

// Props
interface Props {
  label: string
  value: string
  change: number
  changeType: 'up' | 'down' | 'stable'
  status: 'positive' | 'warning' | 'negative' | 'info'
  draggable?: boolean
  size?: CardSize
  onDragStart?: () => void
  onDragEnd?: () => void
}

const props = withDefaults(defineProps<Props>(), {
  draggable: false,
  size: 'medium'
})

// Composables - 拖拽功能
const { isDragging, handleDragStart, handleDragEnd } = useDraggable({
  dragType: 'metric-card',
  dragData: {
    label: props.label,
    value: props.value
  },
  onDragStart: () => {
    props.onDragStart?.()
  },
  onDragEnd: () => {
    props.onDragEnd?.()
  }
})

// Computed
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

const cardClass = computed(() => ({
  'is-dragging': isDragging.value,
  'is-draggable': props.draggable,
  [`size-${props.size}`]: true
}))
</script>

<template>
  <div
    class="metric-card"
    :class="cardClass"
    :draggable="draggable"
    @dragstart="handleDragStart"
    @dragend="handleDragEnd"
  >
    <!-- 拖拽手柄 -->
    <div v-if="draggable" class="drag-handle" title="拖拽重新排序">
      <GripVertical :size="14" />
    </div>

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
  position: relative;
  transition: all 0.2s ease;
  min-height: 140px;
}

/* Card Sizes */
.metric-card.size-small {
  padding: 12px;
  min-height: 100px;
}

.metric-card.size-small .metric-label {
  font-size: 11px;
}

.metric-card.size-small .metric-value {
  font-size: 20px;
}

.metric-card.size-small .metric-change {
  font-size: 10px;
}

.metric-card.size-medium {
  padding: 20px;
  min-height: 140px;
}

.metric-card.size-large {
  padding: 28px;
  min-height: 180px;
}

.metric-card.size-large .metric-label {
  font-size: 14px;
}

.metric-card.size-large .metric-value {
  font-size: 36px;
}

.metric-card.size-large .metric-change {
  font-size: 14px;
}

.metric-card.size-auto {
  flex: 1;
  min-height: auto;
}

.metric-card.is-draggable {
  cursor: move;
}

.metric-card.is-dragging {
  opacity: 0.5;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  transform: rotate(2deg);
}

.metric-card:hover {
  border-color: var(--primary-green);
}

.drag-handle {
  position: absolute;
  top: 8px;
  right: 8px;
  padding: 4px;
  color: var(--text-light);
  opacity: 0;
  transition: opacity 0.2s ease;
  cursor: grab;
}

.metric-card.is-draggable:hover .drag-handle {
  opacity: 0.5;
}

.drag-handle:active {
  cursor: grabbing;
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
