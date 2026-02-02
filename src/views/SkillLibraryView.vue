<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Brain, Plus } from 'lucide-vue-next'
import SkillLibrary from '@/components/SkillLibrary.vue'

const router = useRouter()
const skillLibraryRef = ref<InstanceType<typeof SkillLibrary>>()

onMounted(() => {
  console.log('📚 Skill Library View mounted')
})

const navigateToDashboard = () => {
  router.push('/')
}

const handleCreateRule = () => {
  skillLibraryRef.value?.handleCreateRule()
}
</script>

<template>
  <div class="skill-library-container">
    <!-- Page Header -->
    <div class="page-header">
      <div class="header-content">
        <button class="back-button" @click="navigateToDashboard">
          ← 返回仪表板
        </button>
        <div class="header-title">
          <Brain :size="32" class="header-icon" />
          <h1>专家技能知识库</h1>
        </div>
      </div>
      <div class="header-actions">
        <button class="btn btn-primary" @click="handleCreateRule">
          <Plus :size="16" />
          <span>创建技能</span>
        </button>
      </div>
    </div>

    <!-- Main Content -->
    <main class="skill-library-main">
      <SkillLibrary ref="skillLibraryRef" :hide-header="true" />
    </main>
  </div>
</template>

<style scoped>
.skill-library-container {
  width: 100%;
  max-width: 1600px;
  margin: 0 auto;
  padding: var(--spacing-2xl) var(--spacing-2xl);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xl);
  min-height: 100vh;
  background-color: var(--bg-white);
}

/* Page Header */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: var(--spacing-lg);
  flex-wrap: wrap;
}

.header-content {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  flex: 1;
  min-width: 280px;
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

.header-title {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  color: var(--text-main);
}

.header-icon {
  color: var(--primary-green);
  flex-shrink: 0;
}

.header-title h1 {
  font-size: 28px;
  font-weight: 600;
  margin: 0;
  font-family: var(--font-family);
}

.header-description {
  font-size: var(--font-size-body);
  color: var(--text-gray);
  margin: 0;
  font-family: var(--font-family);
}

.header-actions {
  display: flex;
  gap: var(--spacing-md);
  align-items: flex-start;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--border-radius);
  font-size: var(--font-size-caption-2);
  font-weight: 600;
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
  box-shadow: var(--shadow-elevated);
}

.skill-library-main {
  width: 100%;
  overflow-y: auto;
}
</style>
