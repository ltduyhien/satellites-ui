export interface ApiError {
  message: string
  status: number
}

export function isApiError(e: unknown): e is ApiError {
  return (
    typeof e === 'object' &&
    e !== null &&
    'message' in e &&
    typeof (e as ApiError).message === 'string' &&
    'status' in e &&
    typeof (e as ApiError).status === 'number'
  )
}

export function getApiErrorMessage(e: unknown, fallback = 'Request failed'): string {
  if (isApiError(e)) return e.message
  if (e instanceof Error) return e.message
  return fallback
}
