// client.ts: Centralized API client — all HTTP requests to the LARVIS backend go through here.

import { getApiBaseUrl } from './api-config'

const API_BASE_URL = getApiBaseUrl()

let accessToken: string | null = null

export function setAccessToken(token: string | null) {
  accessToken = token
}

export function getAccessToken(): string | null {
  return accessToken
}

export type { ApiError } from './error-utils'
export { isApiError, getApiErrorMessage } from './error-utils'

export async function api<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...options.headers as Record<string, string>,
  }

  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  })

  if (!response.ok) {
    const message = await response.text().catch(() => 'Request failed')
    if (response.status === 401 && !endpoint.includes('/token')) {
      accessToken = null
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('auth:unauthorized'))
      }
    }
    const error: import('./error-utils').ApiError = { message, status: response.status }
    throw error
  }

  return response.json() as Promise<T>
}
