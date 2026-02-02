/**
 * Vue Router Configuration
 */

import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '@/views/Dashboard.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'dashboard',
      component: Dashboard
    },
    {
      path: '/tracing-analysis',
      name: 'tracing-analysis',
      component: () => import('@/views/TracingAnalysis.vue')
    },
    {
      path: '/servers',
      name: 'servers',
      component: () => import('@/views/Servers.vue')
    },
    {
      path: '/alerts',
      name: 'alerts',
      component: () => import('@/views/Alerts.vue')
    },
    {
      path: '/logs',
      name: 'logs',
      component: () => import('@/views/Logs.vue')
    },
    {
      path: '/deployments',
      name: 'deployments',
      component: () => import('@/views/Deployments.vue')
    },
    {
      path: '/skills',
      name: 'skills',
      component: () => import('@/views/SkillLibraryView.vue')
    },
    {
      path: '/terminal',
      name: 'terminal',
      component: () => import('@/views/Terminal.vue')
    }
  ]
})

export default router
