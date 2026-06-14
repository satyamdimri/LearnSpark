import { useMemo, useState } from 'react'
import { Download, Search } from 'lucide-react'
import { useData } from '../../context/DataContext'
import type { RegistrationStatus } from '../../types'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { FilterPill } from '../../components/ui/FilterPill'
import { Input } from '../../components/ui/Input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/Table'
import { formatShortDate } from '../../utils/format'

type StatusFilter = RegistrationStatus | 'all'
type TypeFilter = 'all' | 'webinar' | 'course'

const statusBadge: Record<RegistrationStatus, 'confirmed' | 'pending' | 'cancelled'> = {
  confirmed: 'confirmed',
  pending: 'pending',
  cancelled: 'cancelled',
}

export function RegistrationsPage() {
  const { data } = useData()
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('all')
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    return data.registrations.filter((r) => {
      const statusMatch = statusFilter === 'all' || r.status === statusFilter
      const typeMatch = typeFilter === 'all' || r.itemType === typeFilter
      const q = search.toLowerCase()
      const searchMatch =
        !q ||
        r.name.toLowerCase().includes(q) ||
        r.email.toLowerCase().includes(q) ||
        r.itemTitle.toLowerCase().includes(q)
      return statusMatch && typeMatch && searchMatch
    })
  }, [data.registrations, statusFilter, typeFilter, search])

  const exportCsv = () => {
    const headers = ['Name', 'Email', 'Item', 'Type', 'Date', 'Status']
    const rows = filtered.map((r) => [
      r.name,
      r.email,
      r.itemTitle,
      r.itemType,
      r.date,
      r.status,
    ])
    const csv = [headers, ...rows].map((row) => row.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'registrations.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="animate-in space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Registrations</h1>
          <p className="mt-1 text-sm text-text-secondary">
            Track webinar and course sign-ups.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm" onClick={exportCsv}>
            <Download className="h-3.5 w-3.5" />
            Export CSV
          </Button>
          <div className="relative w-36">
            <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-text-tertiary" />
            <Input
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-medium uppercase tracking-wide text-text-tertiary">
            Type
          </span>
          {(['all', 'webinar', 'course'] as const).map((t) => (
            <FilterPill key={t} active={typeFilter === t} onClick={() => setTypeFilter(t)}>
              {t === 'all' ? 'All' : t === 'webinar' ? 'Webinar' : 'Course'}
            </FilterPill>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-medium uppercase tracking-wide text-text-tertiary">
            Status
          </span>
          {(['all', 'confirmed', 'pending', 'cancelled'] as const).map((s) => (
            <FilterPill
              key={s}
              active={statusFilter === s}
              onClick={() => setStatusFilter(s)}
            >
              {s === 'all' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}
            </FilterPill>
          ))}
        </div>
      </div>

      <Card padding="none">
        <Table>
          <TableHead>
            <TableHeader>Name</TableHeader>
            <TableHeader>Email</TableHeader>
            <TableHeader>Webinar / Course</TableHeader>
            <TableHeader>Type</TableHeader>
            <TableHeader>Date</TableHeader>
            <TableHeader>Status</TableHeader>
          </TableHead>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="py-8 text-center text-text-secondary">
                  No registrations found.
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="font-medium">{r.name}</TableCell>
                  <TableCell className="text-xs text-text-secondary">{r.email}</TableCell>
                  <TableCell className="text-xs">{r.itemTitle}</TableCell>
                  <TableCell>
                    <Badge variant={r.itemType === 'webinar' ? 'free' : 'course'}>
                      {r.itemType === 'webinar' ? 'Webinar' : 'Course'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs text-text-secondary">
                    {formatShortDate(r.date)}
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusBadge[r.status]}>
                      {r.status.charAt(0).toUpperCase() + r.status.slice(1)}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}
