/**
 * Vue Router Configuration
 */

import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '@/views/Dashboard.vue'
import { setupRouterGuards } from './guards'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'dashboard',
      component: Dashboard,
      meta: {
        title: '运维监控中心'
      }
    },
    {
      path: '/tracing-analysis',
      name: 'tracing-analysis',
      component: () => import('@/views/TracingAnalysis.vue'),
      meta: {
        title: '全链路追踪'
      }
    },
    {
      path: '/servers',
      name: 'servers',
      component: () => import('@/views/Servers.vue'),
      meta: {
        title: '服务器管理'
      }
    },
    {
      path: '/alerts',
      name: 'alerts',
      component: () => import('@/views/Alerts.vue'),
      meta: {
        title: '告警管理'
      }
    },
    {
      path: '/logs',
      name: 'logs',
      component: () => import('@/views/Logs.vue'),
      meta: {
        title: '日志分析'
      }
    },
    {
      path: '/deployments',
      name: 'deployments',
      component: () => import('@/views/Deployments.vue'),
      meta: {
        title: '部署管理'
      }
    },
    {
      path: '/skills',
      name: 'skills',
      component: () => import('@/views/SkillLibraryView.vue'),
      meta: {
        title: '技能库'
      }
    },
    {
      path: '/terminal',
      name: 'terminal',
      component: () => import('@/views/Terminal.vue'),
      meta: {
        title: '运维终端'
      }
    }
  ]
})

// Setup router guards
setupRouterGuards(router)

export default router
