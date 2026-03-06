// LoginPage.tsx: The login page — composes the LoginForm feature inside the AuthLayout.
// This is a page-level component: it arranges features on screen but contains no business logic.

import { LoginForm } from '@/features/auth/components/LoginForm'
// LoginForm: The login form component with username/password fields and submission handling.

export function LoginPage() {
  return <LoginForm />
  // The LoginForm renders inside the AuthLayout's <Outlet />,
  // which centers it over the Mars background with the dark overlay.
}
