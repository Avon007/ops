/**
 * Skill Dialog Composable
 * 处理技能库对话框状态
 */

import { ref, computed } from 'vue'
import type { SkillRule, SkillTemplate } from '@/types'

export type DialogType = 'create' | 'edit' | 'template'

export function useSkillDialog() {
  // State
  const showCreateDialog = ref(false)
  const showEditDialog = ref(false)
  const showTemplateDialog = ref(false)
  const selectedRule = ref<SkillRule | null>(null)
  const selectedTemplate = ref<SkillTemplate | null>(null)

  // Form state
  const editingRule = ref<Partial<SkillRule>>({
    name: '',
    description: '',
    category: 'performance',
    applicableSystems: [],
    tags: [],
    enabled: true
  })

  // Computed
  const activeDialog = computed((): DialogType | null => {
    if (showCreateDialog.value) return 'create'
    if (showEditDialog.value) return 'edit'
    if (showTemplateDialog.value) return 'template'
    return null
  })

  const hasActiveDialog = computed(() => activeDialog.value !== null)

  // Methods
  const openCreateDialog = () => {
    editingRule.value = {
      name: '',
      description: '',
      category: 'performance',
      applicableSystems: [],
      tags: [],
      enabled: true
    }
    showCreateDialog.value = true
  }

  const openEditDialog = (rule: SkillRule) => {
    selectedRule.value = rule
    editingRule.value = { ...rule }
    showEditDialog.value = true
  }

  const openTemplateDialog = (template: SkillTemplate) => {
    selectedTemplate.value = template
    editingRule.value = {
      name: `${template.name} - 副本`,
      description: template.description,
      category: template.category,
      applicableSystems: [],
      tags: [],
      enabled: true
    }
    showTemplateDialog.value = true
  }

  const closeAllDialogs = () => {
    showCreateDialog.value = false
    showEditDialog.value = false
    showTemplateDialog.value = false
    selectedRule.value = null
    selectedTemplate.value = null
  }

  const updateEditingRule = (updates: Partial<SkillRule>) => {
    editingRule.value = { ...editingRule.value, ...updates }
  }

  return {
    // State
    showCreateDialog,
    showEditDialog,
    showTemplateDialog,
    selectedRule,
    selectedTemplate,
    editingRule,
    // Computed
    activeDialog,
    hasActiveDialog,
    // Methods
    openCreateDialog,
    openEditDialog,
    openTemplateDialog,
    closeAllDialogs,
    updateEditingRule
  }
}
