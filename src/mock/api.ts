/**
 * Mock API Layer
 * Simulates backend API calls with delays
 */

import type { Server, ApiResponse } from '@/types'
import { mockServers } from './data'

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

/**
 * Fetch all servers
 */
export async function fetchServers(): Promise<ApiResponse<Server[]>> {
  await delay(300)
  return {
    success: true,
    data: mockServers
  }
}

/**
 * Fetch single server by ID
 */
export async function fetchServer(id: string): Promise<ApiResponse<Server>> {
  await delay(200)
  const server = mockServers.find(s => s.id === id)
  if (!server) {
    return {
      success: false,
      error: 'Server not found'
    }
  }
  return {
    success: true,
    data: server
  }
}

/**
 * Restart server
 */
export async function restartServer(id: string): Promise<ApiResponse<{ message: string }>> {
  await delay(1500)
  const server = mockServers.find(s => s.id === id)
  if (!server) {
    return {
      success: false,
      error: 'Server not found'
    }
  }

  // Simulate status change
  server.status = 'online'
  server.cpu = Math.floor(Math.random() * 40) + 20
  server.load = [
    Math.random() * 0.5,
    Math.random() * 0.4,
    Math.random() * 0.3
  ]

  return {
    success: true,
    data: {
      message: `Server ${server.name} has been restarted successfully`
    }
  }
}

/**
 * Deploy new version
 */
export async function deployVersion(
  version: string
): Promise<ApiResponse<{ message: string }>> {
  await delay(2000)
  return {
    success: true,
    data: {
      message: `Version ${version} has been deployed to all servers`
    }
  }
}

/**
 * Check server health
 */
export async function checkHealth(): Promise<ApiResponse<{
  healthy: number
  warning: number
  offline: number
}>> {
  await delay(400)

  const healthy = mockServers.filter(s => s.status === 'online').length
  const warning = mockServers.filter(s => s.status === 'warning').length
  const offline = mockServers.filter(s => s.status === 'offline').length

  return {
    success: true,
    data: { healthy, warning, offline }
  }
}
