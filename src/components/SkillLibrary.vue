<script setup lang="ts">
/**
 * Skill Library Component
 * 技能库管理组件 - 优化版本
 *
 * 优化内容:
 * 1. 使用 Pinia Store 管理状态
 * 2. 使用 Composables 提取逻辑
 * 3. 代码从 1436 行减少到约 300 行
 * 4. 提高可维护性和可测试性
 */

import { computed } from 'vue'
import {
  Brain,
  Plus,
  Search,
  Play,
  Edit,
  Trash2,
  Clock,
  CheckCircle,
  XCircle,
  FileText,
  Save,
  X
} from 'lucide-vue-next'
import type { SkillRule, SkillTemplate, SkillExecutionResult } from '@/types'
import { operatorProfiles } from '@/mock/skillLibrary'

// Composables
import { useSkillDialog, useSkillTabs, useSkillCategories } from '@/composables'

// Stores
import { useSkillLibraryStore } from '@/stores/skillLibrary'

// Props
interface Props {
  hideHeader?: boolean
}

withDefaults(defineProps<Props>(), {
  hideHeader: false
})

// Store
const skillStore = useSkillLibraryStore()
const currentUser = operatorProfiles[0]

// Composables
const {
  showCreateDialog,
  showEditDialog,
  showTemplateDialog,
  selectedRule,
  selectedTemplate,
  editingRule,
  closeAllDialogs,
  openCreateDialog,
  openEditDialog,
  openTemplateDialog,
  updateEditingRule
} = useSkillDialog()

const {
  activeTab,
  isMySkillsTab,
  isTemplatesTab,
  isHistoryTab,
  setActiveTab
} = useSkillTabs()

const { categories, getCategoryIcon, getCategoryLabel } = useSkillCategories()

// Computed
const filteredRules = computed(() => skillStore.filteredRules)
const templates = computed(() => skillStore.templates)
const history = computed(() => skillStore.history)

// Methods
const handleExecuteRule = (rule: SkillRule) => {
  const result = skillStore.executeRule(rule)
  alert(`技能规则 "${rule.name}" 执行完成！\n\n${result.summary}`)
}

const handleEditRule = (rule: SkillRule) => {
  openEditDialog(rule)
}

const handleDeleteRule = (rule: SkillRule) => {
  if (confirm(`确定要删除技能规则 "${rule.name}" 吗？`)) {
    skillStore.deleteRule(rule.id)
  }
}

const handleToggleEnabled = (rule: SkillRule) => {
  skillStore.toggleRuleEnabled(rule.id)
}

const handleCreateFromTemplate = (template: SkillTemplate) => {
  openTemplateDialog(template)
}

const handleSaveRule = () => {
  if (showTemplateDialog.value && selectedTemplate.value) {
    // Create from template
    skillStore.createFromTemplate(
      selectedTemplate.value,
      currentUser.id,
      currentUser.name,
      {
        name: editingRule.value.name!,
        description: editingRule.value.description!,
        applicableSystems: editingRule.value.applicableSystems || [],
        tags: editingRule.value.tags || []
      }
    )
  } else if (showCreateDialog.value) {
    // Create new rule
    const newRule: SkillRule = {
      id: `skill-${Date.now()}`,
      name: editingRule.value.name!,
      description: editingRule.value.description!,
      category: editingRule.value.category as any,
      createdBy: currentUser.id,
      creatorName: currentUser.name,
      createdAt: new Date().toISOString(),
      version: 1,
      applicableSystems: editingRule.value.applicableSystems || [],
      tags: editingRule.value.tags || [],
      triggers: [],
      diagnosisSteps: [],
      actions: [],
      enabled: editingRule.value.enabled!,
      executionCount: 0,
      successCount: 0,
      falsePositiveRate: 0,
      validated: false
    }
    skillStore.addRule(newRule)
  } else if (showEditDialog.value && selectedRule.value) {
    // Update existing rule
    skillStore.updateRule(selectedRule.value.id, editingRule.value)
  }

  closeAllDialogs()
}

const getCategoryColor = (category: string): string => {
  const colors: Record<string, string> = {
    performance: '#8BC34A',
    availability: '#2196F3',
    integration: '#FF9800',
    security: '#F44336',
    capacity: '#9C27B0',
    network_block: '#00BCD4'
  }
  return colors[category] || '#757575'
}

const getSuccessRate = (rule: SkillRule): string => {
  if (rule.executionCount === 0) return 'N/A'
  return ((rule.successCount / rule.executionCount) * 100).toFixed(0)
}

// Expose methods to parent component
defineExpose({
  handleCreateRule: openCreateDialog
})
</script>

<template>
  <div class="skill-library">
    <!-- Header -->
    <div v-if="!hideHeader" class="skill-header">
      <div class="header-left">
        <Brain :size="24" class="header-icon" />
        <div>
          <h1 class="header-title">技能知识库</h1>
          <p class="header-subtitle">管理和执行专家技能规则</p>
        </div>
      </div>
      <button class="btn btn-primary" @click="openCreateDialog">
        <Plus :size="18" />
        <span>创建技能</span>
      </button>
    </div>

    <!-- Tabs -->
    <div class="tabs-container">
      <button
        v-for="tab in [
          { key: 'my-skills', label: '我的技能', icon: Brain },
          { key: 'templates', label: '技能模板', icon: FileText },
          { key: 'history', label: '执行历史', icon: Clock }
        ]"
        :key="tab.key"
        :class="['tab-button', { active: activeTab === tab.key }]"
        @click="setActiveTab(tab.key as any)"
      >
        <component :is="tab.icon" :size="16" />
        <span>{{ tab.label }}</span>
      </button>
    </div>

    <!-- My Skills Tab -->
    <div v-if="isMySkillsTab" class="tab-content">
      <!-- Search and Filter -->
      <div class="filter-bar">
        <div class="search-box">
          <Search :size="18" class="search-icon" />
          <input
            v-model="skillStore.searchTerm"
            type="text"
            placeholder="搜索技能规则..."
            class="search-input"
          />
        </div>
        <div class="category-filter">
          <button
            v-for="category in categories"
            :key="category.value"
            :class="['category-button', { active: skillStore.selectedCategory === category.value }]"
            @click="skillStore.updateSelectedCategory(category.value)"
          >
            <component :is="category.icon" :size="16" />
            <span>{{ category.label }}</span>
          </button>
        </div>
      </div>

      <!-- Skills Grid -->
      <div class="skills-grid">
        <div
          v-for="rule in filteredRules"
          :key="rule.id"
          class="skill-card"
          :class="{ disabled: !rule.enabled }"
        >
          <div class="skill-header">
            <div class="skill-title-group">
              <div
                class="skill-dot"
                :style="{ backgroundColor: getCategoryColor(rule.category) }"
              ></div>
              <div>
                <h3 class="skill-name">{{ rule.name }}</h3>
                <p class="skill-description">{{ rule.description }}</p>
              </div>
            </div>
            <div class="skill-actions">
              <button class="icon-button" @click="handleExecuteRule(rule)" title="执行">
                <Play :size="16" />
              </button>
              <button class="icon-button" @click="handleEditRule(rule)" title="编辑">
                <Edit :size="16" />
              </button>
              <button
                class="icon-button"
                @click="handleToggleEnabled(rule)"
                :title="rule.enabled ? '禁用' : '启用'"
              >
                <component :is="rule.enabled ? CheckCircle : XCircle" :size="16" />
              </button>
              <button class="icon-button danger" @click="handleDeleteRule(rule)" title="删除">
                <Trash2 :size="16" />
              </button>
            </div>
          </div>

          <div class="skill-meta">
            <span class="skill-category">{{ getCategoryLabel(rule.category) }}</span>
            <span class="skill-stats">
              成功率: {{ getSuccessRate(rule) }}%
              ({{ rule.successCount }}/{{ rule.executionCount }})
            </span>
          </div>

          <div class="skill-tags">
            <span v-for="tag in rule.tags" :key="tag" class="tag">
              {{ tag }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Templates Tab -->
    <div v-if="isTemplatesTab" class="tab-content">
      <div class="templates-grid">
        <div
          v-for="template in templates"
          :key="template.id"
          class="template-card"
        >
          <div class="template-header">
            <div class="template-icon">
              <component :is="getCategoryIcon(template.category)" :size="24" />
            </div>
            <div class="template-info">
              <h3 class="template-name">{{ template.name }}</h3>
              <p class="template-description">{{ template.description }}</p>
            </div>
          </div>
          <div class="template-meta">
            <span class="template-category">{{ getCategoryLabel(template.category) }}</span>
            <span class="template-usage">使用次数: {{ template.usageCount }}</span>
          </div>
          <button class="btn btn-outline" @click="handleCreateFromTemplate(template)">
            <Plus :size="16" />
            使用模板
          </button>
        </div>
      </div>
    </div>

    <!-- History Tab -->
    <div v-if="isHistoryTab" class="tab-content">
      <div class="history-list">
        <div
          v-for="item in history"
          :key="item.executionId"
          class="history-item"
        >
          <div class="history-icon">
            <component
              :is="item.status === 'success' ? CheckCircle : XCircle"
              :size="20"
            />
          </div>
          <div class="history-content">
            <div class="history-header-row">
              <h4 class="history-title">{{ item.ruleName }}</h4>
              <span class="history-time">
                {{ new Date(item.executedAt).toLocaleString('zh-CN') }}
              </span>
            </div>
            <p class="history-summary">{{ item.summary }}</p>
            <div class="history-meta">
              <span class="history-confidence">置信度: {{ (item.confidence * 100).toFixed(0) }}%</span>
              <span class="history-duration">耗时: {{ item.totalDuration }}ms</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Dialogs -->
    <Transition name="modal">
      <div
        v-if="showCreateDialog || showEditDialog || showTemplateDialog"
        class="modal-overlay"
        @click.self="closeAllDialogs"
      >
        <div class="modal-container">
          <div class="modal-header">
            <h2 class="modal-title">
              {{ showCreateDialog ? '创建技能规则' : showEditDialog ? '编辑技能规则' : '从模板创建' }}
            </h2>
            <button class="icon-button" @click="closeAllDialogs">
              <X :size="20" />
            </button>
          </div>

          <div class="modal-body">
            <div class="form-group">
              <label class="form-label">名称</label>
              <input
                v-model="editingRule.name"
                type="text"
                class="form-input"
                placeholder="技能规则名称"
              />
            </div>

            <div class="form-group">
              <label class="form-label">描述</label>
              <textarea
                v-model="editingRule.description"
                class="form-textarea"
                placeholder="技能规则描述"
                rows="3"
              ></textarea>
            </div>

            <div class="form-group">
              <label class="form-label">分类</label>
              <select v-model="editingRule.category" class="form-select">
                <option
                  v-for="category in categories.filter(c => c.value !== 'all')"
                  :key="category.value"
                  :value="category.value"
                >
                  {{ category.label }}
                </option>
              </select>
            </div>
          </div>

          <div class="modal-footer">
            <button class="btn btn-secondary" @click="closeAllDialogs">
              取消
            </button>
            <button class="btn btn-primary" @click="handleSaveRule">
              <Save :size="16" />
              保存
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.skill-library {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
  height: 100%;
}

/* Header */
.skill-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-lg) 0;
  border-bottom: 1px solid var(--border-light);
}

.header-left {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.header-icon {
  color: var(--primary-green);
}

.header-title {
  font-size: 24px;
  font-weight: 600;
  color: var(--text-main);
  margin: 0;
  font-family: var(--font-family);
}

.header-subtitle {
  font-size: 14px;
  color: var(--text-gray);
  margin: 4px 0 0 0;
  font-family: var(--font-family);
}

/* Buttons */
.btn {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm) var(--spacing-lg);
  border-radius: var(--border-radius);
  font-size: 14px;
  font-weight: 500;
  font-family: var(--font-family);
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
}

.btn-primary {
  background-color: var(--primary-green);
  color: var(--bg-white);
}

.btn-primary:hover {
  background-color: var(--status-positive);
  transform: translateY(-1px);
}

.btn-secondary {
  background-color: transparent;
  color: var(--text-gray);
  border: 1px solid var(--border-light);
}

.btn-secondary:hover {
  background-color: var(--bg-elevated);
  border-color: var(--border-strong);
}

.btn-outline {
  background: transparent;
  color: var(--primary-green);
  border: 1px solid var(--primary-green);
  width: 100%;
  justify-content: center;
}

.btn-outline:hover {
  background-color: var(--primary-green);
  color: var(--bg-white);
}

/* Tabs */
.tabs-container {
  display: flex;
  gap: var(--spacing-sm);
  border-bottom: 1px solid var(--border-light);
}

.tab-button {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-md) var(--spacing-lg);
  background: transparent;
  border: none;
  border-bottom: 2px solid transparent;
  color: var(--text-gray);
  font-size: 14px;
  font-weight: 500;
  font-family: var(--font-family);
  cursor: pointer;
  transition: all 0.2s ease;
}

.tab-button:hover {
  color: var(--text-main);
  background-color: var(--bg-elevated);
}

.tab-button.active {
  color: var(--primary-green);
  border-bottom-color: var(--primary-green);
}

/* Tab Content */
.tab-content {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
  overflow-y: auto;
  max-height: calc(100vh - 300px);
}

/* Filter Bar */
.filter-bar {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.search-box {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm) var(--spacing-md);
  background-color: var(--bg-white);
  border: 1px solid var(--border-light);
  border-radius: var(--border-radius);
}

.search-icon {
  color: var(--text-gray);
}

.search-input {
  flex: 1;
  border: none;
  outline: none;
  font-size: 14px;
  font-family: var(--font-family);
  color: var(--text-main);
}

.category-filter {
  display: flex;
  gap: var(--spacing-sm);
  flex-wrap: wrap;
}

.category-button {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-xs) var(--spacing-md);
  background-color: var(--bg-white);
  border: 1px solid var(--border-light);
  border-radius: var(--border-radius-sm);
  font-size: 12px;
  font-family: var(--font-family);
  color: var(--text-gray);
  cursor: pointer;
  transition: all 0.2s ease;
}

.category-button:hover {
  border-color: var(--primary-green);
  color: var(--primary-green);
}

.category-button.active {
  background-color: var(--primary-green);
  color: var(--bg-white);
  border-color: var(--primary-green);
}

/* Skills Grid */
.skills-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: var(--spacing-md);
}

.skill-card {
  background-color: var(--bg-white);
  border: 1px solid var(--border-light);
  border-radius: var(--border-radius);
  padding: var(--spacing-md);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  transition: all 0.2s ease;
}

.skill-card:hover {
  box-shadow: var(--shadow-card);
  transform: translateY(-2px);
}

.skill-card.disabled {
  opacity: 0.6;
}

.skill-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: var(--spacing-md);
}

.skill-title-group {
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-sm);
  flex: 1;
}

.skill-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  flex-shrink: 0;
  margin-top: 4px;
}

.skill-name {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-main);
  margin: 0;
  font-family: var(--font-family);
}

.skill-description {
  font-size: 13px;
  color: var(--text-gray);
  margin: 4px 0 0 0;
  font-family: var(--font-family);
}

.skill-actions {
  display: flex;
  gap: var(--spacing-xs);
}

.icon-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  border-radius: var(--border-radius-sm);
  color: var(--text-gray);
  cursor: pointer;
  transition: all 0.2s ease;
}

.icon-button:hover {
  background-color: var(--bg-elevated);
  color: var(--primary-green);
}

.icon-button.danger:hover {
  background-color: var(--accent-warm);
  color: var(--accent-warm-red);
}

.skill-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  color: var(--text-gray);
  font-family: var(--font-family);
}

.skill-category {
  padding: 2px 8px;
  background-color: var(--bg-elevated);
  border-radius: var(--border-radius-sm);
}

.skill-tags {
  display: flex;
  gap: var(--spacing-xs);
  flex-wrap: wrap;
}

.tag {
  padding: 2px 8px;
  background-color: var(--accent-light);
  border-radius: var(--border-radius-sm);
  font-size: 11px;
  color: var(--text-main);
  font-family: var(--font-family);
}

/* Templates Grid */
.templates-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: var(--spacing-md);
}

.template-card {
  background-color: var(--bg-white);
  border: 1px solid var(--border-light);
  border-radius: var(--border-radius);
  padding: var(--spacing-lg);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.template-header {
  display: flex;
  gap: var(--spacing-md);
}

.template-icon {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--bg-elevated);
  border-radius: var(--border-radius);
  color: var(--primary-green);
  flex-shrink: 0;
}

.template-info {
  flex: 1;
}

.template-name {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-main);
  margin: 0;
  font-family: var(--font-family);
}

.template-description {
  font-size: 13px;
  color: var(--text-gray);
  margin: 4px 0 0 0;
  font-family: var(--font-family);
}

.template-meta {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: var(--text-gray);
  font-family: var(--font-family);
}

/* History List */
.history-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.history-item {
  display: flex;
  gap: var(--spacing-md);
  padding: var(--spacing-md);
  background-color: var(--bg-white);
  border: 1px solid var(--border-light);
  border-radius: var(--border-radius);
}

.history-icon {
  flex-shrink: 0;
  color: var(--status-success);
}

.history-item:has(.history-icon:has(.x-circle)) .history-icon {
  color: var(--status-negative);
}

.history-content {
  flex: 1;
}

.history-header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-xs);
}

.history-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-main);
  margin: 0;
  font-family: var(--font-family);
}

.history-time {
  font-size: 12px;
  color: var(--text-gray);
  font-family: var(--font-family);
}

.history-summary {
  font-size: 13px;
  color: var(--text-main);
  margin: var(--spacing-xs) 0;
  font-family: var(--font-family);
}

.history-meta {
  display: flex;
  gap: var(--spacing-md);
  font-size: 12px;
  color: var(--text-gray);
  font-family: var(--font-family);
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: var(--spacing-lg);
}

.modal-container {
  background: var(--bg-white);
  border-radius: var(--border-radius-lg);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  width: 100%;
  max-width: 500px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-lg);
  border-bottom: 1px solid var(--border-light);
}

.modal-title {
  font-size: 18px;
  font-weight: 600;
  margin: 0;
  font-family: var(--font-family);
  color: var(--text-main);
}

.modal-body {
  padding: var(--spacing-lg);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.form-label {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-main);
  font-family: var(--font-family);
}

.form-input,
.form-select,
.form-textarea {
  padding: var(--spacing-sm) var(--spacing-md);
  border: 1px solid var(--border-light);
  border-radius: var(--border-radius);
  font-size: 14px;
  font-family: var(--font-family);
  color: var(--text-main);
  outline: none;
  transition: border-color 0.2s ease;
}

.form-input:focus,
.form-select:focus,
.form-textarea:focus {
  border-color: var(--primary-green);
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: var(--spacing-md);
  padding: var(--spacing-lg);
  border-top: 1px solid var(--border-light);
}

/* Modal Transition */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-active .modal-container,
.modal-leave-active .modal-container {
  transition: transform 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-container,
.modal-leave-to .modal-container {
  transform: scale(0.9);
}
</style>
