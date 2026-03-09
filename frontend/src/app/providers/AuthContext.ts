// AuthContext.ts: The React context object for authentication, in its own file.

import { createContext } from 'react'
import type { AuthContextType } from '@/features/auth/types'

export const AuthContext = createContext<AuthContextType | null>(null)
