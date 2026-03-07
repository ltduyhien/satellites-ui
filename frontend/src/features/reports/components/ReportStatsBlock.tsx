import {
  totalOreSitesForMonth,
  totalScansForMonth,
  uniqueDaysForMonth,
  avgOreSitesPerScanForMonth,
} from '@/features/acquisitions/utils/format'

interface ReportStatsBlockProps {
  monthLabel: string
  acquisitions: { timestamp: number; ore_sites: number }[]
  selected: { year: number; month: number }
  isLoading: boolean
}

export function ReportStatsBlock({ monthLabel, acquisitions, selected, isLoading }: ReportStatsBlockProps) {
  return (
    <section className="rounded-lg border border-input bg-muted/30 p-6">
      <h2 className="mb-4 text-base font-semibold">Statistics for {monthLabel}</h2>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="text-sm text-muted-foreground">Total Ore Sites</p>
          <p className="text-lg font-semibold text-mars-500">
            {isLoading ? '…' : totalOreSitesForMonth(acquisitions, selected.year, selected.month)}
          </p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Total Scans</p>
          <p className="text-lg font-semibold text-foreground">
            {isLoading ? '…' : totalScansForMonth(acquisitions, selected.year, selected.month)}
          </p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Days with Activity</p>
          <p className="text-lg font-semibold text-foreground">
            {isLoading ? '…' : uniqueDaysForMonth(acquisitions, selected.year, selected.month)}
          </p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Avg Ore Sites / Scan</p>
          <p className="text-lg font-semibold text-foreground">
            {isLoading ? '…' : avgOreSitesPerScanForMonth(acquisitions, selected.year, selected.month)}
          </p>
        </div>
      </div>
    </section>
  )
}
