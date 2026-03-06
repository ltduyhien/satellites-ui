// useTheme.ts: Hook to access theme and toggleTheme from ThemeContext.
// Call useTheme() in any component wrapped by ThemeProvider.

import { useContext } from 'react'
// useContext: Reads the current value from ThemeContext. Re-renders when theme changes.

import { ThemeContext } from '@/app/providers/ThemeContext'
// ThemeContext: The context from app/providers/ThemeContext. Provider supplies the value.

export function useTheme() {
  // useTheme: Returns { theme, toggleTheme }. Throws if used outside ThemeProvider.
  const ctx = useContext(ThemeContext)
  if (!ctx) {
    throw new Error('useTheme must be used within ThemeProvider')
    // This means a component called useTheme() but isn't wrapped in <ThemeProvider>.
  }
  return ctx
}
