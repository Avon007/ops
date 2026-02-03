<script setup lang="ts">
/**
 * ActivityPanel Component
 * 活动面板组件
 *
 * 显示系统活动日志，支持调整宽度
 */

import { computed, onMounted, ref, watch } from 'vue'
import type { Activity } from '@/types'
import { mockActivities } from '@/mock/data'
import { useResizable } from '@/composables'

// Props
interface Props {
  resizable?: boolean
  initialWidth?: number
  minWidth?: number
  maxWidth?: number
  onResizeStart?: () => void
  onResizeEnd?: () => void
}

const props = withDefaults(defineProps<Props>(), {
  resizable: false,
  initialWidth: 320,
  minWidth: 280,
  maxWidth: 600
})

// Emits
const emit = defineEmits<{
  (e: 'resize', size: { width: number; height: number }): void
}>()

// State
const activities = ref<Activity[]>([])
const panelWidth = ref(props.initialWidth)
const panelRef = ref<HTMLElement | null>(null)

// Composables
const { isResizing, elementRef, startResize } = useResizable({
  minWidth: props.minWidth,
  maxWidth: props.maxWidth,
  onResizeStart: () => {
    props.onResizeStart?.()
  },
  onResize: (size) => {
    panelWidth.value = size.width
    emit('resize', size)
  },
  onResizeEnd: () => {
    props.onResizeEnd?.()
  }
})

// 同步 elementRef
watch(panelRef, (newRef) => {
  if (newRef) {
    elementRef.value = newRef
  }
})

onMounted(() => {
  activities.value = mockActivities
})

// Computed
const panelStyle = computed(() => ({
  width: `${panelWidth.value}px`
}))

const panelClass = computed(() => ({
  'is-resizable': props.resizable,
  'is-resizing': isResizing.value
}))

// Helpers
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

const handleResizeStart = (event: MouseEvent) => {
  if (!props.resizable) return
  startResize('e', event)
}
</script>

<template>
  <div
    ref="panelRef"
    class="activity-panel"
    :class="panelClass"
    :style="panelStyle"
  >
    <!-- 调整大小手柄 -->
    <div
      v-if="resizable"
      class="resize-handle resize-handle-right"
      title="拖拽调整宽度"
      @mousedown="handleResizeStart"
    ></div>

    <div class="section-header">
      <div class="section-title-group">
        <div class="section-category">系统事件</div>
        <h2 class="section-title">活动日志</h2>
      </div>
      <div class="view-all">查看全部 >></div>
    </div>

    <div class="activities-list">
      <div v-for="activity in activities" :key="activity.id" v-memo="[activity.id, activity.type]" class="activity-item">
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
  background-color: var(--bg-white);
  border: 1px solid var(--border-light);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-xl);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-base);
  box-shadow: var(--shadow-card);
  position: relative;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.activity-panel.is-resizable {
  cursor: default;
}

.activity-panel.is-resizing {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  border-color: var(--primary-green);
}

.activity-panel.is-resizable:hover {
  border-color: var(--border-hover);
}

.resize-handle {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 6px;
  cursor: col-resize;
  background-color: transparent;
  transition: background-color 0.2s ease;
  z-index: 10;
}

.resize-handle-right {
  right: 0;
  border-radius: 0 var(--border-radius-lg) var(--border-radius-lg) 0;
}

.activity-panel.is-resizable:hover .resize-handle-right {
  background-color: var(--border-light);
}

.resize-handle-right:hover {
  background-color: var(--primary-green) !important;
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
