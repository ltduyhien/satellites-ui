import { useState, useMemo } from 'react'
import { CartesianGrid, ComposedChart, Line, XAxis, YAxis } from 'recharts'
import type { Acquisition } from '@/shared/api/endpoints'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/shared/ui/chart'
import { linearRegression } from '@/shared/utils/math'
import { GroupByControls } from './GroupByControls'
import { groupAcquisitions, getAvailableGroupBy, type GroupBy } from '../utils/groupAcquisitions'

const chartConfig = {
  period: { label: 'Period' },
  oreSites: {
    label: 'Ore Sites',
    color: 'var(--color-mars-500)',
  },
  trend: {
    label: 'Trend',
    color: 'var(--chart-2)',
  },
} satisfies ChartConfig

interface OreFindingsChartProps {
  acquisitions: Acquisition[]
  title?: string
}

export function OreFindingsChart({ acquisitions, title = 'Ore Discoveries' }: OreFindingsChartProps) {
  const available = useMemo(() => getAvailableGroupBy(acquisitions), [acquisitions])
  const [groupBy, setGroupBy] = useState<GroupBy>(() =>
    available.includes('day') ? 'day' : available[0]
  )
  const [windowOffset, setWindowOffset] = useState(0)

  const { data, canPrev, canNext } = useMemo(
    () => groupAcquisitions(acquisitions, groupBy, windowOffset),
    [acquisitions, groupBy, windowOffset]
  )

  const chartData = useMemo(() => {
    const base = data.map((d) => ({ period: d.period, label: d.label, oreSites: d.oreSites }))
    const trendValues = linearRegression(base.map((d) => d.oreSites))
    return base.map((d, i) => ({ ...d, trend: Math.round(trendValues[i] * 100) / 100 }))
  }, [data])

  const timeRangeLabel =
    data.length === 0
      ? ''
      : data.length === 1
        ? data[0].label
        : `${data[0].label} – ${data[data.length - 1].label}`

  return (
    <div className="flex h-full min-h-0 flex-col gap-4">
      <div className="flex shrink-0 flex-wrap items-center justify-between gap-4">
        <h2 className="text-lg font-semibold">{title}</h2>
      </div>
      <GroupByControls
        available={available}
        groupBy={groupBy}
        timeRangeLabel={timeRangeLabel}
        canPrev={canPrev}
        canNext={canNext}
        onGroupByChange={(g) => {
          setGroupBy(g)
          setWindowOffset(0)
        }}
        onPrev={() => setWindowOffset((o) => o - 1)}
        onNext={() => setWindowOffset((o) => o + 1)}
      />

      {chartData.length === 0
          ? (
            <p className="text-sm text-muted-foreground">No data for this range.</p>
            )
          : (
            <div className="min-h-0 flex-1 pt-6">
              <ChartContainer config={chartConfig} className="aspect-auto h-full min-h-[200px] w-full">
                <ComposedChart
                  accessibilityLayer
                  data={chartData}
                  margin={{ left: 0, right: 12 }}
                >
                  <CartesianGrid vertical={false} strokeDasharray="3 3" />
                  <YAxis
                    dataKey="oreSites"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    allowDecimals={false}
                  />
                  <XAxis
                    dataKey="label"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    minTickGap={24}
                  />
                  <ChartTooltip
                    isAnimationActive={false}
                    animationDuration={0}
                    content={
                      <ChartTooltipContent
                        labelFormatter={(value, payload) => {
                          const p = payload?.[0]?.payload
                          return p?.label ?? value
                        }}
                      />
                    }
                  />
                  <Line
                    type="monotone"
                    dataKey="oreSites"
                    stroke="var(--color-oreSites)"
                    strokeWidth={2}
                    dot={false}
                    connectNulls
                    animationDuration={250}
                  />
                  <Line
                    type="monotone"
                    dataKey="trend"
                    stroke="var(--color-trend)"
                    strokeWidth={2}
                    dot={false}
                    connectNulls
                    animationDuration={250}
                  />
                </ComposedChart>
              </ChartContainer>
            </div>
          )}
    </div>
  )
}
