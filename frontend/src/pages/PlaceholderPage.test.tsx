import { render, screen } from '@testing-library/react'
import { PlaceholderPage } from './PlaceholderPage'

jest.mock('@/shared/ui/page-header', () => ({
  PageHeader: ({ title, subtitle }: { title: string; subtitle: string }) => (
    <div data-testid="page-header">
      <h1>{title}</h1>
      <p>{subtitle}</p>
    </div>
  ),
}))

describe('PlaceholderPage', () => {
  it('renders title and subtitle via PageHeader', () => {
    render(<PlaceholderPage title="Dashboard" subtitle="Ore acquisition data will appear here." />)
    expect(screen.getByText('Dashboard')).toBeTruthy()
    expect(screen.getByText('Ore acquisition data will appear here.')).toBeTruthy()
  })
})
