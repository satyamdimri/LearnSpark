import { useData } from '../../context/DataContext'
import { Badge } from '../../components/ui/Badge'
import { Card } from '../../components/ui/Card'
import { StatCard } from '../../components/ui/StatCard'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/Table'
import { formatCurrency, formatShortCurrency } from '../../utils/format'
import type { PaymentStatus } from '../../types'

const paymentBadge: Record<PaymentStatus, 'success' | 'refunded' | 'pending'> = {
  success: 'success',
  refunded: 'refunded',
  pending: 'pending',
}

export function PaymentsPage() {
  const { data } = useData()

  const totalCollected = data.payments
    .filter((p) => p.status === 'success')
    .reduce((sum, p) => sum + p.amount, 0)

  const monthCollected = data.payments
    .filter((p) => p.status === 'success')
    .reduce((sum, p) => sum + p.amount, 0)

  return (
    <div className="animate-in space-y-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Payments</h1>
        <p className="mt-1 text-sm text-text-secondary">
          Transaction history and revenue summary.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Total collected" value={formatShortCurrency(totalCollected)} />
        <StatCard label="This month" value={formatShortCurrency(monthCollected)} />
        <StatCard
          label="Pending refunds"
          value={formatCurrency(12400)}
          highlight
        />
      </div>

      <Card padding="none">
        <Table>
          <TableHead>
            <TableHeader>Txn ID</TableHeader>
            <TableHeader>Name</TableHeader>
            <TableHeader>Item</TableHeader>
            <TableHeader>Amount</TableHeader>
            <TableHeader>Gateway</TableHeader>
            <TableHeader>Status</TableHeader>
          </TableHead>
          <TableBody>
            {data.payments.map((p) => (
              <TableRow key={p.id}>
                <TableCell className="font-mono text-xs text-text-tertiary">
                  #{p.txnId}
                </TableCell>
                <TableCell className="font-medium">{p.name}</TableCell>
                <TableCell className="text-xs text-text-secondary">{p.item}</TableCell>
                <TableCell className="font-medium tabular-nums">
                  {formatCurrency(p.amount)}
                </TableCell>
                <TableCell className="text-xs text-text-secondary">{p.gateway}</TableCell>
                <TableCell>
                  <Badge variant={paymentBadge[p.status]}>
                    {p.status.charAt(0).toUpperCase() + p.status.slice(1)}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}
