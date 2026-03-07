import { FileUpIcon, XIcon } from 'lucide-react'
import { Button } from '@/shared/ui/button'
import { cn } from '@/shared/utils/cn'
import { ReportStatsBlock } from './ReportStatsBlock'
import { getFileIcon } from '../utils'
import { ACCEPT_ATTR, ALLOWED_EXTENSIONS } from '../constants'

interface ReportEditFormProps {
  monthLabel: string
  acquisitions: { timestamp: number; ore_sites: number }[]
  selected: { year: number; month: number }
  isLoading: boolean
  customReport: string
  onCustomReportChange: (value: string) => void
  files: File[]
  rejectReason: string | null
  inputRef: React.RefObject<HTMLInputElement | null>
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onDrop: (e: React.DragEvent) => void
  onDragOver: (e: React.DragEvent) => void
  onRemoveFile: (index: number) => void
  onSubmit: (e: React.FormEvent) => void
}

export function ReportEditForm({
  monthLabel,
  acquisitions,
  selected,
  isLoading,
  customReport,
  onCustomReportChange,
  files,
  rejectReason,
  inputRef,
  onFileChange,
  onDrop,
  onDragOver,
  onRemoveFile,
  onSubmit,
}: ReportEditFormProps) {
  return (
    <form id="report-form" onSubmit={onSubmit} className="flex flex-col gap-6">
      <ReportStatsBlock
        monthLabel={monthLabel}
        acquisitions={acquisitions}
        selected={selected}
        isLoading={isLoading}
      />
      <section>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="flex flex-col gap-2">
            <label htmlFor="custom-report" className="text-sm font-medium text-muted-foreground">
              Notes and observations
            </label>
            <textarea
              id="custom-report"
              value={customReport}
              onChange={(e) => onCustomReportChange(e.target.value)}
              placeholder="Add any additional notes or observations for this report…"
              className="min-h-[140px] w-full resize-y rounded-lg border border-input bg-muted/30 px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              rows={5}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label id="attachments-label" className="text-sm font-medium text-muted-foreground">
              Attachments
            </label>
            <div
              role="button"
              tabIndex={0}
              aria-labelledby="attachments-label"
              onDrop={onDrop}
              onDragOver={onDragOver}
              onClick={() => inputRef.current?.click()}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  inputRef.current?.click()
                }
              }}
              className={cn(
                'flex min-h-[140px] flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-input bg-muted/30 px-4 py-6 transition-colors',
                'hover:border-muted-foreground/40 hover:bg-muted/50',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
              )}
            >
              <input
                ref={inputRef}
                type="file"
                accept={ACCEPT_ATTR}
                multiple
                className="sr-only"
                onChange={onFileChange}
              />
              <FileUpIcon className="size-8 text-muted-foreground" />
              <p className="text-center text-sm text-muted-foreground">
                Drop files here or click to browse
              </p>
              <p className="text-xs text-muted-foreground">
                Allowed: {ALLOWED_EXTENSIONS.join(', ')}
              </p>
              {files.length > 0 && (
                <p className="text-xs font-medium text-foreground">
                  {files.length} file{files.length !== 1 ? 's' : ''} selected
                </p>
              )}
            </div>
            {rejectReason && (
              <p className="text-xs text-destructive" role="alert">
                {rejectReason}
              </p>
            )}
            {files.length > 0 && (
              <ul className="mt-1 space-y-1">
                {files.map((f, i) => {
                  const ext = f.name.split('.').pop()?.toLowerCase() ?? ''
                  return (
                    <li
                      key={`${f.name}-${i}`}
                      className="flex items-center gap-2 rounded-md bg-muted/50 px-2 py-1.5 text-sm"
                    >
                      <span aria-hidden>{getFileIcon(ext)}</span>
                      <span className="min-w-0 flex-1 truncate" title={f.name}>
                        {f.name}
                      </span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-xs"
                        aria-label={`Remove ${f.name}`}
                        onClick={(e) => {
                          e.stopPropagation()
                          onRemoveFile(i)
                        }}
                      >
                        <XIcon className="size-3" />
                      </Button>
                    </li>
                  )
                })}
              </ul>
            )}
          </div>
        </div>
      </section>
    </form>
  )
}
