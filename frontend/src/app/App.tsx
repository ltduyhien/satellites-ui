// App.tsx: Root component of the application.
// Wires together the global providers (auth) and the router.
// This is the top of the component tree — everything renders inside here.

import { RouterProvider } from 'react-router-dom'
// RouterProvider: React Router component that connects the router to the React tree.
// Takes a router object (created with createBrowserRouter) and renders the matched routes.

import { AuthProvider } from './providers/AuthProvider'
import { ThemeProvider } from './providers/ThemeProvider'
// ThemeProvider: Wraps the app with theme context. Syncs dark/light to <html> and localStorage.

import { ThemeSwitch } from '@/shared/ui/theme-switch'
// ThemeSwitch: Fixed bottom-right toggle for dark/light mode.
import { router } from './router'
// router: The route configuration — maps URLs to page components with layout nesting.

export function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <RouterProvider router={router} />
        <ThemeSwitch />
      </ThemeProvider>
    </AuthProvider>
  )
}
