import type { Category, CourseBadge, Duration } from '../types'

const CATEGORY_LABELS: Record<Category, string> = {
  ai: 'AI & ML',
  coding: 'Coding',
  devops: 'DevOps',
}

const DURATION_LABELS: Record<Duration, string> = {
  '1m': '1 month',
  '3m': '3 months',
  '6m': '6 months',
}

const BADGE_LABELS: Record<CourseBadge, string> = {
  popular: 'Popular',
  new: 'New',
  'new-batch': 'New batch',
}

export function formatCategory(cat: Category): string {
  return CATEGORY_LABELS[cat]
}

export function formatDuration(dur: Duration): string {
  return DURATION_LABELS[dur]
}

export function formatBadge(badge: CourseBadge): string {
  return BADGE_LABELS[badge]
}

export function formatCurrency(amount: number): string {
  return `₹${amount.toLocaleString('en-IN')}`
}

export function formatShortCurrency(amount: number): string {
  if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(1)}L`
  }
  if (amount >= 1000) {
    return `₹${(amount / 1000).toFixed(1)}K`
  }
  return formatCurrency(amount)
}

export function formatDate(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleDateString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  })
}

export function formatDateTime(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleDateString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })
}

export function formatBatchDate(iso: string): string {
  const d = new Date(iso + 'T00:00:00')
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

export function formatShortDate(iso: string): string {
  const d = new Date(iso + 'T00:00:00')
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
}

export function parseDateTimeInput(value: string): string | null {
  const match = value.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})\s+(\d{1,2}):(\d{2})$/)
  if (!match) return null
  const [, day, month, year, hour, minute] = match
  const d = new Date(+year, +month - 1, +day, +hour, +minute)
  return isNaN(d.getTime()) ? null : d.toISOString()
}

export function parseDateInput(value: string): string | null {
  const match = value.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/)
  if (!match) return null
  const [, day, month, year] = match
  const d = new Date(+year, +month - 1, +day)
  return isNaN(d.getTime()) ? null : d.toISOString().slice(0, 10)
}

export function toDateTimeInput(iso: string): string {
  const d = new Date(iso)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`
}

export function toDateInput(iso: string): string {
  const d = new Date(iso + (iso.includes('T') ? '' : 'T00:00:00'))
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`
}
