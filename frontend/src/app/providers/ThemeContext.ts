// ThemeContext.ts: React context for theme state.
// Holds { theme, toggleTheme }. Separated from ThemeProvider so useTheme and ThemeProvider
// can both import it without circular deps. Also satisfies Fast Refresh (component-only exports).

import { createContext } from 'react'
// createContext: Creates the context object. Passed to Provider and useContext.

export type Theme = 'dark' | 'light'
// Theme: The two supported theme values. Maps to class on <html>.

export const ThemeContext = createContext<{
  theme: Theme
  toggleTheme: () => void
} | null>(null)
// ThemeContext: Default null. Provider sets the value; useTheme reads it and throws if null.
