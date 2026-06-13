import { cn } from '../../utils/cn'
import { pad, useCountdown } from '../../hooks/useCountdown'

interface CountdownProps {
  targetIso: string
  label?: string
  compact?: boolean
}

export function Countdown({ targetIso, label = 'Registration closes in', compact }: CountdownProps) {
  const { days, hours, minutes, seconds, expired } = useCountdown(targetIso)

  const blocks = [
    { value: days, label: 'days' },
    { value: hours, label: 'hrs' },
    { value: minutes, label: 'min' },
    { value: seconds, label: 'sec' },
  ]

  return (
    <div
      className={cn(
        'rounded-lg bg-gray-50 ring-1 ring-gray-100',
        compact ? 'p-2.5' : 'p-3',
      )}
    >
      <p className="mb-2 text-[10px] font-medium uppercase tracking-wide text-text-tertiary">
        {expired ? 'Registration closed' : label}
      </p>
      {!expired && (
        <div className="flex items-center gap-1">
          {blocks.map((block, i) => (
            <span key={block.label} className="flex items-center gap-1">
              {i > 0 && <span className="text-sm font-medium text-text-tertiary">:</span>}
              <div className="min-w-[34px] rounded-md bg-white px-1.5 py-1 text-center shadow-sm ring-1 ring-gray-100">
                <div className="text-sm font-semibold tabular-nums text-text-primary">
                  {pad(block.value)}
                </div>
                <div className="text-[9px] uppercase tracking-wide text-text-tertiary">
                  {block.label}
                </div>
              </div>
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
