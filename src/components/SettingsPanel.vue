<script setup lang="ts">
import { ref, onMounted } from 'vue'
import {
  Settings,
  RotateCcw,
  Download,
  Upload,
  X,
  Check
} from 'lucide-vue-next'
import { useSettingsStore } from '@/stores/settings'
import { useSettingsDialog, useSettingsOptions } from '@/composables'
import type { LayoutMode, CardSize } from '@/types'

// Props
interface Props {
  modelValue: boolean
}

defineProps<Props>()
const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

// Store & Composables
const settingsStore = useSettingsStore()
const { activeTab, saveStatus, showSaved, setActiveTab } = useSettingsDialog()
const { layoutOptions, cardSizeOptions, fontSizeOptions, tabs } = useSettingsOptions()

// Local state
const importInput = ref<HTMLInputElement>()
const showResetConfirm = ref(false)

// Methods
const close = () => {
  emit('update:modelValue', false)
}

const handleLayoutModeChange = (mode: LayoutMode) => {
  settingsStore.setLayoutMode(mode)
  showSaved()
}

const handleCardSizeChange = (size: CardSize) => {
  settingsStore.setCardSize(size)
  showSaved()
}

const handleCardsPerRowChange = (count: number) => {
  settingsStore.setCardsPerRow(count)
  showSaved()
}

const handleCompactModeToggle = () => {
  settingsStore.setCompactMode(!settingsStore.isCompactMode)
  showSaved()
}

const handleAnimationsToggle = () => {
  settingsStore.setAnimations(!settingsStore.animationsEnabled)
  showSaved()
}

const handleFontSizeChange = (size: 'small' | 'medium' | 'large' | 'extra-large') => {
  settingsStore.setFontSize(size)
  showSaved()
}

const handleShowElementToggle = (key: keyof typeof settingsStore.preferences.display) => {
  if (key.startsWith('show')) {
    const newValue = !settingsStore.preferences.display[key]
    settingsStore.updatePreferences({
      display: { ...settingsStore.preferences.display, [key]: newValue }
    })
    showSaved()
  }
}

const handleNotificationToggle = (key: keyof typeof settingsStore.preferences.notifications) => {
  const newValue = !settingsStore.preferences.notifications[key]
  settingsStore.updatePreferences({
    notifications: { ...settingsStore.preferences.notifications, [key]: newValue }
  })
  showSaved()
}

const handleRefreshIntervalChange = (interval: number) => {
  settingsStore.updatePreferences({
    dataRefresh: { ...settingsStore.preferences.dataRefresh, interval }
  })
  showSaved()
}

const handleExport = () => {
  const json = settingsStore.exportPreferences()
  const blob = new Blob([json], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `ops-assistant-preferences-${new Date().toISOString().split('T')[0]}.json`
  a.click()
  URL.revokeObjectURL(url)
}

const handleImport = () => {
  importInput.value?.click()
}

const handleImportFile = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = (e) => {
    const content = e.target?.result as string
    if (settingsStore.importPreferences(content)) {
      showSaved()
    } else {
      // Show error status
      saveStatus.value = 'error'
      setTimeout(() => (saveStatus.value = 'idle'), 2000)
    }
  }
  reader.readAsText(file)
}

const handleReset = () => {
  settingsStore.resetPreferences()
  showResetConfirm.value = false
  showSaved()
}

// Lifecycle - sync active tab when dialog opens
onMounted(() => {
  // Load preferences on mount
  settingsStore.loadPreferences()
})
</script>

<template>
  <div v-if="modelValue" class="settings-overlay" @click.self="close">
    <div class="settings-panel">
      <!-- Header -->
      <div class="settings-header">
        <div class="header-left">
          <Settings :size="24" />
          <h2>个性化设置</h2>
        </div>
        <div class="header-right">
          <div v-if="saveStatus === 'saved'" class="save-status success">
            <Check :size="16" />
            <span>已保存</span>
          </div>
          <div v-if="saveStatus === 'error'" class="save-status error">
            <X :size="16" />
            <span>保存失败</span>
          </div>
          <button class="icon-button" @click="close" title="关闭">
            <X :size="20" />
          </button>
        </div>
      </div>

      <!-- Content -->
      <div class="settings-content">
        <!-- Tabs -->
        <div class="settings-tabs">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            :class="['tab-button', { active: activeTab === tab.id }]"
            @click="setActiveTab(tab.id)"
          >
            <component :is="tab.icon" :size="18" />
            <span>{{ tab.name }}</span>
          </button>
        </div>

        <!-- Tab Content -->
        <div class="settings-body">
          <!-- Layout Tab -->
          <div v-if="activeTab === 'layout'" class="tab-content">
            <h3>布局模式</h3>
            <div class="option-grid">
              <button
                v-for="option in layoutOptions"
                :key="option.value"
                :class="['option-card', { active: settingsStore.layoutMode === option.value }]"
                @click="handleLayoutModeChange(option.value)"
              >
                <component :is="option.icon" :size="24" />
                <div class="option-info">
                  <span class="option-name">{{ option.name }}</span>
                  <span class="option-description">{{ option.description }}</span>
                </div>
              </button>
            </div>

            <h3>卡片设置</h3>
            <div class="settings-section">
              <label>卡片大小</label>
              <div class="button-group">
                <button
                  v-for="option in cardSizeOptions"
                  :key="option.value"
                  :class="['button-option', { active: settingsStore.cardSize === option.value }]"
                  @click="handleCardSizeChange(option.value)"
                >
                  {{ option.name }}
                </button>
              </div>
            </div>

            <div class="settings-section">
              <label>每行卡片数 (1-6)</label>
              <input
                type="range"
                min="1"
                max="6"
                :value="settingsStore.preferences.layout.cardsPerRow"
                @input="handleCardsPerRowChange(Number(($event.target as HTMLInputElement).value))"
                class="range-input"
              />
              <span class="range-value">{{ settingsStore.preferences.layout.cardsPerRow }}</span>
            </div>

            <div class="settings-section">
              <label class="checkbox-label">
                <input
                  type="checkbox"
                  :checked="settingsStore.preferences.layout.sidebarCollapsed"
                  @change="settingsStore.toggleSidebar"
                />
                <span>折叠侧边栏</span>
              </label>
            </div>
          </div>

          <!-- Display Tab -->
          <div v-if="activeTab === 'display'" class="tab-content">
            <h3>显示元素</h3>
            <div class="settings-list">
              <label class="setting-item">
                <input
                  type="checkbox"
                  :checked="settingsStore.preferences.display.showSystemStatus"
                  @change="handleShowElementToggle('showSystemStatus')"
                />
                <span>显示系统状态</span>
              </label>
              <label class="setting-item">
                <input
                  type="checkbox"
                  :checked="settingsStore.preferences.display.showMetrics"
                  @change="handleShowElementToggle('showMetrics')"
                />
                <span>显示性能指标</span>
              </label>
              <label class="setting-item">
                <input
                  type="checkbox"
                  :checked="settingsStore.preferences.display.showCharts"
                  @change="handleShowElementToggle('showCharts')"
                />
                <span>显示图表</span>
              </label>
              <label class="setting-item">
                <input
                  type="checkbox"
                  :checked="settingsStore.preferences.display.showLogs"
                  @change="handleShowElementToggle('showLogs')"
                />
                <span>显示日志</span>
              </label>
              <label class="setting-item">
                <input
                  type="checkbox"
                  :checked="settingsStore.preferences.display.showAlerts"
                  @change="handleShowElementToggle('showAlerts')"
                />
                <span>显示告警</span>
              </label>
            </div>

            <h3>显示模式</h3>
            <div class="settings-list">
              <label class="setting-item">
                <input
                  type="checkbox"
                  :checked="settingsStore.isCompactMode"
                  @change="handleCompactModeToggle"
                />
                <span>紧凑模式</span>
              </label>
              <label class="setting-item">
                <input
                  type="checkbox"
                  :checked="settingsStore.animationsEnabled"
                  @change="handleAnimationsToggle"
                />
                <span>启用动画</span>
              </label>
            </div>
          </div>

          <!-- Font Tab -->
          <div v-if="activeTab === 'font'" class="tab-content">
            <h3>字体大小</h3>
            <div class="button-group">
              <button
                v-for="option in fontSizeOptions"
                :key="option.value"
                :class="['button-option', { active: settingsStore.fontSize === option.value }]"
                @click="handleFontSizeChange(option.value)"
              >
                <span :style="{ fontSize: option.size }">{{ option.name }}</span>
              </button>
            </div>

            <div class="font-preview">
              <p>这是文字预览。The quick brown fox jumps over the lazy dog. 这是一个测试句子，用于预览字体效果。</p>
            </div>
          </div>

          <!-- Notifications Tab -->
          <div v-if="activeTab === 'notifications'" class="tab-content">
            <h3>通知设置</h3>
            <div class="settings-list">
              <label class="setting-item">
                <input
                  type="checkbox"
                  :checked="settingsStore.preferences.notifications.enabled"
                  @change="handleNotificationToggle('enabled')"
                />
                <span>启用通知</span>
              </label>
              <label class="setting-item">
                <input
                  type="checkbox"
                  :checked="settingsStore.preferences.notifications.sound"
                  @change="handleNotificationToggle('sound')"
                />
                <span>提示音</span>
              </label>
              <label class="setting-item">
                <input
                  type="checkbox"
                  :checked="settingsStore.preferences.notifications.desktop"
                  @change="handleNotificationToggle('desktop')"
                />
                <span>桌面通知</span>
              </label>
            </div>

            <h3>数据刷新</h3>
            <div class="settings-section">
              <label>刷新间隔 (秒): {{ settingsStore.preferences.dataRefresh.interval }}</label>
              <input
                type="range"
                min="10"
                max="300"
                step="10"
                :value="settingsStore.preferences.dataRefresh.interval"
                @input="handleRefreshIntervalChange(Number(($event.target as HTMLInputElement).value))"
                class="range-input"
              />
            </div>
          </div>

          <!-- Data Tab -->
          <div v-if="activeTab === 'data'" class="tab-content">
            <h3>配置管理</h3>
            <div class="data-actions">
              <button class="action-button" @click="handleExport">
                <Download :size="18" />
                <span>导出配置</span>
              </button>
              <button class="action-button" @click="handleImport">
                <Upload :size="18" />
                <span>导入配置</span>
              </button>
              <input
                ref="importInput"
                type="file"
                accept=".json"
                style="display: none"
                @change="handleImportFile"
              />
            </div>

            <h3>重置设置</h3>
            <div class="danger-zone">
              <p>将重置所有设置为默认值，此操作不可撤销。</p>
              <button
                v-if="!showResetConfirm"
                class="danger-button"
                @click="showResetConfirm = true"
              >
                <RotateCcw :size="18" />
                <span>重置所有设置</span>
              </button>
              <div v-else class="reset-confirm">
                <span>确定要重置吗？</span>
                <button class="confirm-button" @click="handleReset">确定</button>
                <button class="cancel-button" @click="showResetConfirm = false">取消</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.settings-overlay {
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

.settings-panel {
  background: var(--bg-white);
  border-radius: var(--border-radius-lg);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  width: 100%;
  max-width: 900px;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.settings-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-lg);
  border-bottom: 1px solid var(--border-color);
}

.header-left {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  color: var(--text-main);
}

.header-left h2 {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
}

.header-right {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.save-status {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--border-radius-sm);
  font-size: 14px;
}

.save-status.success {
  background-color: #d1fae5;
  color: #065f46;
}

.save-status.error {
  background-color: #fee2e2;
  color: #991b1b;
}

.icon-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: none;
  background: transparent;
  border-radius: var(--border-radius-sm);
  cursor: pointer;
  color: var(--text-gray);
  transition: all 0.2s;
}

.icon-button:hover {
  background-color: var(--border-light);
  color: var(--text-main);
}

.settings-content {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.settings-tabs {
  display: flex;
  flex-direction: column;
  width: 180px;
  border-right: 1px solid var(--border-color);
  padding: var(--spacing-md);
  gap: var(--spacing-xs);
}

.tab-button {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm) var(--spacing-md);
  border: none;
  background: transparent;
  border-radius: var(--border-radius);
  cursor: pointer;
  text-align: left;
  font-size: 14px;
  color: var(--text-gray);
  transition: all 0.2s;
}

.tab-button:hover {
  background-color: var(--border-light);
  color: var(--text-main);
}

.tab-button.active {
  background-color: var(--primary-green);
  color: white;
}

.settings-body {
  flex: 1;
  padding: var(--spacing-lg);
  overflow-y: auto;
}

.tab-content h3 {
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 var(--spacing-md) 0;
  color: var(--text-main);
}

.tab-content h4 {
  font-size: 14px;
  font-weight: 500;
  margin: var(--spacing-lg) 0 var(--spacing-sm) 0;
  color: var(--text-gray);
}

/* Option Grid */
.option-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-lg);
}

.option-card {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-md);
  border: 2px solid var(--border-color);
  border-radius: var(--border-radius);
  background: var(--bg-white);
  cursor: pointer;
  transition: all 0.2s;
}

.option-card:hover {
  border-color: var(--primary-green);
}

.option-card.active {
  border-color: var(--primary-green);
  background-color: var(--bg-body);
}

.option-info {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.option-name {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-main);
}

.option-description {
  font-size: 12px;
  color: var(--text-gray);
}

/* Settings Section */
.settings-section {
  margin-bottom: var(--spacing-lg);
}

.settings-section > label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: var(--text-main);
  margin-bottom: var(--spacing-sm);
}

/* Button Group */
.button-group {
  display: flex;
  gap: var(--spacing-xs);
}

.button-option {
  flex: 1;
  padding: var(--spacing-sm) var(--spacing-md);
  border: 1px solid var(--border-color);
  background: var(--bg-white);
  border-radius: var(--border-radius-sm);
  cursor: pointer;
  font-size: 14px;
  color: var(--text-main);
  transition: all 0.2s;
}

.button-option:hover {
  border-color: var(--primary-green);
}

.button-option.active {
  background-color: var(--primary-green);
  color: white;
  border-color: var(--primary-green);
}

/* Range Input */
.range-input {
  width: 100%;
  max-width: 300px;
  margin-right: var(--spacing-md);
}

.range-value {
  font-size: 14px;
  color: var(--text-gray);
  font-weight: 500;
}

/* Checkbox Label */
.checkbox-label {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  cursor: pointer;
  font-size: 14px;
  color: var(--text-main);
}

/* Settings List */
.settings-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-lg);
}

.setting-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  cursor: pointer;
  font-size: 14px;
  color: var(--text-main);
}

/* Font Preview */
.font-preview {
  padding: var(--spacing-md);
  background: var(--bg-body);
  border-radius: var(--border-radius);
  border: 1px solid var(--border-color);
}

.font-preview p {
  margin: 0;
  line-height: var(--line-height);
  color: var(--text-main);
}

/* Data Actions */
.data-actions {
  display: flex;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-xl);
}

.action-button {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-md);
  background: var(--bg-white);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  cursor: pointer;
  font-size: 14px;
  color: var(--text-main);
  transition: all 0.2s;
}

.action-button:hover {
  border-color: var(--primary-green);
  background-color: var(--bg-body);
}

/* Danger Zone */
.danger-zone {
  padding: var(--spacing-lg);
  background: #fee2e2;
  border-radius: var(--border-radius);
  border: 1px solid #fecaca;
}

.danger-zone p {
  margin: 0 0 var(--spacing-md) 0;
  font-size: 14px;
  color: #991b1b;
}

.danger-button {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm) var(--spacing-md);
  background: #ef4444;
  color: white;
  border: none;
  border-radius: var(--border-radius-sm);
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
}

.danger-button:hover {
  background: #dc2626;
}

.reset-confirm {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.reset-confirm span {
  font-size: 14px;
  color: #991b1b;
}

.confirm-button,
.cancel-button {
  padding: var(--spacing-sm) var(--spacing-md);
  border: none;
  border-radius: var(--border-radius-sm);
  cursor: pointer;
  font-size: 14px;
}

.confirm-button {
  background: #ef4444;
  color: white;
}

.confirm-button:hover {
  background: #dc2626;
}

.cancel-button {
  background: #d1d5db;
  color: #374151;
}

.cancel-button:hover {
  background: #9ca3af;
}

/* Scrollbar */
.settings-body::-webkit-scrollbar {
  width: 8px;
}

.settings-body::-webkit-scrollbar-track {
  background: var(--border-light);
}

.settings-body::-webkit-scrollbar-thumb {
  background: var(--border-color);
  border-radius: 4px;
}

.settings-body::-webkit-scrollbar-thumb:hover {
  background: var(--text-light);
}
</style>
