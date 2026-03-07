import { ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'
import { Button } from '@/shared/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu'
import { GROUP_LABELS, type GroupBy } from '../utils/groupAcquisitions'

interface GroupByControlsProps {
  available: GroupBy[]
  groupBy: GroupBy
  timeRangeLabel: string
  canPrev: boolean
  canNext: boolean
  onGroupByChange: (g: GroupBy) => void
  onPrev: () => void
  onNext: () => void
}

export function GroupByControls({
  available,
  groupBy,
  timeRangeLabel,
  canPrev,
  canNext,
  onGroupByChange,
  onPrev,
  onNext,
}: GroupByControlsProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div className="flex flex-1 items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              {GROUP_LABELS[groupBy]}
              <ChevronDownIcon className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            {available.map((g) => (
              <DropdownMenuItem key={g} onClick={() => onGroupByChange(g)}>
                {GROUP_LABELS[g]}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="icon"
            className="size-8"
            onClick={onPrev}
            disabled={!canPrev}
            aria-label="Previous period"
          >
            <ChevronLeftIcon className="size-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="size-8"
            onClick={onNext}
            disabled={!canNext}
            aria-label="Next period"
          >
            <ChevronRightIcon className="size-4" />
          </Button>
        </div>
      </div>
      {timeRangeLabel && (
        <p className="shrink-0 text-sm text-muted-foreground">{timeRangeLabel}</p>
      )}
    </div>
  )
}
