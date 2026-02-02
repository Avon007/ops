<script setup lang="ts">
import { onMounted } from 'vue'
import Terminal from '@/components/Terminal.vue'

onMounted(() => {
  console.log('🖥️  Terminal View mounted')
})
</script>

<template>
  <div class="terminal-view">
    <Terminal title="Operations Assistant Terminal" />
  </div>
</template>

<style scoped>
.terminal-view {
  width: 100%;
  max-width: 1600px;
  margin: 0 auto;
  height: 100%;
  padding: var(--spacing-lg) var(--spacing-lg);
  background-color: var(--bg-body);
}
</style>
