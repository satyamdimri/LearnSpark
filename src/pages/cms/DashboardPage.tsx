import { Check, Clock, BookOpen, Coins, Users, Video } from 'lucide-react'
import { useData } from '../../context/DataContext'
import { Badge } from '../../components/ui/Badge'
import { Card } from '../../components/ui/Card'
import { ProgressBar } from '../../components/ui/ProgressBar'
import { StatCard } from '../../components/ui/StatCard'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/Table'
import { formatShortCurrency } from '../../utils/format'

export function DashboardPage() {
  const { data, webinars, courses } = useData()

  const totalRevenue = data.payments
    .filter((p) => p.status === 'success')
    .reduce((sum, p) => sum + p.amount, 0)

  const monthRevenue = data.payments
    .filter((p) => p.status === 'success')
    .reduce((sum, p) => sum + p.amount, 0)

  const recentRegs = [...data.registrations]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5)

  const fillRateWebinars = [...webinars]
    .sort((a, b) => b.enrolled / b.maxSeats - a.enrolled / a.maxSeats)
    .slice(0, 3)

  return (
    <div className="animate-in space-y-8">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Dashboard</h1>
        <p className="mt-1 text-sm text-text-secondary">
          Overview of your platform activity.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Active webinars" value={webinars.length} icon={Video} />
        <StatCard
          label="Registrations"
          value={data.registrations.length.toLocaleString()}
          icon={Users}
        />
        <StatCard
          label="Revenue (mo.)"
          value={formatShortCurrency(monthRevenue)}
          icon={Coins}
        />
        <StatCard label="Active courses" value={courses.length} icon={BookOpen} />
      </div>

      <div>
        <h2 className="mb-3 text-sm font-medium text-text-secondary">
          Recent registrations
        </h2>
        <Card padding="none">
          <Table>
            <TableHead>
              <TableHeader>Name</TableHeader>
              <TableHeader>Webinar / Course</TableHeader>
              <TableHeader>Type</TableHeader>
              <TableHeader>Status</TableHeader>
            </TableHead>
            <TableBody>
              {recentRegs.map((reg) => (
                <TableRow key={reg.id}>
                  <TableCell className="font-medium">{reg.name}</TableCell>
                  <TableCell className="text-text-secondary">{reg.itemTitle}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        reg.typeLabel === 'free'
                          ? 'free'
                          : reg.typeLabel === 'course'
                            ? 'course'
                            : 'paid'
                      }
                    >
                      {reg.typeLabel === 'free'
                        ? 'Free'
                        : reg.typeLabel === 'course'
                          ? 'Course'
                          : reg.amount
                            ? `₹${reg.amount}`
                            : 'Paid'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {reg.status === 'confirmed' && (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-success">
                        <Check className="h-3.5 w-3.5" />
                        Confirmed
                      </span>
                    )}
                    {reg.status === 'pending' && (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-warning">
                        <Clock className="h-3.5 w-3.5" />
                        Pending
                      </span>
                    )}
                    {reg.status === 'cancelled' && (
                      <Badge variant="cancelled">Cancelled</Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>

      <div>
        <h2 className="mb-3 text-sm font-medium text-text-secondary">
          Upcoming webinar fill rate
        </h2>
        <div className="space-y-4">
          {fillRateWebinars.map((w) => {
            const pct = (w.enrolled / w.maxSeats) * 100
            const fast = pct >= 85
            return (
              <div key={w.id}>
                <div className="mb-1.5 flex justify-between text-sm">
                  <span className="font-medium">{w.title}</span>
                  <span className={fast ? 'text-xs font-medium text-danger' : 'text-xs text-text-secondary'}>
                    {w.enrolled}/{w.maxSeats}
                    {fast ? ' — filling fast' : ''}
                  </span>
                </div>
                <ProgressBar value={w.enrolled} max={w.maxSeats} />
              </div>
            )
          })}
        </div>
      </div>

      <p className="text-xs text-text-tertiary">
        Total collected: {formatShortCurrency(totalRevenue)}
      </p>
    </div>
  )
}
