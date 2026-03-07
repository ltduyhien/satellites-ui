// api-config.ts: API base URL — isolated so it can be mocked in Jest (avoids import.meta in tests).

export function getApiBaseUrl(): string {
  return import.meta.env.VITE_API_URL || '/api'
}
