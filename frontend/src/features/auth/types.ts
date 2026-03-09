// types.ts: Auth-specific types used by the auth provider and login form.

export interface AuthContextType {
  isAuthenticated: boolean
  userId: string | null
  loginAt: number | null
  login: (userId: string, password: string) => Promise<void>
  logout: () => void
}
