<script setup lang="ts">
import { X } from 'lucide-vue-next'

interface Props {
  visible?: boolean
}

defineProps<Props>()

const emit = defineEmits<{
  dismiss: []
}>()
</script>

<template>
  <Transition name="banner">
    <div v-if="visible" class="banner">
      <div class="banner-content">
        <div class="banner-tag">告警</div>
        <div class="banner-message">
          3 台服务器需要关注 · app-server-02 的 CPU 使用率超过 90%
        </div>
      </div>
      <X :size="14" class="banner-dismiss" @click="emit('dismiss')" />
    </div>
  </Transition>
</template>

<style scoped>
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
  transition: color 0.2s ease;
}

.banner-dismiss:hover {
  color: var(--text-main);
}

/* Transition */
.banner-enter-active,
.banner-leave-active {
  transition: all 0.3s ease;
}

.banner-enter-from,
.banner-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
