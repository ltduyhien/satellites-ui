// client.ts: Centralized API client — all HTTP requests to the LARVIS backend go through here.
// This gives us a single place to attach the JWT auth header, handle errors,
// and configure the base URL. No feature should call fetch() directly.

import { getApiBaseUrl } from './api-config'

const API_BASE_URL = getApiBaseUrl()
// In tests, api-config is mocked so import.meta is never used.
// In development with Vite proxy: '/api' (proxied to localhost:8080).
// In Docker with nginx: '/api' (proxied to backend:8080).
// The VITE_ prefix is required — Vite only exposes env vars starting with VITE_ to client code.
// The || '/api' fallback means it works without any .env file.

let accessToken: string | null = null
// accessToken: Stored in module-level memory — not localStorage, not sessionStorage.
// This is the most XSS-resistant approach: no JavaScript from another context can read it.
// Trade-off: token is lost on page refresh (user must re-login).

export function setAccessToken(token: string | null) {
  // setAccessToken: Called by the auth provider after login (set token) or logout (set null).
  accessToken = token
}

export function getAccessToken(): string | null {
  // getAccessToken: Used by the auth provider to check if the user is authenticated.
  return accessToken
}

export type { ApiError } from './error-utils'
export { isApiError, getApiErrorMessage } from './error-utils'

export async function api<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  // api<T>: Generic fetch wrapper that returns typed JSON responses.
  // T: The expected shape of the response body (e.g. api<User[]>('/users')).
  // endpoint: The API path (e.g. '/token', '/users'). Appended to API_BASE_URL.
  // options: Standard fetch options (method, headers, body, etc.).
  //   Defaults to {} (a GET request with no extra headers).

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    // Content-Type: Tell the server we're sending JSON.
    // Applied to all requests — GET requests ignore the body anyway.
    ...options.headers as Record<string, string>,
    // Spread any extra headers the caller passed in, allowing overrides.
  }

  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`
    // Authorization: Attach the JWT if the user is logged in.
    // "Bearer" is the auth scheme for JWT tokens (RFC 6750).
    // This runs on every request — no need for callers to manually attach the token.
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    // Spread caller's options (method, body, signal, etc.).
    headers,
    // Override headers with our merged version (Content-Type + Auth + caller's extras).
  })

  if (!response.ok) {
    const message = await response.text().catch(() => 'Request failed')
    if (response.status === 401) {
      accessToken = null
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('auth:unauthorized'))
      }
    }
    const error: import('./error-utils').ApiError = { message, status: response.status }
    throw error
  }

  return response.json() as Promise<T>
  // response.json(): Parse the response body as JSON.
  // Cast to Promise<T> so the caller gets typed data back.
}
