import { render, screen } from '@testing-library/react'
import { PageHeader } from './page-header'

jest.mock('./utc-time', () => ({
  UtcTime: () => <span data-testid="utc-time">UTC</span>,
}))

describe('PageHeader', () => {
  it('renders title and subtitle', () => {
    render(<PageHeader title="Activities" subtitle="Ore acquisition overview" />)
    expect(screen.getByText('Activities')).toBeTruthy()
    expect(screen.getByText(/Ore acquisition overview/)).toBeTruthy()
  })

  it('renders UtcTime', () => {
    render(<PageHeader title="Test" subtitle="Sub" />)
    expect(screen.getByTestId('utc-time')).toBeTruthy()
  })
})
