import { useState } from 'react'
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
import { RegistrationModal } from '../ui/RegistrationModal'
import { formatCategory, formatCurrency, formatDateTime } from '../../utils/format'
import { useData } from '../../context/DataContext'
import { useToast } from '../../context/ToastContext'

interface WebinarCardProps {
  webinar: Webinar
}

export function WebinarCard({ webinar }: WebinarCardProps) {
  const { registerWebinar } = useData()
  const { showToast } = useToast()
  const [modalOpen, setModalOpen] = useState(false)

  const fillPct = (webinar.enrolled / webinar.maxSeats) * 100
  const seatsLeft = webinar.maxSeats - webinar.enrolled
  const almostFull = fillPct >= 85
  const isFull = webinar.enrolled >= webinar.maxSeats

  const handleRegisterClick = () => {
    if (isFull) {
      showToast('Sorry, this webinar is fully booked.', 'error')
      return
    }
    setModalOpen(true)
  }

  const handleConfirm = (name: string, email: string) => {
    setModalOpen(false)
    const result = registerWebinar(webinar.id, name, email)
    if (result.success) {
      const msg =
        webinar.type === 'paid'
          ? `You're registered for "${webinar.title}"! Simulated payment of ${formatCurrency(webinar.price)} confirmed.`
          : `You're registered for "${webinar.title}"!`
      showToast(msg, 'success')
    } else if (result.reason === 'duplicate') {
      showToast(`${email} is already registered for this webinar.`, 'error')
    } else if (result.reason === 'full') {
      showToast('Sorry, this webinar just filled up!', 'error')
    } else {
      showToast('Registration failed. Please try again.', 'error')
    }
  }

  const buttonLabel = isFull
    ? 'Fully booked'
    : webinar.type === 'paid'
      ? 'Pay & Register'
      : 'Register free'

  return (
    <>
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
              variant={isFull ? 'secondary' : webinar.type === 'paid' ? 'success' : 'primary'}
              size="sm"
              onClick={handleRegisterClick}
              disabled={isFull}
            >
              {buttonLabel}
            </Button>
          </div>

          {webinar.type === 'paid' && (
            <p className="flex items-center gap-1 text-xs text-text-tertiary">
              <Users className="h-3 w-3" />
              {webinar.enrolled} / {webinar.maxSeats} seats
            </p>
          )}

          <ProgressBar value={webinar.enrolled} max={webinar.maxSeats} />

          {almostFull && !isFull && (
            <p className="flex items-center gap-1 text-[11px] font-medium text-danger">
              <AlertTriangle className="h-3 w-3" />
              Only {seatsLeft} seats left!
            </p>
          )}
          {isFull && (
            <p className="flex items-center gap-1 text-[11px] font-medium text-danger">
              <AlertTriangle className="h-3 w-3" />
              Webinar is fully booked
            </p>
          )}
        </div>
      </Card>

      <RegistrationModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        itemTitle={webinar.title}
        price={webinar.price}
        confirmLabel={webinar.type === 'paid' ? `Pay ${formatCurrency(webinar.price)} & Register` : 'Register free'}
        onConfirm={handleConfirm}
      />
    </>
  )
}
