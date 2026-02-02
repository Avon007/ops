<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import {
  Brain,
  Plus,
  Search,
  Filter,
  Play,
  Edit,
  Trash2,
  Clock,
  CheckCircle,
  XCircle,
  TrendingUp,
  FileText,
  Zap,
  AlertTriangle,
  Database,
  Settings,
  Save,
  X
} from 'lucide-vue-next'
import type { SkillRule, SkillTemplate, SkillExecutionResult } from '@/types'
import {
  skillRules,
  skillTemplates,
  skillExecutionHistory,
  operatorProfiles
} from '@/mock/skillLibrary'
import {
  executeSkillRule,
  filterRulesByCategory,
  searchSkillRules,
  createRuleFromTemplate
} from '@/services/skillEngine'

// Props
interface Props {
  hideHeader?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  hideHeader: false
})

// Tab state
const activeTab = ref<'my-skills' | 'templates' | 'history'>('my-skills')

// Data
const rules = ref<SkillRule[]>([...skillRules])
const templates = ref<SkillTemplate[]>([...skillTemplates])
const history = ref<SkillExecutionResult[]>([...skillExecutionHistory])
const currentUser = operatorProfiles[0]

// Search and filter
const searchTerm = ref('')
const selectedCategory = ref<string>('all')

// Dialog states
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

// Computed properties
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

const categories = [
  { value: 'all', label: '全部' },
  { value: 'performance', label: '性能' },
  { value: 'availability', label: '可用性' },
  { value: 'integration', label: '集成' },
  { value: 'security', label: '安全' },
  { value: 'capacity', label: '容量' },
  { value: 'network_block', label: '网络' }
]

const categoryIcon = (category: string) => {
  switch (category) {
    case 'performance':
      return TrendingUp
    case 'availability':
      return CheckCircle
    case 'integration':
      return Zap
    case 'security':
      return AlertTriangle
    case 'capacity':
      return Database
    case 'network_block':
      return Settings
    default:
      return Settings
  }
}

// Actions
const handleExecuteRule = (rule: SkillRule) => {
  const result = executeSkillRule(rule)

  // Update rule stats
  const ruleIndex = rules.value.findIndex(r => r.id === rule.id)
  if (ruleIndex !== -1) {
    rules.value[ruleIndex].executionCount++
    rules.value[ruleIndex].lastExecutedAt = result.executedAt
    if (result.status === 'success') {
      rules.value[ruleIndex].successCount++
    }
  }

  // Add to history
  history.value.unshift(result)

  // Show notification
  alert(`技能规则 "${rule.name}" 执行完成！\n\n${result.summary}`)
}

const handleCreateRule = () => {
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

const handleEditRule = (rule: SkillRule) => {
  selectedRule.value = rule
  editingRule.value = { ...rule }
  showEditDialog.value = true
}

const handleDeleteRule = (rule: SkillRule) => {
  if (confirm(`确定要删除技能规则 "${rule.name}" 吗？`)) {
    rules.value = rules.value.filter(r => r.id !== rule.id)
  }
}

const handleCreateFromTemplate = (template: SkillTemplate) => {
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

const handleSaveRule = () => {
  if (showTemplateDialog.value && selectedTemplate.value) {
    // Create from template
    const newRule = createRuleFromTemplate(
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
    rules.value.push(newRule)
    showTemplateDialog.value = false
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
    rules.value.push(newRule)
    showCreateDialog.value = false
  } else if (showEditDialog.value && selectedRule.value) {
    // Update existing rule
    const index = rules.value.findIndex(r => r.id === selectedRule.value!.id)
    if (index !== -1) {
      rules.value[index] = {
        ...rules.value[index],
        ...editingRule.value,
        modifiedBy: currentUser.id,
        modifiedAt: new Date().toISOString(),
        version: rules.value[index].version + 1
      }
    }
    showEditDialog.value = false
  }
}

const handleToggleEnabled = (rule: SkillRule) => {
  const index = rules.value.findIndex(r => r.id === rule.id)
  if (index !== -1) {
    rules.value[index].enabled = !rules.value[index].enabled
  }
}

// Expose methods to parent component
defineExpose({
  handleCreateRule
})

onMounted(() => {
  console.log('📚 Skill Library loaded')
  console.log(`Rules: ${rules.value.length}`)
  console.log(`Templates: ${templates.value.length}`)
  console.log(`History: ${history.value.length}`)
})
</script>

<template>
  <div class="skill-library">
    <!-- Header -->
    <div v-if="!hideHeader" class="skill-header">
      <div class="header-left">
        <Brain class="header-icon" :size="24" />
        <div>
          <h1 class="header-title">专家技能知识库</h1>
          <p class="header-subtitle">管理和执行诊断技能规则</p>
        </div>
      </div>
      <div class="header-actions">
        <button class="btn btn-primary" @click="handleCreateRule">
          <Plus :size="16" />
          <span>创建技能</span>
        </button>
      </div>
    </div>

    <!-- Tabs -->
    <div class="tabs">
      <button
        class="tab"
        :class="{ active: activeTab === 'my-skills' }"
        @click="activeTab = 'my-skills'"
      >
        <Brain :size="16" />
        <span>我的技能 ({{ rules.length }})</span>
      </button>
      <button
        class="tab"
        :class="{ active: activeTab === 'templates' }"
        @click="activeTab = 'templates'"
      >
        <FileText :size="16" />
        <span>模板库 ({{ templates.length }})</span>
      </button>
      <button
        class="tab"
        :class="{ active: activeTab === 'history' }"
        @click="activeTab = 'history'"
      >
        <Clock :size="16" />
        <span>执行历史 ({{ history.length }})</span>
      </button>
    </div>

    <!-- My Skills Tab -->
    <div v-if="activeTab === 'my-skills'" class="tab-content">
      <!-- Search and Filter -->
      <div class="filter-bar">
        <div class="search-box">
          <Search :size="18" class="search-icon" />
          <input
            v-model="searchTerm"
            type="text"
            placeholder="搜索技能规则..."
            class="search-input"
          />
        </div>
        <div class="category-filters">
          <button
            v-for="cat in categories"
            :key="cat.value"
            class="category-btn"
            :class="{ active: selectedCategory === cat.value }"
            @click="selectedCategory = cat.value"
          >
            {{ cat.label }}
          </button>
        </div>
      </div>

      <!-- Skills Grid -->
      <div v-if="filteredRules.length > 0" class="skills-grid">
        <div
          v-for="rule in filteredRules"
          :key="rule.id"
          class="skill-card"
          :class="{ disabled: !rule.enabled }"
        >
          <!-- Card Header -->
          <div class="card-header">
            <div class="header-left">
              <component
                :is="categoryIcon(rule.category)"
                class="category-icon"
                :size="20"
              />
              <div>
                <h3 class="skill-name">{{ rule.name }}</h3>
                <p class="skill-description">{{ rule.description }}</p>
              </div>
            </div>
            <div class="header-right">
              <button
                class="icon-btn"
                :class="{ active: rule.enabled }"
                @click="handleToggleEnabled(rule)"
                title="启用/禁用"
              >
                <component :is="rule.enabled ? CheckCircle : XCircle" :size="18" />
              </button>
            </div>
          </div>

          <!-- Card Body -->
          <div class="card-body">
            <div class="skill-info">
              <div class="info-item">
                <span class="info-label">类别:</span>
                <span class="info-value">{{ categories.find(c => c.value === rule.category)?.label }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">创建者:</span>
                <span class="info-value">{{ rule.creatorName }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">适用系统:</span>
                <span class="info-value">{{ rule.applicableSystems.length }} 个</span>
              </div>
              <div class="info-item">
                <span class="info-label">版本:</span>
                <span class="info-value">v{{ rule.version }}</span>
              </div>
            </div>

            <div class="skill-stats">
              <div class="stat-item">
                <TrendingUp :size="16" />
                <div>
                  <div class="stat-value">{{ rule.executionCount }}</div>
                  <div class="stat-label">执行次数</div>
                </div>
              </div>
              <div class="stat-item">
                <CheckCircle :size="16" />
                <div>
                  <div class="stat-value">{{ rule.successCount }}</div>
                  <div class="stat-label">成功次数</div>
                </div>
              </div>
              <div class="stat-item">
                <AlertTriangle :size="16" />
                <div>
                  <div class="stat-value">{{ (rule.falsePositiveRate * 100).toFixed(0) }}%</div>
                  <div class="stat-label">误报率</div>
                </div>
              </div>
            </div>

            <div v-if="rule.tags && rule.tags.length > 0" class="skill-tags">
              <span v-for="tag in rule.tags" :key="tag" class="tag">{{ tag }}</span>
            </div>
          </div>

          <!-- Card Footer -->
          <div class="card-footer">
            <div class="footer-left">
              <span v-if="rule.validated" class="validation-badge">
                <CheckCircle :size="12" />
                已验证
              </span>
              <span v-if="rule.lastExecutedAt" class="last-executed">
                <Clock :size="12" />
                {{ new Date(rule.lastExecutedAt).toLocaleDateString('zh-CN') }}
              </span>
            </div>
            <div class="footer-right">
              <button
                class="action-btn execute-btn"
                @click="handleExecuteRule(rule)"
                :disabled="!rule.enabled"
              >
                <Play :size="14" />
                执行
              </button>
              <button class="action-btn" @click="handleEditRule(rule)">
                <Edit :size="14" />
                编辑
              </button>
              <button class="action-btn danger-btn" @click="handleDeleteRule(rule)">
                <Trash2 :size="14" />
                删除
              </button>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="empty-state">
        <Brain :size="48" />
        <p>没有找到技能规则</p>
        <button class="btn btn-primary" @click="handleCreateRule">
          <Plus :size="16" />
          创建第一个技能规则
        </button>
      </div>
    </div>

    <!-- Templates Tab -->
    <div v-if="activeTab === 'templates'" class="tab-content">
      <div class="templates-grid">
        <div
          v-for="template in templates"
          :key="template.id"
          class="template-card"
        >
          <div class="template-header">
            <div class="template-icon">
              <component :is="categoryIcon(template.category)" :size="24" />
            </div>
            <div class="template-badge">
              {{ template.isSystemTemplate ? '系统模板' : '自定义' }}
            </div>
          </div>

          <h3 class="template-name">{{ template.name }}</h3>
          <p class="template-description">{{ template.description }}</p>

          <div class="template-stats">
            <div class="template-stat">
              <span class="stat-number">{{ template.useCases.length }}</span>
              <span class="stat-text">适用场景</span>
            </div>
            <div class="template-stat">
              <span class="stat-number">{{ template.usageCount }}</span>
              <span class="stat-text">使用次数</span>
            </div>
          </div>

          <div class="template-use-cases">
            <div v-for="useCase in template.useCases.slice(0, 3)" :key="useCase" class="use-case">
              {{ useCase }}
            </div>
          </div>

          <button class="btn btn-primary full-width" @click="handleCreateFromTemplate(template)">
            <Plus :size="16" />
            使用此模板
          </button>
        </div>
      </div>
    </div>

    <!-- History Tab -->
    <div v-if="activeTab === 'history'" class="tab-content">
      <div class="history-list">
        <div
          v-for="execution in history"
          :key="execution.executionId"
          class="history-item"
        >
          <div class="history-header">
            <div class="history-title">
              <Play :size="16" />
              <span>{{ execution.ruleName }}</span>
            </div>
            <div class="history-status">
              <span
                class="status-badge"
                :class="execution.status"
              >
                {{ execution.status === 'success' ? '成功' : execution.status === 'failed' ? '失败' : '部分成功' }}
              </span>
            </div>
          </div>

          <div class="history-body">
            <div class="history-summary">{{ execution.summary }}</div>
            <div class="history-meta">
              <span class="meta-item">
                <Clock :size="14" />
                {{ new Date(execution.executedAt).toLocaleString('zh-CN') }}
              </span>
              <span class="meta-item">
                <CheckCircle :size="14" />
                置信度: {{ (execution.confidence * 100).toFixed(0) }}%
              </span>
              <span class="meta-item">
                <TrendingUp :size="14" />
                耗时: {{ (execution.totalDuration / 1000).toFixed(1) }}s
              </span>
            </div>
          </div>

          <div v-if="execution.recommendations && execution.recommendations.length > 0" class="history-recommendations">
            <div class="recommendations-title">建议:</div>
            <ul class="recommendations-list">
              <li v-for="rec in execution.recommendations" :key="rec">{{ rec }}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <!-- Create/Edit Dialog -->
    <div v-if="showCreateDialog || showEditDialog" class="dialog-overlay" @click.self="showCreateDialog = showEditDialog = false">
      <div class="dialog">
        <div class="dialog-header">
          <h2>{{ showEditDialog ? '编辑技能规则' : '创建技能规则' }}</h2>
          <button class="close-btn" @click="showCreateDialog = showEditDialog = false">
            <X :size="20" />
          </button>
        </div>

        <div class="dialog-body">
          <div class="form-group">
            <label>技能名称</label>
            <input v-model="editingRule.name" type="text" class="form-input" placeholder="输入技能名称" />
          </div>

          <div class="form-group">
            <label>描述</label>
            <textarea v-model="editingRule.description" class="form-textarea" placeholder="输入技能描述" rows="3"></textarea>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>类别</label>
              <select v-model="editingRule.category" class="form-select">
                <option value="performance">性能</option>
                <option value="availability">可用性</option>
                <option value="integration">集成</option>
                <option value="security">安全</option>
                <option value="capacity">容量</option>
              </select>
            </div>

            <div class="form-group">
              <label>状态</label>
              <label class="checkbox-label">
                <input v-model="editingRule.enabled" type="checkbox" />
                <span>启用</span>
              </label>
            </div>
          </div>

          <div class="form-group">
            <label>标签 (用逗号分隔)</label>
            <input
              v-model="editingRule.tags"
              type="text"
              class="form-input"
              placeholder="例如: CPU, 性能, ERP"
            />
          </div>

          <div class="info-box">
            <AlertTriangle :size="16" />
            <span>完整的技能规则配置（触发条件、诊断步骤、执行动作）需要在编辑器中完成</span>
          </div>
        </div>

        <div class="dialog-footer">
          <button class="btn btn-secondary" @click="showCreateDialog = showEditDialog = false">
            取消
          </button>
          <button class="btn btn-primary" @click="handleSaveRule">
            <Save :size="16" />
            保存
          </button>
        </div>
      </div>
    </div>

    <!-- Template Dialog -->
    <div v-if="showTemplateDialog" class="dialog-overlay" @click.self="showTemplateDialog = false">
      <div class="dialog">
        <div class="dialog-header">
          <h2>从模板创建技能规则</h2>
          <button class="close-btn" @click="showTemplateDialog = false">
            <X :size="20" />
          </button>
        </div>

        <div class="dialog-body">
          <div class="form-group">
            <label>技能名称</label>
            <input v-model="editingRule.name" type="text" class="form-input" />
          </div>

          <div class="form-group">
            <label>描述</label>
            <textarea v-model="editingRule.description" class="form-textarea" rows="3"></textarea>
          </div>

          <div class="info-box success">
            <CheckCircle :size="16" />
            <span>模板 "{{ selectedTemplate?.name }}" 已应用。触发条件、诊断步骤和执行动作已预配置。</span>
          </div>
        </div>

        <div class="dialog-footer">
          <button class="btn btn-secondary" @click="showTemplateDialog = false">
            取消
          </button>
          <button class="btn btn-primary" @click="handleSaveRule">
            <Save :size="16" />
            创建
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.skill-library {
  padding: var(--spacing-2xl);
  max-width: 1600px;
  margin: 0 auto;
}

.skill-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-2xl);
  padding-bottom: var(--spacing-xl);
  border-bottom: 1px solid var(--border-light);
}

.header-left {
  display: flex;
  align-items: center;
  gap: var(--spacing-lg);
}

.header-icon {
  color: var(--primary-green);
}

.header-title {
  font-size: 24px;
  font-weight: 700;
  color: var(--text-main);
  margin: 0;
}

.header-subtitle {
  font-size: 14px;
  color: var(--text-light);
  margin: 4px 0 0 0;
}

.header-actions {
  display: flex;
  gap: var(--spacing-md);
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm) var(--spacing-lg);
  border-radius: var(--border-radius);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
}

.btn-primary {
  background-color: var(--primary-green);
  color: white;
}

.btn-primary:hover {
  background-color: var(--accent-dark);
}

.btn-secondary {
  background-color: var(--bg-elevated);
  color: var(--text-main);
  border: 1px solid var(--border-color);
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.tabs {
  display: flex;
  gap: var(--spacing-xs);
  margin-bottom: var(--spacing-2xl);
  border-bottom: 1px solid var(--border-light);
}

.tab {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-md) var(--spacing-lg);
  border: none;
  background: none;
  border-bottom: 2px solid transparent;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  color: var(--text-gray);
  transition: all 0.2s ease;
}

.tab:hover {
  color: var(--text-main);
}

.tab.active {
  color: var(--primary-green);
  border-bottom-color: var(--primary-green);
}

.tab-content {
  min-height: 400px;
}

.filter-bar {
  display: flex;
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-xl);
  align-items: center;
}

.search-box {
  position: relative;
  flex: 1;
  max-width: 400px;
}

.search-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-light);
}

.search-input {
  width: 100%;
  padding: 10px 12px 10px 40px;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  font-size: 14px;
  background-color: var(--bg-white);
  color: var(--text-main);
}

.search-input:focus {
  outline: none;
  border-color: var(--primary-green);
}

.category-filters {
  display: flex;
  gap: var(--spacing-xs);
}

.category-btn {
  padding: 8px 16px;
  border: 1px solid var(--border-color);
  background-color: var(--bg-white);
  border-radius: var(--border-radius);
  font-size: 13px;
  font-weight: 500;
  color: var(--text-gray);
  cursor: pointer;
  transition: all 0.2s ease;
}

.category-btn:hover {
  background-color: var(--bg-elevated);
  color: var(--text-main);
}

.category-btn.active {
  background-color: var(--primary-green);
  color: white;
  border-color: var(--primary-green);
}

.skills-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: var(--spacing-md);
}

.skill-card {
  background-color: var(--bg-white);
  border: 1px solid var(--border-light);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-md);
  transition: all 0.2s ease;
}

.skill-card:hover {
  border-color: var(--primary-green);
  box-shadow: var(--shadow-md);
}

.skill-card.disabled {
  opacity: 0.6;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: var(--spacing-sm);
}

.card-header .header-left {
  display: flex;
  gap: var(--spacing-sm);
  align-items: flex-start;
}

.category-icon {
  color: var(--primary-green);
  flex-shrink: 0;
  margin-top: 2px;
}

.skill-name {
  font-size: 15px;
  font-weight: 600;
  color: var(--text-main);
  margin: 0 0 3px 0;
  line-height: 1.3;
}

.skill-description {
  font-size: 12px;
  color: var(--text-gray);
  margin: 0;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.header-right {
  display: flex;
  gap: var(--spacing-xs);
}

.icon-btn {
  padding: 6px;
  border: 1px solid var(--border-light);
  background-color: var(--bg-white);
  border-radius: var(--border-radius-sm);
  cursor: pointer;
  color: var(--text-light);
  transition: all 0.2s ease;
}

.icon-btn:hover {
  background-color: var(--bg-elevated);
  color: var(--text-main);
}

.icon-btn.active {
  color: var(--status-success);
  border-color: var(--status-success);
}

.card-body {
  margin-bottom: var(--spacing-sm);
}

.skill-info {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--spacing-xs) var(--spacing-sm);
  margin-bottom: var(--spacing-sm);
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.info-label {
  font-size: 10px;
  color: var(--text-light);
  font-weight: 500;
}

.info-value {
  font-size: 12px;
  color: var(--text-main);
  font-weight: 500;
}

.skill-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--spacing-xs);
  margin-bottom: var(--spacing-sm);
  padding: var(--spacing-sm);
  background-color: var(--bg-elevated);
  border-radius: var(--border-radius-sm);
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 4px;
  color: var(--text-gray);
}

.stat-value {
  font-size: 16px;
  font-weight: 700;
  color: var(--text-main);
  line-height: 1;
}

.stat-label {
  font-size: 10px;
  color: var(--text-light);
}

.skill-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.tag {
  padding: 3px 8px;
  background-color: var(--accent-light);
  border-radius: var(--border-radius-sm);
  font-size: 10px;
  font-weight: 500;
  color: var(--primary-green);
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: var(--spacing-sm);
  border-top: 1px solid var(--border-light);
}

.footer-left {
  display: flex;
  gap: var(--spacing-sm);
  align-items: center;
}

.validation-badge {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  padding: 3px 6px;
  background-color: var(--status-success-bg);
  border-radius: var(--border-radius-sm);
  font-size: 10px;
  font-weight: 500;
  color: var(--status-success);
}

.last-executed {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  font-size: 11px;
  color: var(--text-light);
}

.footer-right {
  display: flex;
  gap: 4px;
}

.action-btn {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  padding: 5px 10px;
  border: 1px solid var(--border-color);
  background-color: var(--bg-white);
  border-radius: var(--border-radius-sm);
  font-size: 11px;
  font-weight: 500;
  color: var(--text-gray);
  cursor: pointer;
  transition: all 0.2s ease;
}

.action-btn:hover {
  background-color: var(--bg-elevated);
  color: var(--text-main);
}

.action-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.execute-btn {
  background-color: var(--primary-green);
  color: white;
  border-color: var(--primary-green);
}

.execute-btn:hover:not(:disabled) {
  background-color: var(--accent-dark);
}

.danger-btn:hover {
  background-color: var(--status-error-bg);
  color: var(--status-error);
  border-color: var(--status-error);
}

.templates-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: var(--spacing-xl);
}

.template-card {
  background-color: var(--bg-white);
  border: 1px solid var(--border-light);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-xl);
  transition: all 0.2s ease;
}

.template-card:hover {
  border-color: var(--primary-green);
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}

.template-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-md);
}

.template-icon {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--accent-light);
  border-radius: var(--border-radius);
  color: var(--primary-green);
}

.template-badge {
  padding: 4px 10px;
  background-color: var(--bg-elevated);
  border-radius: var(--border-radius-sm);
  font-size: 11px;
  font-weight: 500;
  color: var(--text-gray);
}

.template-name {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-main);
  margin: 0 0 var(--spacing-sm) 0;
}

.template-description {
  font-size: 13px;
  color: var(--text-gray);
  margin: 0 0 var(--spacing-lg) 0;
  line-height: 1.5;
  min-height: 40px;
}

.template-stats {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-lg);
  padding: var(--spacing-md);
  background-color: var(--bg-elevated);
  border-radius: var(--border-radius);
}

.template-stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.stat-number {
  font-size: 24px;
  font-weight: 700;
  color: var(--primary-green);
}

.stat-text {
  font-size: 12px;
  color: var(--text-light);
}

.template-use-cases {
  margin-bottom: var(--spacing-lg);
}

.use-case {
  padding: 8px 12px;
  background-color: var(--bg-elevated);
  border-radius: var(--border-radius-sm);
  font-size: 12px;
  color: var(--text-gray);
  margin-bottom: var(--spacing-xs);
}

.full-width {
  width: 100%;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-2xl);
  color: var(--text-light);
  gap: var(--spacing-lg);
}

.empty-state svg {
  color: var(--text-quaternary);
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.history-item {
  background-color: var(--bg-white);
  border: 1px solid var(--border-light);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-lg);
}

.history-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-md);
}

.history-title {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  font-size: 16px;
  font-weight: 600;
  color: var(--text-main);
}

.status-badge {
  padding: 4px 12px;
  border-radius: var(--border-radius-sm);
  font-size: 12px;
  font-weight: 500;
}

.status-badge.success {
  background-color: var(--status-success-bg);
  color: var(--status-success);
}

.status-badge.failed {
  background-color: var(--status-error-bg);
  color: var(--status-error);
}

.status-badge.partial_success {
  background-color: var(--status-warning-bg);
  color: var(--status-warning);
}

.history-body {
  margin-bottom: var(--spacing-md);
}

.history-summary {
  font-size: 14px;
  color: var(--text-main);
  margin-bottom: var(--spacing-sm);
  line-height: 1.5;
}

.history-meta {
  display: flex;
  gap: var(--spacing-lg);
  flex-wrap: wrap;
}

.meta-item {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: var(--text-light);
}

.history-recommendations {
  padding: var(--spacing-md);
  background-color: var(--bg-elevated);
  border-radius: var(--border-radius);
}

.recommendations-title {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-main);
  margin-bottom: var(--spacing-sm);
}

.recommendations-list {
  margin: 0;
  padding-left: var(--spacing-lg);
  font-size: 13px;
  color: var(--text-gray);
}

.recommendations-list li {
  margin-bottom: 4px;
}

/* Dialog Styles */
.dialog-overlay {
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
  padding: var(--spacing-xl);
}

.dialog {
  background-color: var(--bg-white);
  border-radius: var(--border-radius-lg);
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow: auto;
  box-shadow: var(--shadow-lg);
}

.dialog-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-lg);
  border-bottom: 1px solid var(--border-light);
}

.dialog-header h2 {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-main);
  margin: 0;
}

.close-btn {
  padding: 4px;
  border: none;
  background: none;
  cursor: pointer;
  color: var(--text-light);
}

.close-btn:hover {
  color: var(--text-main);
}

.dialog-body {
  padding: var(--spacing-lg);
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: var(--spacing-md);
  padding: var(--spacing-lg);
  border-top: 1px solid var(--border-light);
}

.form-group {
  margin-bottom: var(--spacing-md);
}

.form-row {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--spacing-md);
}

.form-group label {
  display: block;
  font-size: 13px;
  font-weight: 500;
  color: var(--text-main);
  margin-bottom: var(--spacing-xs);
}

.form-input,
.form-textarea,
.form-select {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  font-size: 14px;
  background-color: var(--bg-white);
  color: var(--text-main);
  font-family: inherit;
}

.form-input:focus,
.form-textarea:focus,
.form-select:focus {
  outline: none;
  border-color: var(--primary-green);
}

.form-textarea {
  resize: vertical;
  min-height: 80px;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  cursor: pointer;
  user-select: none;
}

.checkbox-label input[type="checkbox"] {
  width: 18px;
  height: 18px;
  cursor: pointer;
}

.info-box {
  display: flex;
  gap: var(--spacing-sm);
  padding: var(--spacing-md);
  background-color: var(--status-warning-bg);
  border-radius: var(--border-radius);
  font-size: 13px;
  color: var(--status-warning);
  align-items: flex-start;
}

.info-box.success {
  background-color: var(--status-success-bg);
  color: var(--status-success);
}
</style>
