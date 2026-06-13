import { cn } from '../../utils/cn'
import type { LucideIcon } from 'lucide-react'

interface StatCardProps {
  label: string
  value: string | number
  icon?: LucideIcon
  trend?: string
  className?: string
  highlight?: boolean
}

export function StatCard({ label, value, icon: Icon, trend, className, highlight }: StatCardProps) {
  return (
    <div
      className={cn(
        'rounded-xl border border-border bg-white p-4 shadow-sm transition-shadow hover:shadow-md',
        className,
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-xs font-medium text-text-secondary">{label}</p>
        {Icon && (
          <div className="rounded-lg bg-brand-50 p-1.5 text-brand-600">
            <Icon className="h-3.5 w-3.5" />
          </div>
        )}
      </div>
      <p
        className={cn(
          'mt-2 text-2xl font-semibold tracking-tight tabular-nums',
          highlight ? 'text-orange-700' : 'text-text-primary',
        )}
      >
        {value}
      </p>
      {trend && <p className="mt-1 text-[11px] text-text-tertiary">{trend}</p>}
    </div>
  )
}
