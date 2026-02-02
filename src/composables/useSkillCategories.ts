/**
 * Skill Categories Composable
 * 技能分类管理
 */

import { ref } from 'vue'
import {
  TrendingUp,
  CheckCircle,
  Zap,
  AlertTriangle,
  Database,
  Settings
} from 'lucide-vue-next'

export interface CategoryOption {
  value: string
  label: string
  icon: any
}

export function useSkillCategories() {
  const categories: CategoryOption[] = [
    { value: 'all', label: '全部', icon: Settings },
    { value: 'performance', label: '性能', icon: TrendingUp },
    { value: 'availability', label: '可用性', icon: CheckCircle },
    { value: 'integration', label: '集成', icon: Zap },
    { value: 'security', label: '安全', icon: AlertTriangle },
    { value: 'capacity', label: '容量', icon: Database },
    { value: 'network_block', label: '网络', icon: Settings }
  ]

  const getCategoryIcon = (category: string) => {
    const found = categories.find(c => c.value === category)
    return found?.icon || Settings
  }

  const getCategoryLabel = (category: string) => {
    const found = categories.find(c => c.value === category)
    return found?.label || category
  }

  return {
    categories,
    getCategoryIcon,
    getCategoryLabel
  }
}
