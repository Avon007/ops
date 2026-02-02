/**
 * Skill Tabs Composable
 * 处理技能库标签页切换
 */

import { ref, computed } from 'vue'

export type SkillTabType = 'my-skills' | 'templates' | 'history'

export function useSkillTabs() {
  // State
  const activeTab = ref<SkillTabType>('my-skills')

  // Computed
  const isMySkillsTab = computed(() => activeTab.value === 'my-skills')
  const isTemplatesTab = computed(() => activeTab.value === 'templates')
  const isHistoryTab = computed(() => activeTab.value === 'history')

  // Methods
  const setActiveTab = (tab: SkillTabType) => {
    activeTab.value = tab
  }

  return {
    // State
    activeTab,
    // Computed
    isMySkillsTab,
    isTemplatesTab,
    isHistoryTab,
    // Methods
    setActiveTab
  }
}
