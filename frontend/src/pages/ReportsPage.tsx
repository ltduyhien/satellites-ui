import { useCallback, useMemo, useState } from 'react'
import { useAcquisitionsPolling } from '@/features/acquisitions/hooks/useAcquisitionsPolling'
import {
  getAvailableMonths,
  monthKey,
  MONTH_NAMES,
  ReportEditForm,
  ReportFormActions,
  ReportMonthNav,
  ReportViewContent,
  useReportForm,
  useReports,
} from '@/features/reports'
import { PageHeader } from '@/shared/ui/page-header'

export function ReportsPage() {
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
      <div className="flex h-full min-h-0 flex-col gap-4 pt-4">
        <PageHeader title="Reporting" subtitle="Monthly reports and analytics" />
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 text-destructive">
          Failed to load data: {error.message}
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-full min-h-0 flex-col gap-6 pt-4">
      <PageHeader title="Reporting" subtitle="Monthly reports and analytics" />

      <div className="flex min-h-0 flex-1 overflow-hidden rounded-xl border border-border bg-card">
        <ReportMonthNav
          availableMonths={availableMonths}
          reports={reports}
          selected={selected}
          onSelectMonth={handleSelectMonth}
        />

        <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
          <div className="min-h-0 flex-1 overflow-auto p-6">
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
      </div>
    </div>
  )
}
