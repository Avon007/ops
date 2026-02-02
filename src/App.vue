<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { RouterView } from 'vue-router'
import AppSidebar from '@/components/AppSidebar.vue'
import SettingsPanel from '@/components/SettingsPanel.vue'
import ClawdBot from '@/components/ClawdBot.vue'
import { initPreferencesService } from '@/services/preferencesService'

// State
const showSettings = ref(false)
const showTerminal = ref(false)
const showClawdBot = ref(false)

// Methods
const handleOpenSettings = () => {
  showSettings.value = true
}

const handleOpenTerminal = () => {
  showTerminal.value = true
}

// Lifecycle
onMounted(() => {
  // Initialize preferences service
  initPreferencesService()

  console.log('🌷 Spring-themed Operations Assistant Dashboard')
  console.log('🚀 Powered by Vue 3 + TypeScript')
  console.log('⚙️  Preferences loaded')
  console.log('🤖 ClawdBot AI Assistant ready')
})
</script>

<template>
  <div class="app-container">
    <AppSidebar
      @open-settings="handleOpenSettings"
      @open-terminal="handleOpenTerminal"
    />
    <main class="main-content">
      <RouterView />
    </main>

    <!-- Settings Panel -->
    <SettingsPanel v-model="showSettings" />

    <!-- ClawdBot AI Assistant -->
    <ClawdBot v-model="showClawdBot" />
  </div>
</template>

<style>
/* Global styles are imported in main.ts */
.app-container {
  display: flex;
  min-height: 100vh;
  max-width: 1200px;
  margin: 0 auto;
}

.main-content {
  flex: 1;
  overflow-y: auto;
  padding: 0 40px;
  max-width: 100%;
}
</style>
