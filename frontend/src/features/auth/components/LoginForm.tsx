// LoginForm.tsx: The login form component with username, password fields, and submit button.
// Uses shadcn/ui components (Card, Input, Button, Label) for consistent, accessible UI.
// Handles form submission, loading state, and error display.

import { useState } from 'react'
// useState: React hook to manage local component state.
// We track the form field values, loading state, and error message.


import { useNavigate } from 'react-router-dom'
// useNavigate: React Router hook that returns a function to programmatically navigate.
// After successful login, we redirect to /dashboard.

import { useAuth } from '../hooks/useAuth'
// useAuth: Our custom hook to access login() from the auth context.

import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { Label } from '@/shared/ui/label'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/ui/card'
// shadcn/ui components: Pre-built, accessible UI primitives.
// Card: Container with header/content sections.
// Input: Styled text input with focus ring.
// Button: Styled button with loading states.
// Label: Accessible label that associates with an input via htmlFor.

export function LoginForm() {
  const [userId, setUserId] = useState('')
  // userId: The value of the username input field.

  const [password, setPassword] = useState('')
  // password: The value of the password input field.

  const [error, setError] = useState<string | null>(null)
  // error: Error message displayed when login fails (e.g. "Unauthorized").
  // null means no error.

  const [isLoading, setIsLoading] = useState(false)
  // isLoading: true while the login API request is in-flight.
  // Disables the submit button and shows "Authenticating..." text.

  const { login } = useAuth()
  // login: The async function from AuthProvider that calls POST /token and stores the JWT.

  const navigate = useNavigate()
  // navigate: Function to redirect after successful login.

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    // handleSubmit: Called when the form is submitted (button click or Enter key).
    e.preventDefault()
    // e.preventDefault(): Stop the browser from performing a full page reload.
    // HTML forms natively submit via GET/POST to the action URL — we don't want that,
    // we handle submission in JavaScript.

    setError(null)
    // Clear any previous error message before attempting login.
    setIsLoading(true)

    try {
      await login(userId, password)
      // Call the auth context's login function — this hits POST /token,
      // stores the JWT in memory, and updates isAuthenticated to true.
      navigate('/dashboard', { replace: true })
      // Redirect to the dashboard after successful login.
      // replace: true removes the login page from browser history —
      // the user can't press "back" to return to login after authenticating.
    } catch {
      setError('Invalid credentials. Try alice, bob, or charlie with password 1234.')
      // Display a helpful error message. We don't expose the raw API error
      // to avoid leaking implementation details.
    } finally {
      setIsLoading(false)
      // Re-enable the submit button whether login succeeded or failed.
    }
  }

  return (
    <Card className="border-white/10 bg-black/60 backdrop-blur-md">
      {/* Card styling:
          border-white/10: Subtle white border at 10% opacity — visible but not harsh on the Mars bg.
          bg-black/60: Semi-transparent dark background (60% opacity) so the Mars landscape bleeds through.
          backdrop-blur-md: Blur the background behind the card (frosted glass effect).
          Together these create a glassmorphism effect that fits the sci-fi terminal aesthetic. */}

      <CardHeader className="text-center">
        {/* text-center: Center the title and description text. */}

        <CardTitle className="text-2xl font-bold tracking-wider text-white">
          {/* text-2xl: 24px font size.
              font-bold: Bold weight.
              tracking-wider: Increased letter spacing — gives a techy/space terminal feel.
              text-white: White text for contrast against the dark card. */}
          LARVIS
        </CardTitle>

        <CardDescription className="text-neutral-300">
          {/* text-neutral-300: Light gray — readable against dark background but
              visually subordinate to the white title. */}
          Station Terminal Access
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* onSubmit={handleSubmit}: Wire the form submission to our handler.
              space-y-4: 16px vertical gap between each child element. */}

          <div className="space-y-2">
            {/* space-y-2: 8px gap between label and input. */}
            <Label htmlFor="userId" className="text-neutral-200">
              {/* htmlFor="userId": Associates this label with the input below.
                  Clicking the label focuses the input (accessibility). */}
              User ID
            </Label>
            <Input
              id="userId"
              // id: Matches the htmlFor on the Label — links them for accessibility.
              type="text"
              placeholder="Enter your user ID"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              // onChange: Update the userId state on every keystroke.
              // e.target.value: The current text in the input field.
              disabled={isLoading}
              // disabled: Prevent editing while the login request is in-flight.
              required
              // required: HTML5 validation — browser prevents form submission if empty.
              className="border-white/20 bg-white/10 text-white placeholder:text-neutral-500"
              // Transparent input styling:
              // border-white/20: Subtle white border at 20% opacity.
              // bg-white/10: Very slight white tint on the input background.
              // text-white: White text for user input.
              // placeholder:text-neutral-500: Gray placeholder text.
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-neutral-200">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              // type="password": Masks the input characters with dots (browser built-in).
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              required
              className="border-white/20 bg-white/10 text-white placeholder:text-neutral-500"
            />
          </div>

          {error && (
            <p className="text-sm text-red-400">
              {/* text-sm: 14px font size — error messages should be smaller than form labels.
                  text-red-400: Red color — universally signals an error. 400 shade is softer
                  than pure red and works better on dark backgrounds. */}
              {error}
            </p>
          )}

          <Button
            type="submit"
            // type="submit": Triggers the form's onSubmit handler when clicked or when Enter is pressed.
            className="w-full"
            // w-full: Button spans the full width of the card — standard for login forms.
            disabled={isLoading}
            // disabled: Prevent double-submission while the API request is in-flight.
          >
            {isLoading ? 'Authenticating...' : 'Access Terminal'}
            {/* Show "Authenticating..." while loading, "Access Terminal" otherwise.
                "Access Terminal" fits the space station theme better than a generic "Log in". */}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
