<script setup lang="ts">
import { useRouter } from 'vue-router'
import Terminal from '@/components/Terminal.vue'

const router = useRouter()

const navigateToDashboard = () => {
  router.push('/')
}
</script>

<template>
  <div class="terminal-page">
    <!-- Header -->
    <div class="page-header">
      <button class="back-button" @click="navigateToDashboard">
        ← 返回仪表板
      </button>
    </div>

    <!-- Terminal Container -->
    <div class="terminal-section">
      <Terminal />
    </div>
  </div>
</template>

<style scoped>
.terminal-page {
  width: 100%;
  max-width: 1600px;
  margin: 0 auto;
  min-height: 100vh;
  background-color: var(--bg-white);
  padding: var(--spacing-2xl) var(--spacing-2xl);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xl);
}

.page-header {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

.back-button {
  padding: var(--spacing-sm) var(--spacing-md);
  background-color: transparent;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  color: var(--text-gray);
  font-size: var(--font-size-caption-2);
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: var(--font-family);
  width: fit-content;
}

.back-button:hover {
  background-color: var(--bg-elevated);
  border-color: var(--primary-green);
  color: var(--text-main);
}

.terminal-section {
  height: calc(100vh - 150px);
  min-height: 600px;
}
</style>
