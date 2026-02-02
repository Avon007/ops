/**
 * Settings Dialog Composable
 * 设置对话框状态管理
 */

import { ref, computed } from 'vue'

export function useSettingsDialog() {
  // State
  const isOpen = ref(false)
  const activeTab = ref('layout')
  const saveStatus = ref<'idle' | 'saving' | 'saved' | 'error'>('idle')
  const saveTimeout = ref<number>()

  // Computed
  const showSaveSuccess = computed(() => saveStatus.value === 'saved')

  // Methods
  const open = () => {
    isOpen.value = true
  }

  const close = () => {
    isOpen.value = false
    activeTab.value = 'layout'
    saveStatus.value = 'idle'
  }

  const setActiveTab = (tab: string) => {
    activeTab.value = tab
  }

  const showSaved = () => {
    saveStatus.value = 'saved'

    // Clear timeout if exists
    if (saveTimeout.value) {
      clearTimeout(saveTimeout.value)
    }

    // Auto-hide after 2 seconds
    saveTimeout.value = window.setTimeout(() => {
      saveStatus.value = 'idle'
    }, 2000)
  }

  const showSaving = () => {
    saveStatus.value = 'saving'
  }

  const showError = () => {
    saveStatus.value = 'error'

    if (saveTimeout.value) {
      clearTimeout(saveTimeout.value)
    }

    saveTimeout.value = window.setTimeout(() => {
      saveStatus.value = 'idle'
    }, 3000)
  }

  return {
    // State
    isOpen,
    activeTab,
    saveStatus,
    // Computed
    showSaveSuccess,
    // Methods
    open,
    close,
    setActiveTab,
    showSaved,
    showSaving,
    showError
  }
}
