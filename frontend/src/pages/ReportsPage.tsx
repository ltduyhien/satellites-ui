import { useCallback, useMemo, useState } from 'react'
import { useAcquisitionsPolling } from '@/features/acquisitions/hooks/useAcquisitionsPolling'
import {
  getAvailableMonths,
  monthKey,
  MONTH_NAMES,
  ReportEditForm,
  ReportFormActions,
  ReportMonthNav,
  ReportMonthSelect,
  ReportViewContent,
  useReportForm,
  useReports,
} from '@/features/reports'
import { useLayout } from '@/app/layout/LayoutContext'
import { PageHeader } from '@/shared/ui/page-header'

export function ReportsPage() {
  const layout = useLayout()
  const { acquisitions, isLoading, error } = useAcquisitionsPolling()
  const { reports, updateReport } = useReports()

  const now = new Date()
  const [selected, setSelected] = useState<{ year: number; month: number }>(() => ({
    year: now.getUTCFullYear(),
    month: now.getUTCMonth(),
  }))

  const availableMonths = useMemo(() => getAvailableMonths(acquisitions), [acquisitions])

  const selectedKey = monthKey(selected.year, selected.month)
  const isReported = Boolean(reports[selectedKey])
  const savedReport = reports[selectedKey]
  const monthLabel = `${MONTH_NAMES[selected.month]} ${selected.year}`

  const handleSend = useCallback(
    (notes: string, fileNames: string[]) => {
      updateReport(selectedKey, { notes, fileNames })
    },
    [selectedKey, updateReport]
  )

  const {
    customReport,
    setCustomReport,
    files,
    rejectReason,
    inputRef,
    handleFileChange,
    handleDrop,
    handleDragOver,
    removeFile,
    handleSend: handleFormSubmit,
    handleReset,
    resetOnMonthChange,
  } = useReportForm(handleSend)

  const handleSelectMonth = useCallback((year: number, month: number) => {
    setSelected({ year, month })
    resetOnMonthChange()
  }, [resetOnMonthChange])

  if (error) {
    return (
      <div className="flex h-full min-h-0 flex-col gap-4 pt-2">
        <PageHeader title="Reporting" subtitle="Monthly reports and analytics" />
        <div className="rounded-md border border-destructive/50 bg-destructive/10 px-4 py-3 text-destructive">
          Failed to load data: {error.message}
        </div>
      </div>
    )
  }

  const contentArea = (
    <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
      <div className="scrollbar-hide-mobile min-h-0 min-w-0 flex-1 overflow-auto p-4 md:p-6">
        {isReported && savedReport ? (
          <ReportViewContent
            savedReport={savedReport}
            monthLabel={monthLabel}
            acquisitions={acquisitions}
            selected={selected}
            isLoading={isLoading}
          />
        ) : (
          <ReportEditForm
            monthLabel={monthLabel}
            acquisitions={acquisitions}
            selected={selected}
            isLoading={isLoading}
            customReport={customReport}
            onCustomReportChange={setCustomReport}
            files={files}
            rejectReason={rejectReason}
            inputRef={inputRef}
            onFileChange={handleFileChange}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onRemoveFile={removeFile}
            onSubmit={handleFormSubmit}
          />
        )}
      </div>

      {!isReported && <ReportFormActions onReset={handleReset} />}
    </div>
  )

  if (layout?.isMobile) {
    return (
      <div className="scrollbar-hide-mobile flex min-h-0 min-w-0 flex-1 flex-col gap-4 overflow-y-auto overflow-x-hidden pt-2">
        <PageHeader title="Reporting" subtitle="Monthly reports and analytics" />

        <div className="flex min-w-0 flex-col gap-4">
          <ReportMonthSelect
            availableMonths={availableMonths}
            reports={reports}
            selected={selected}
            onSelectMonth={handleSelectMonth}
          />

          <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden rounded-lg border border-border bg-card">
            {contentArea}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-full min-h-0 flex-col gap-4 pt-2">
      <PageHeader title="Reporting" subtitle="Monthly reports and analytics" />

      <div className="flex min-h-0 flex-1 overflow-hidden rounded-lg border border-border bg-card">
        <ReportMonthNav
          availableMonths={availableMonths}
          reports={reports}
          selected={selected}
          onSelectMonth={handleSelectMonth}
        />
        {contentArea}
      </div>
    </div>
  )
}
