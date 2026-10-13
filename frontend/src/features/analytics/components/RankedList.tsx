import { cn } from '@/shared/lib/utils'
import { Progress } from '@/shared/components/ui/progress'

export interface RankedRow {
  key: string
  label: string
  value: number
  valueLabel: string
}

interface RankedListProps {
  rows: RankedRow[]
  tone?: 'primary' | 'destructive'
}

export function RankedList({ rows, tone = 'primary' }: RankedListProps) {
  const max = Math.max(1, ...rows.map((row) => row.value))

  return (
    <ol className="space-y-4">
      {rows.map((row, index) => (
        <li key={row.key} className="space-y-1.5">
          <div className="flex items-center justify-between gap-3">
            <span className="flex min-w-0 items-center gap-3">
              <span className="grid size-6 shrink-0 place-items-center rounded-full bg-muted text-xs font-semibold">
                {index + 1}
              </span>
              <span className="truncate font-medium">{row.label}</span>
            </span>
            <span className="shrink-0 text-sm font-semibold tabular-nums">{row.valueLabel}</span>
          </div>
          <Progress
            value={(row.value / max) * 100}
            className={cn(
              'h-2',
              tone === 'destructive' && '[&_[data-slot=progress-indicator]]:bg-destructive',
            )}
          />
        </li>
      ))}
    </ol>
  )
}
