// ThemeContext.ts: React context for theme state.

import { createContext } from 'react'

export type Theme = 'dark' | 'light'

export const ThemeContext = createContext<{
  theme: Theme
  toggleTheme: () => void
} | null>(null)
