/**
 * MetricCard Component Tests
 * 指标卡片组件测试
 */

import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import MetricCard from './MetricCard.vue'
import { ArrowUp, ArrowDown, Minus } from 'lucide-vue-next'

describe('MetricCard', () => {
  it('should render metric label', () => {
    const wrapper = mount(MetricCard, {
      props: {
        label: 'CPU Usage',
        value: '75%',
        change: 5,
        changeType: 'up',
        status: 'warning'
      }
    })
    expect(wrapper.text()).toContain('CPU Usage')
    expect(wrapper.text()).toContain('75%')
  })

  it('should show up arrow when changeType is up', () => {
    const wrapper = mount(MetricCard, {
      props: {
        label: 'Test',
        value: '100',
        change: 10,
        changeType: 'up',
        status: 'positive'
      }
    })
    expect(wrapper.findComponent(ArrowUp).exists()).toBe(true)
  })

  it('should show down arrow when changeType is down', () => {
    const wrapper = mount(MetricCard, {
      props: {
        label: 'Test',
        value: '100',
        change: -5,
        changeType: 'down',
        status: 'warning'
      }
    })
    expect(wrapper.findComponent(ArrowDown).exists()).toBe(true)
  })

  it('should show minus when changeType is stable', () => {
    const wrapper = mount(MetricCard, {
      props: {
        label: 'Test',
        value: '100',
        change: 0,
        changeType: 'stable',
        status: 'info'
      }
    })
    expect(wrapper.findComponent(Minus).exists()).toBe(true)
  })

  it('should apply correct status class', () => {
    const wrapper = mount(MetricCard, {
      props: {
        label: 'Test',
        value: '100',
        change: 5,
        changeType: 'up',
        status: 'warning'
      }
    })
    expect(wrapper.find('.dot-warning').exists()).toBe(true)
  })

  it('should display absolute change value', () => {
    const wrapper = mount(MetricCard, {
      props: {
        label: 'Test',
        value: '100',
        change: -10,
        changeType: 'down',
        status: 'positive'
      }
    })
    expect(wrapper.text()).toContain('10%')
  })
})
