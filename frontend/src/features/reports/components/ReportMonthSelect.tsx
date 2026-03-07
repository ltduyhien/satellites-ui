import { ChevronDown } from 'lucide-react'
import { MONTH_NAMES } from '../constants'
import { monthKey } from '../utils'
import type { SavedReport } from '../constants'

interface ReportMonthSelectProps {
  availableMonths: { year: number; month: number }[]
  reports: Record<string, SavedReport>
  selected: { year: number; month: number }
  onSelectMonth: (year: number, month: number) => void
}

export function ReportMonthSelect({
  availableMonths,
  reports,
  selected,
  onSelectMonth,
}: ReportMonthSelectProps) {
  const options = [...availableMonths].reverse()
  const selectedValue = monthKey(selected.year, selected.month)

  return (
    <div className="w-full">
      <label htmlFor="report-month-select" className="mb-2 block text-sm font-medium text-foreground">
        Monthly Reports
      </label>
      <div className="relative">
        <select
          id="report-month-select"
          value={selectedValue}
          onChange={(e) => {
            const [year, month] = e.target.value.split('-').map(Number)
            onSelectMonth(year, month)
          }}
          className="flex h-12 w-full appearance-none items-center gap-2 rounded-md border-0 bg-primary px-4 py-2 pr-10 text-sm font-medium text-primary-foreground outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:h-10"
          aria-label="Select report month"
        >
        {options.map(({ year, month }) => {
          const key = monthKey(year, month)
          const reported = Boolean(reports[key])
          const label = `${MONTH_NAMES[month]} ${year}${reported ? ' ✓' : ''}`
          return (
            <option key={key} value={key}>
              {label}
            </option>
          )
        })}
      </select>
        <ChevronDown
          className="pointer-events-none absolute right-3 top-1/2 size-5 -translate-y-1/2 text-primary-foreground"
          aria-hidden
        />
      </div>
    </div>
  )
}
