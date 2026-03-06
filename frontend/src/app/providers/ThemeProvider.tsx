// ThemeProvider.tsx: React context provider that manages theme state (dark/light).
// Wraps the app so any component can access theme via useTheme().
// Syncs the theme to <html> class so Tailwind dark: styles apply. Persists in localStorage.

import { useCallback, useLayoutEffect, useState } from 'react'
// useCallback: Memoizes toggleTheme so its reference stays stable across re-renders.
// useLayoutEffect: Syncs theme to <html> before paint so there's no flash.
// useState: Holds theme state; triggers re-render when user toggles.

import { ThemeContext } from './ThemeContext'
// ThemeContext: The React context object. Separate file so this file only exports the component.

import type { Theme } from './ThemeContext'
// Theme: Type alias for 'dark' | 'light'.

const STORAGE_KEY = 'theme'
// STORAGE_KEY: localStorage key for persisting user's theme choice.

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // ThemeProvider: Wraps the app and provides theme + toggleTheme to all descendants.

  const [theme, setTheme] = useState<Theme>(() => {
    // Initial state: read from localStorage if available, else default to 'dark'.
    // typeof window check handles SSR (e.g. during build) where localStorage doesn't exist.
    if (typeof window === 'undefined') return 'dark'
    return (localStorage.getItem(STORAGE_KEY) as Theme) ?? 'dark'
  })

  useLayoutEffect(() => {
    // Sync theme to <html> so Tailwind dark: and .dark CSS variables apply.
    const root = document.documentElement
    root.classList.remove('light', 'dark')
    root.classList.add(theme)
  }, [theme])

  const toggleTheme = useCallback(() => {
    // toggleTheme: Flip dark <-> light and persist to localStorage.
    // Inline script in index.html reads this on load to avoid flash of wrong theme.
    setTheme((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark'
      localStorage.setItem(STORAGE_KEY, next)
      return next
    })
  }, [])

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {/* Makes theme and toggleTheme available to any descendant via useTheme(). */}
      {children}
    </ThemeContext.Provider>
  )
}
