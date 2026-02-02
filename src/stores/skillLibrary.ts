/**
 * Skill Library Store
 * 技能库状态管理
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { SkillRule, SkillTemplate, SkillExecutionResult } from '@/types'
import {
  skillRules,
  skillTemplates,
  skillExecutionHistory
} from '@/mock/skillLibrary'
import {
  executeSkillRule,
  filterRulesByCategory,
  searchSkillRules,
  createRuleFromTemplate
} from '@/services/skillEngine'

export const useSkillLibraryStore = defineStore('skillLibrary', () => {
  // State
  const rules = ref<SkillRule[]>([...skillRules])
  const templates = ref<SkillTemplate[]>([...skillTemplates])
  const history = ref<SkillExecutionResult[]>([...skillExecutionHistory])

  // Filter state
  const searchTerm = ref('')
  const selectedCategory = ref<string>('all')

  // Getters
  const filteredRules = computed(() => {
    let filtered = rules.value

    // Filter by category
    if (selectedCategory.value !== 'all') {
      filtered = filterRulesByCategory(filtered, selectedCategory.value)
    }

    // Search
    if (searchTerm.value) {
      filtered = searchSkillRules(filtered, searchTerm.value)
    }

    return filtered
  })

  const rulesByCategory = computed(() => {
    const grouped: Record<string, SkillRule[]> = {}
    rules.value.forEach(rule => {
      if (!grouped[rule.category]) {
        grouped[rule.category] = []
      }
      grouped[rule.category].push(rule)
    })
    return grouped
  })

  const totalRuleCount = computed(() => rules.value.length)
  const enabledRuleCount = computed(() => rules.value.filter(r => r.enabled).length)
  const totalExecutions = computed(() =>
    rules.value.reduce((sum, rule) => sum + rule.executionCount, 0)
  )

  // Actions
  const updateSearchTerm = (term: string) => {
    searchTerm.value = term
  }

  const updateSelectedCategory = (category: string) => {
    selectedCategory.value = category
  }

  const addRule = (rule: SkillRule) => {
    rules.value.push(rule)
  }

  const updateRule = (id: string, updates: Partial<SkillRule>) => {
    const index = rules.value.findIndex(r => r.id === id)
    if (index !== -1) {
      rules.value[index] = {
        ...rules.value[index],
        ...updates,
        version: rules.value[index].version + 1,
        modifiedAt: new Date().toISOString()
      }
    }
  }

  const deleteRule = (id: string) => {
    rules.value = rules.value.filter(r => r.id !== id)
  }

  const toggleRuleEnabled = (id: string) => {
    const index = rules.value.findIndex(r => r.id === id)
    if (index !== -1) {
      rules.value[index].enabled = !rules.value[index].enabled
    }
  }

  const executeRule = (rule: SkillRule): SkillExecutionResult => {
    const result = executeSkillRule(rule)

    // Update rule stats
    updateRule(rule.id, {
      executionCount: rule.executionCount + 1,
      lastExecutedAt: result.executedAt,
      successCount: result.status === 'success' ? rule.successCount + 1 : rule.successCount
    })

    // Add to history
    history.value.unshift(result)

    return result
  }

  const createFromTemplate = (
    template: SkillTemplate,
    userId: string,
    userName: string,
    options: {
      name: string
      description: string
      applicableSystems: string[]
      tags: string[]
    }
  ): SkillRule => {
    const newRule = createRuleFromTemplate(template, userId, userName, options)
    rules.value.push(newRule)
    return newRule
  }

  const resetFilters = () => {
    searchTerm.value = ''
    selectedCategory.value = 'all'
  }

  return {
    // State
    rules,
    templates,
    history,
    searchTerm,
    selectedCategory,
    // Getters
    filteredRules,
    rulesByCategory,
    totalRuleCount,
    enabledRuleCount,
    totalExecutions,
    // Actions
    updateSearchTerm,
    updateSelectedCategory,
    addRule,
    updateRule,
    deleteRule,
    toggleRuleEnabled,
    executeRule,
    createFromTemplate,
    resetFilters
  }
})
