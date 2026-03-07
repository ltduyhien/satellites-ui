import { Button } from '@/shared/ui/button'

interface ReportFormActionsProps {
  onReset: (e: React.MouseEvent) => void
}

export function ReportFormActions({ onReset }: ReportFormActionsProps) {
  return (
    <div className="shrink-0 border-t border-border bg-muted/30 p-6">
      <div className="flex flex-wrap items-stretch justify-between gap-3">
        <Button type="button" variant="outline" size="default" className="h-9" onClick={onReset}>
          Reset All Fields
        </Button>
        <div className="flex items-stretch gap-3">
          <Button type="button" variant="outline" size="default" className="h-9">
            Schedule Sending Report
          </Button>
          <Button type="submit" form="report-form" size="default" className="h-9">
            Send Report
          </Button>
        </div>
      </div>
    </div>
  )
}
