// client.ts: Centralized API client — all HTTP requests to the LARVIS backend go through here.
// This gives us a single place to attach the JWT auth header, handle errors,
// and configure the base URL. No feature should call fetch() directly.

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api'
// import.meta.env.VITE_API_URL: Vite environment variable for the API base URL.
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

interface ApiError {
  // ApiError: Structured error thrown by the api() function when requests fail.
  // Consumers can check error.status for HTTP status codes (401, 404, etc.).
  message: string
  status: number
}

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
    // response.ok: true if HTTP status is 200-299, false otherwise.
    // We throw a structured error so callers can catch and display it.
    const message = await response.text().catch(() => 'Request failed')
    // response.text(): Read the error body as plain text.
    // .catch(): If even reading the body fails, fall back to a generic message.
    const error: ApiError = { message, status: response.status }
    throw error
  }

  return response.json() as Promise<T>
  // response.json(): Parse the response body as JSON.
  // Cast to Promise<T> so the caller gets typed data back.
}
