// ProtectedRoute.tsx: Route guard that redirects unauthenticated users to /login.

import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@/features/auth/hooks/useAuth'

export function ProtectedRoute() {
  const { isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}
