/**
 * Test Utilities
 * 测试辅助工具
 */

import { createApp } from 'vue'
import type { App } from 'vue'

/**
 * Helper function to test composables that need a component context
 * 用于测试需要组件上下文的 composables 的辅助函数
 *
 * Use this for composables that use:
 * - Lifecycle hooks (onMounted, onUnmounted, etc.)
 * - inject/provide
 * - Current component instance
 *
 * @example
 * ```typescript
 * const [result, app] = withSetup(() => useMyComposable())
 * // ... tests
 * app.unmount() // Clean up
 * ```
 */
export function withSetup<T extends (...args: any[]) => any>(
  composable: T,
  options: {
    provide?: Record<string, any>
  } = {}
): [ReturnType<T>, App] {
  let result

  const app = createApp({
    setup() {
      result = composable()
      // Suppress warnings about missing render function
      return () => {}
    }
  })

  // Apply provides before mounting
  if (options.provide) {
    Object.entries(options.provide).forEach(([key, value]) => {
      app.provide(key, value)
    })
  }

  app.mount(document.createElement('div'))

  return [result, app] as [ReturnType<T>, App]
}
