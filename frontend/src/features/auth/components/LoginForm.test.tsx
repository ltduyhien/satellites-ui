import { render, screen, fireEvent } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { LoginForm } from './LoginForm'

const mockLogin = jest.fn()

jest.mock('../hooks/useAuth', () => ({
  useAuth: () => ({ login: mockLogin }),
}))

jest.mock('@/shared/hooks/useTheme', () => ({
  useTheme: () => ({ theme: 'dark' }),
}))

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>{children}</BrowserRouter>
)

describe('LoginForm', () => {
  beforeEach(() => {
    mockLogin.mockReset()
  })

  it('renders username and password fields', () => {
    render(<LoginForm />, { wrapper })
    expect(screen.getByLabelText(/Username/i)).toBeTruthy()
    expect(screen.getByLabelText(/Password/i)).toBeTruthy()
  })

  it('shows error when both fields empty on submit', async () => {
    render(<LoginForm />, { wrapper })
    fireEvent.click(screen.getByRole('button', { name: /Sign in/i }))
    expect(await screen.findByText('Please fill out all fields.')).toBeTruthy()
  })

  it('shows error when username empty on submit', async () => {
    render(<LoginForm />, { wrapper })
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'pass' } })
    fireEvent.click(screen.getByRole('button', { name: /Sign in/i }))
    expect(await screen.findByText('Please fill out username.')).toBeTruthy()
  })

  it('shows error when password empty on submit', async () => {
    render(<LoginForm />, { wrapper })
    fireEvent.change(screen.getByLabelText(/Username/i), { target: { value: 'alice' } })
    fireEvent.click(screen.getByRole('button', { name: /Sign in/i }))
    expect(await screen.findByText('Please fill out password.')).toBeTruthy()
  })
})
