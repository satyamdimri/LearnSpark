import { cn } from '../../utils/cn'

interface ProgressBarProps {
  value: number
  max: number
  className?: string
}

const colors = {
  brand: 'bg-brand-600',
  danger: 'bg-red-500',
  success: 'bg-emerald-600',
}

export function ProgressBar({ value, max, className }: ProgressBarProps) {
  const pct = max > 0 ? Math.min(100, (value / max) * 100) : 0
  const barColor =
    pct >= 85 ? colors.danger : pct >= 60 ? colors.brand : colors.success

  return (
    <div className={cn('h-1 overflow-hidden rounded-full bg-gray-100', className)}>
      <div
        className={cn('h-full rounded-full transition-all duration-500', barColor)}
        style={{ width: `${pct}%` }}
      />
    </div>
  )
}
