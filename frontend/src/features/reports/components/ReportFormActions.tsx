import { Button } from '@/shared/ui/button'

interface ReportFormActionsProps {
  onReset: (e: React.MouseEvent) => void
}

export function ReportFormActions({ onReset }: ReportFormActionsProps) {
  return (
    <div className="shrink-0 border-t border-border bg-muted/30 p-4 md:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-stretch sm:justify-between">
        <Button type="button" variant="outline" size="default" className="h-12 w-full sm:h-9 sm:w-auto" onClick={onReset}>
          Reset All Fields
        </Button>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-stretch sm:gap-3">
          <Button type="button" variant="outline" size="default" className="h-12 w-full sm:h-9 sm:w-auto">
            Schedule Sending Report
          </Button>
          <Button type="submit" form="report-form" size="default" className="h-12 w-full sm:h-9 sm:w-auto">
            Send Report
          </Button>
        </div>
      </div>
    </div>
  )
}
