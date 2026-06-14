import { useState } from 'react'
import { Modal } from './Modal'
import { Input } from './Input'
import { Button } from './Button'
import { formatCurrency } from '../../utils/format'

interface RegistrationModalProps {
  open: boolean
  onClose: () => void
  /** Title of the webinar or course */
  itemTitle: string
  /** 'free' | number (price) */
  price: number | 'free'
  /** Label for the confirm button */
  confirmLabel: string
  onConfirm: (name: string, email: string) => void
}

export function RegistrationModal({
  open,
  onClose,
  itemTitle,
  price,
  confirmLabel,
  onConfirm,
}: RegistrationModalProps) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [nameError, setNameError] = useState('')
  const [emailError, setEmailError] = useState('')

  const reset = () => {
    setName('')
    setEmail('')
    setNameError('')
    setEmailError('')
  }

  const handleClose = () => {
    reset()
    onClose()
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    let valid = true

    if (!name.trim()) {
      setNameError('Please enter your full name')
      valid = false
    } else {
      setNameError('')
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!email.trim()) {
      setEmailError('Please enter your email address')
      valid = false
    } else if (!emailRegex.test(email.trim())) {
      setEmailError('Please enter a valid email address')
      valid = false
    } else {
      setEmailError('')
    }

    if (!valid) return

    onConfirm(name.trim(), email.trim().toLowerCase())
    reset()
  }

  const isFree = price === 'free' || price === 0
  const priceLabel = isFree ? 'Free' : formatCurrency(price as number)

  return (
    <Modal open={open} onClose={handleClose} title="Complete registration">
      <div className="mb-5 rounded-lg bg-gray-50 px-4 py-3">
        <p className="text-xs text-text-secondary">Registering for</p>
        <p className="mt-0.5 font-medium text-text-primary">{itemTitle}</p>
        <p className="mt-1 text-sm font-semibold text-success">{priceLabel}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Full name"
          placeholder="e.g. Priya Sharma"
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={nameError}
          autoFocus
        />
        <Input
          label="Email address"
          type="email"
          placeholder="e.g. priya@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={emailError}
        />

        {!isFree && (
          <p className="rounded-lg border border-amber-100 bg-amber-50 px-3 py-2 text-xs text-amber-800">
            💳 Payment of <strong>{priceLabel}</strong> will be simulated — no real charge.
          </p>
        )}

        <div className="flex gap-2 pt-1">
          <Button type="submit" variant={isFree ? 'primary' : 'success'} className="flex-1">
            {confirmLabel}
          </Button>
          <Button type="button" variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
        </div>
      </form>
    </Modal>
  )
}
