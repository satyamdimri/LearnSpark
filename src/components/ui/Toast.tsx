import { CheckCircle2, Info, XCircle, X } from 'lucide-react'
import { cn } from '../../utils/cn'
import type { ToastMessage } from '../../context/ToastContext'

interface ToastProps {
  toasts: ToastMessage[]
  onDismiss: (id: string) => void
}

const toastStyles = {
  success: {
    container: 'bg-white border-emerald-200 shadow-emerald-100/60',
    icon: 'text-emerald-500',
    Icon: CheckCircle2,
  },
  error: {
    container: 'bg-white border-red-200 shadow-red-100/60',
    icon: 'text-red-500',
    Icon: XCircle,
  },
  info: {
    container: 'bg-white border-brand-200 shadow-brand-100/60',
    icon: 'text-brand-600',
    Icon: Info,
  },
}

export function Toast({ toasts, onDismiss }: ToastProps) {
  if (toasts.length === 0) return null

  return (
    <div
      className="fixed bottom-20 right-4 z-[100] flex flex-col gap-2"
      aria-live="polite"
      aria-atomic="false"
    >
      {toasts.map((toast) => {
        const { container, icon, Icon } = toastStyles[toast.type]
        return (
          <div
            key={toast.id}
            className={cn(
              'flex items-start gap-3 rounded-xl border px-4 py-3 shadow-lg animate-in',
              'min-w-[260px] max-w-[340px]',
              container,
            )}
            role="alert"
          >
            <Icon className={cn('mt-0.5 h-4 w-4 shrink-0', icon)} />
            <p className="flex-1 text-sm text-text-primary leading-snug">{toast.message}</p>
            <button
              onClick={() => onDismiss(toast.id)}
              className="ml-1 rounded-md p-0.5 text-text-tertiary transition-colors hover:bg-gray-100 hover:text-text-primary"
              aria-label="Dismiss"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        )
      })}
    </div>
  )
}
