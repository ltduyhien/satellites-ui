import { ReportStatsBlock } from './ReportStatsBlock'
import { getFileIcon } from '../utils'
import type { SavedReport } from '../constants'

interface ReportViewContentProps {
  savedReport: SavedReport
  monthLabel: string
  acquisitions: { timestamp: number; ore_sites: number }[]
  selected: { year: number; month: number }
  isLoading: boolean
}

export function ReportViewContent({
  savedReport,
  monthLabel,
  acquisitions,
  selected,
  isLoading,
}: ReportViewContentProps) {
  return (
    <div className="space-y-6">
      <ReportStatsBlock
        monthLabel={monthLabel}
        acquisitions={acquisitions}
        selected={selected}
        isLoading={isLoading}
      />
      <section>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-muted-foreground">
              Notes and observations
            </label>
            <div className="text-sm">
              {savedReport.notes || (
                <span className="text-muted-foreground">— No notes —</span>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-muted-foreground">
              Attachments
            </label>
            {savedReport.fileNames.length > 0 ? (
              <ul className="space-y-1">
                {savedReport.fileNames.map((name, i) => {
                  const ext = name.split('.').pop()?.toLowerCase() ?? ''
                  return (
                    <li key={`${name}-${i}`} className="flex items-center gap-2 text-sm">
                      <span aria-hidden>{getFileIcon(ext)}</span>
                      <span className="truncate">{name}</span>
                    </li>
                  )
                })}
              </ul>
            ) : (
              <span className="text-sm text-muted-foreground">— No attachments —</span>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
