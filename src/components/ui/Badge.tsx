import { cn } from '../../utils/cn'
import type { Category, CourseBadge, WebinarType } from '../../types'

type BadgeVariant =
  | 'free'
  | 'paid'
  | 'ai'
  | 'coding'
  | 'devops'
  | 'popular'
  | 'new'
  | 'new-batch'
  | 'confirmed'
  | 'pending'
  | 'cancelled'
  | 'success'
  | 'refunded'
  | 'course'

const styles: Record<BadgeVariant, string> = {
  free: 'bg-emerald-50 text-emerald-700 ring-emerald-600/10',
  paid: 'bg-amber-50 text-amber-800 ring-amber-600/10',
  ai: 'bg-violet-50 text-violet-800 ring-violet-600/10',
  coding: 'bg-sky-50 text-sky-800 ring-sky-600/10',
  devops: 'bg-orange-50 text-orange-800 ring-orange-600/10',
  popular: 'bg-teal-50 text-teal-800 ring-teal-600/10',
  new: 'bg-red-50 text-red-700 ring-red-600/10',
  'new-batch': 'bg-red-50 text-red-700 ring-red-600/10',
  confirmed: 'bg-emerald-50 text-emerald-700 ring-emerald-600/10',
  pending: 'bg-amber-50 text-amber-800 ring-amber-600/10',
  cancelled: 'bg-red-50 text-red-700 ring-red-600/10',
  success: 'bg-emerald-50 text-emerald-700 ring-emerald-600/10',
  refunded: 'bg-amber-50 text-amber-800 ring-amber-600/10',
  course: 'bg-amber-50 text-amber-800 ring-amber-600/10',
}

interface BadgeProps {
  variant: BadgeVariant
  children: React.ReactNode
  className?: string
}

export function Badge({ variant, children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ring-1 ring-inset',
        styles[variant],
        className,
      )}
    >
      {children}
    </span>
  )
}

export function categoryBadgeVariant(cat: Category): BadgeVariant {
  return cat
}

export function webinarTypeBadge(type: WebinarType, _price?: number): BadgeVariant {
  return type === 'free' ? 'free' : 'paid'
}

export function webinarTypeLabel(type: WebinarType, price?: number): string {
  if (type === 'free') return 'Free'
  return price ? `₹${price}` : 'Paid'
}

export function courseBadgeVariant(badge?: CourseBadge): BadgeVariant | null {
  if (!badge) return null
  return badge
}
