import { CheckIcon, Circle } from 'lucide-react'
import { cn } from '@/shared/utils/cn'
import { MONTH_NAMES } from '../constants'
import { monthKey } from '../utils'
import type { SavedReport } from '../constants'

interface ReportMonthNavProps {
  availableMonths: { year: number; month: number }[]
  reports: Record<string, SavedReport>
  selected: { year: number; month: number }
  onSelectMonth: (year: number, month: number) => void
}

export function ReportMonthNav({
  availableMonths,
  reports,
  selected,
  onSelectMonth,
}: ReportMonthNavProps) {
  return (
    <aside className="flex w-56 shrink-0 flex-col overflow-hidden border-r border-border bg-muted/40">
      <p className="shrink-0 p-4 pb-4 text-sm font-semibold text-foreground">Monthly Reports</p>
      <nav
        className="flex min-h-0 flex-1 flex-col gap-0.5 overflow-y-auto px-4 pb-4"
        aria-label="Report months"
      >
        {[...availableMonths].reverse().map(({ year, month }) => {
          const key = monthKey(year, month)
          const reported = Boolean(reports[key])
          const isActive = selected.year === year && selected.month === month
          return (
            <button
              key={key}
              type="button"
              onClick={() => onSelectMonth(year, month)}
              className={cn(
                'flex w-full items-center gap-2.5 rounded-md py-2.5 pl-3 pr-3 text-left text-sm transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                isActive
                  ? 'border border-input bg-background text-foreground dark:border-transparent'
                  : 'border border-transparent text-muted-foreground hover:bg-background/50 hover:text-foreground'
              )}
            >
              {reported ? (
                <CheckIcon className="size-4 shrink-0 text-mars-500" aria-label="Done" />
              ) : (
                <Circle className="size-4 shrink-0 text-muted-foreground" aria-label="Pending" />
              )}
              <span className="min-w-0 truncate font-medium">
                {MONTH_NAMES[month]} {year}
              </span>
            </button>
          )
        })}
      </nav>
    </aside>
  )
}
