/**
 * Vue Router Navigation Guards
 * 路由导航守卫
 */

import type { Router } from 'vue-router'

/**
 * Setup router guards
 * 设置路由导航守卫
 */
export function setupRouterGuards(router: Router) {
  // Before each navigation
  router.beforeEach((to, _from, next) => {
    // Set page title
    const title = to.meta.title as string | undefined
    if (title) {
      document.title = `${title} - 运维助手`
    } else {
      document.title = '运维助手 - Operations Assistant'
    }

    // Add authentication check here if needed
    // if (to.meta.requiresAuth && !isAuthenticated()) {
    //   next('/login')
    //   return
    // }

    // Continue navigation
    next()
  })

  // After each navigation
  router.afterEach((to, _from) => {
    // Log page view for analytics (optional)
    if (import.meta.env.PROD) {
      console.log(`Navigation completed: ${to.path}`)
    }
  })

  // Navigation error handling
  router.onError((error) => {
    console.error('Router error:', error)
    // You can add error reporting here (e.g., Sentry)
  })
}
