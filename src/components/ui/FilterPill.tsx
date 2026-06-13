import { cn } from '../../utils/cn'

interface FilterPillProps {
  active?: boolean
  onClick?: () => void
  children: React.ReactNode
  className?: string
}

export function FilterPill({ active, onClick, children, className }: FilterPillProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'rounded-full border px-3 py-1 text-xs font-medium transition-all duration-150',
        active
          ? 'border-transparent bg-gray-900 text-white shadow-sm'
          : 'border-border bg-white text-text-secondary hover:border-gray-300 hover:text-text-primary',
        className,
      )}
    >
      {children}
    </button>
  )
}
