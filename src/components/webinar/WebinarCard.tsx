import { Calendar, User, Users, AlertTriangle } from 'lucide-react'
import type { Webinar } from '../../types'
import {
  Badge,
  categoryBadgeVariant,
  webinarTypeBadge,
  webinarTypeLabel,
} from '../ui/Badge'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'
import { Countdown } from '../ui/Countdown'
import { ProgressBar } from '../ui/ProgressBar'
import { formatCategory, formatCurrency, formatDateTime } from '../../utils/format'

interface WebinarCardProps {
  webinar: Webinar
}

export function WebinarCard({ webinar }: WebinarCardProps) {
  const fillPct = (webinar.enrolled / webinar.maxSeats) * 100
  const seatsLeft = webinar.maxSeats - webinar.enrolled
  const almostFull = fillPct >= 85

  return (
    <Card hover className="flex flex-col animate-in">
      <div className="mb-3 flex items-start justify-between gap-2">
        <Badge variant={webinarTypeBadge(webinar.type, webinar.price)}>
          {webinarTypeLabel(webinar.type, webinar.price)}
        </Badge>
        <Badge variant={categoryBadgeVariant(webinar.category)}>
          {formatCategory(webinar.category)}
        </Badge>
      </div>

      <h3 className="mb-1 text-[15px] font-semibold leading-snug text-text-primary">
        {webinar.title}
      </h3>

      <p className="mb-0.5 flex items-center gap-1.5 text-xs text-text-secondary">
        <User className="h-3 w-3 shrink-0" />
        {webinar.speaker}
      </p>
      <p className="mb-4 flex items-center gap-1.5 text-xs text-text-secondary">
        <Calendar className="h-3 w-3 shrink-0" />
        {formatDateTime(webinar.date)}
      </p>

      <div className="mb-4">
        <Countdown targetIso={webinar.registrationDeadline} />
      </div>

      <div className="mt-auto space-y-3">
        <div className="flex items-center justify-between">
          {webinar.type === 'paid' ? (
            <span className="text-base font-semibold text-success">
              {formatCurrency(webinar.price)}
            </span>
          ) : (
            <span className="flex items-center gap-1 text-xs text-text-tertiary">
              <Users className="h-3 w-3" />
              {webinar.enrolled} / {webinar.maxSeats} seats
            </span>
          )}
          <Button
            variant={webinar.type === 'paid' ? 'success' : 'primary'}
            size="sm"
          >
            {webinar.type === 'paid' ? 'Pay & Register' : 'Register free'}
          </Button>
        </div>

        {webinar.type === 'paid' && (
          <p className="flex items-center gap-1 text-xs text-text-tertiary">
            <Users className="h-3 w-3" />
            {webinar.enrolled} / {webinar.maxSeats} seats
          </p>
        )}

        <ProgressBar value={webinar.enrolled} max={webinar.maxSeats} />

        {almostFull && (
          <p className="flex items-center gap-1 text-[11px] font-medium text-danger">
            <AlertTriangle className="h-3 w-3" />
            Only {seatsLeft} seats left!
          </p>
        )}
      </div>
    </Card>
  )
}
