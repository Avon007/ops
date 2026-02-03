<script setup lang="ts">
/**
 * App Root Component
 * 应用根组件
 *
 * 职责：
 * - 管理全局布局
 * - 响应侧边栏位置设置
 * - 集成路由和全局组件
 */

import { ref, onMounted } from 'vue'
import { RouterView } from 'vue-router'
import AppSidebar from '@/components/AppSidebar.vue'
import SettingsPanel from '@/components/SettingsPanel.vue'
import ClawdBot from '@/components/ClawdBot.vue'
import InlineNavigation from '@/components/InlineNavigation.vue'
import { useLayoutConfig, useDisplaySettings } from '@/composables'
import { initPreferencesService } from '@/services/preferencesService'

// Composables - 布局配置和显示设置
const { showSidebar, sidebarClasses, mainContentClasses } = useLayoutConfig()
const { applyDisplaySettings } = useDisplaySettings()

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

  // Apply display settings (animations, transitions, motion preferences)
  applyDisplaySettings()

  console.log('🌷 Spring-themed Operations Assistant Dashboard')
  console.log('🚀 Powered by Vue 3 + TypeScript')
  console.log('⚙️  Preferences loaded')
  console.log('🤖 ClawdBot AI Assistant ready')
})

// Watch route changes for debugging
import { watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

watch(() => route.path, (newPath, oldPath) => {
  console.log(`Route changed: ${oldPath} → ${newPath}`)
}, { immediate: true })
</script>

<template>
  <div class="app-container">
    <!-- Sidebar - 支持左侧/右侧/隐藏 -->
    <AppSidebar
      v-if="showSidebar"
      :class="sidebarClasses"
      @open-settings="handleOpenSettings"
      @open-terminal="handleOpenTerminal"
    />

    <!-- Main Content -->
    <main class="main-content" :class="mainContentClasses">
      <!-- Inline Navigation - 仅在无边栏模式下显示 -->
      <InlineNavigation v-if="!showSidebar" @open-settings="handleOpenSettings" />

      <!-- Router Content -->
      <RouterView :key="$route.fullPath" v-slot="{ Component }">
        <component :is="Component" />
      </RouterView>
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
  position: relative;
}

/* 侧边栏在左侧 - 默认布局 */
.main-content.sidebar-left {
  order: 2;
}

/* 侧边栏在右侧 */
.sidebar-right {
  order: 2;
}

.main-content.sidebar-right {
  order: 1;
}

/* 无侧边栏 */
.main-content.without-sidebar {
  flex: 1;
  max-width: 100%;
}

.main-content {
  flex: 1;
  overflow-y: auto;
  padding: 0 40px;
  max-width: 100%;
  transition: all 0.3s ease;
}

/* 右侧侧边栏时的特殊处理 */
.sidebar-right ~ .main-content {
  padding-left: 0;
}
</style>
