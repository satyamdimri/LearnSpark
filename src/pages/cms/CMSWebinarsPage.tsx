import { useState } from 'react'
import { Pencil, Plus, Trash2 } from 'lucide-react'
import { useData } from '../../context/DataContext'
import type { Category, Webinar, WebinarFormData, WebinarType } from '../../types'
import {
  Badge,
  webinarTypeBadge,
  webinarTypeLabel,
} from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { Input } from '../../components/ui/Input'
import { Modal } from '../../components/ui/Modal'
import { Select } from '../../components/ui/Select'
import { Textarea } from '../../components/ui/Textarea'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/Table'
import { formatDateTime, parseDateTimeInput, toDateTimeInput } from '../../utils/format'

const emptyForm = (): WebinarFormData => ({
  title: '',
  speaker: '',
  date: '',
  registrationDeadline: '',
  type: 'free',
  price: '',
  maxSeats: '500',
  category: 'ai',
  description: '',
})

function webinarToForm(w: Webinar): WebinarFormData {
  return {
    title: w.title,
    speaker: w.speaker,
    date: toDateTimeInput(w.date),
    registrationDeadline: toDateTimeInput(w.registrationDeadline),
    type: w.type,
    price: w.price ? String(w.price) : '',
    maxSeats: String(w.maxSeats),
    category: w.category,
    description: w.description,
  }
}

export function CMSWebinarsPage() {
  const { webinars, addWebinar, updateWebinar, deleteWebinar } = useData()
  const [form, setForm] = useState<WebinarFormData>(emptyForm)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [error, setError] = useState('')

  const sorted = [...webinars].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  )

  const updateField = <K extends keyof WebinarFormData>(
    key: K,
    value: WebinarFormData[K],
  ) => setForm((f) => ({ ...f, [key]: value }))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.title.trim()) {
      setError('Title is required')
      return
    }
    if (!parseDateTimeInput(form.date) || !parseDateTimeInput(form.registrationDeadline)) {
      setError('Invalid date format. Use DD/MM/YYYY HH:MM')
      return
    }
    if (editingId) {
      updateWebinar(editingId, form)
    } else {
      addWebinar(form)
    }
    resetForm()
  }

  const resetForm = () => {
    setForm(emptyForm())
    setEditingId(null)
    setModalOpen(false)
    setError('')
  }

  const startEdit = (w: Webinar) => {
    setForm(webinarToForm(w))
    setEditingId(w.id)
    setModalOpen(true)
  }

  const handleDelete = (id: string, title: string) => {
    if (window.confirm(`Delete "${title}"? This cannot be undone.`)) {
      deleteWebinar(id)
      if (editingId === id) resetForm()
    }
  }

  return (
    <div className="animate-in space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Manage webinars</h1>
          <p className="mt-1 text-sm text-text-secondary">
            Create, edit, and publish live webinar sessions.
          </p>
        </div>
        <Button
          onClick={() => {
            setForm(emptyForm())
            setEditingId(null)
            setModalOpen(true)
          }}
        >
          <Plus className="h-3.5 w-3.5" />
          Add webinar
        </Button>
      </div>

      <Card padding="none">
        <Table>
          <TableHead>
            <TableHeader>Title</TableHeader>
            <TableHeader>Date</TableHeader>
            <TableHeader>Type</TableHeader>
            <TableHeader>Seats</TableHeader>
            <TableHeader className="text-right">Actions</TableHeader>
          </TableHead>
          <TableBody>
            {sorted.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="py-8 text-center text-text-secondary">
                  No webinars yet. Add your first webinar below.
                </TableCell>
              </TableRow>
            ) : (
              sorted.map((w) => (
                <TableRow key={w.id}>
                  <TableCell className="font-medium">{w.title}</TableCell>
                  <TableCell className="text-text-secondary">
                    {formatDateTime(w.date)}
                  </TableCell>
                  <TableCell>
                    <Badge variant={webinarTypeBadge(w.type, w.price)}>
                      {webinarTypeLabel(w.type, w.price)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs tabular-nums">
                    {w.enrolled}/{w.maxSeats}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <button
                        onClick={() => startEdit(w)}
                        className="rounded-lg p-2 text-text-secondary transition-colors hover:bg-gray-100 hover:text-text-primary"
                        aria-label={`Edit ${w.title}`}
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(w.id, w.title)}
                        className="rounded-lg p-2 text-red-500 transition-colors hover:bg-red-50"
                        aria-label={`Delete ${w.title}`}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>

      <Card className="border-dashed border-2 border-gray-200 bg-gray-50/50">
        <h2 className="mb-4 text-sm font-semibold">Add new webinar</h2>
        <WebinarForm
          form={form}
          updateField={updateField}
          onSubmit={handleSubmit}
          error={error}
          submitLabel="Publish webinar"
        />
      </Card>

      <Modal
        open={modalOpen}
        onClose={resetForm}
        title={editingId ? 'Edit webinar' : 'Add webinar'}
        wide
      >
        <WebinarForm
          form={form}
          updateField={updateField}
          onSubmit={handleSubmit}
          error={error}
          submitLabel={editingId ? 'Save changes' : 'Publish webinar'}
          onCancel={resetForm}
        />
      </Modal>
    </div>
  )
}

interface WebinarFormProps {
  form: WebinarFormData
  updateField: <K extends keyof WebinarFormData>(key: K, value: WebinarFormData[K]) => void
  onSubmit: (e: React.FormEvent) => void
  error?: string
  submitLabel: string
  onCancel?: () => void
}

function WebinarForm({
  form,
  updateField,
  onSubmit,
  error,
  submitLabel,
  onCancel,
}: WebinarFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label="Title"
          placeholder="Webinar title"
          value={form.title}
          onChange={(e) => updateField('title', e.target.value)}
          required
        />
        <Input
          label="Speaker"
          placeholder="Speaker name"
          value={form.speaker}
          onChange={(e) => updateField('speaker', e.target.value)}
        />
        <Input
          label="Date & time"
          placeholder="DD/MM/YYYY HH:MM"
          value={form.date}
          onChange={(e) => updateField('date', e.target.value)}
        />
        <Input
          label="Reg. deadline"
          placeholder="DD/MM/YYYY HH:MM"
          value={form.registrationDeadline}
          onChange={(e) => updateField('registrationDeadline', e.target.value)}
        />
        <Select
          label="Type"
          value={form.type}
          onChange={(e) => updateField('type', e.target.value as WebinarType)}
        >
          <option value="free">Free</option>
          <option value="paid">Paid</option>
        </Select>
        <Input
          label="Price (₹) if paid"
          placeholder="e.g. 499"
          value={form.price}
          onChange={(e) => updateField('price', e.target.value)}
          disabled={form.type === 'free'}
        />
        <Input
          label="Max seats"
          placeholder="e.g. 500"
          value={form.maxSeats}
          onChange={(e) => updateField('maxSeats', e.target.value)}
        />
        <Select
          label="Category"
          value={form.category}
          onChange={(e) => updateField('category', e.target.value as Category)}
        >
          <option value="ai">AI & ML</option>
          <option value="coding">Coding</option>
          <option value="devops">DevOps</option>
        </Select>
      </div>
      <Textarea
        label="Description"
        placeholder="What will attendees learn?"
        value={form.description}
        onChange={(e) => updateField('description', e.target.value)}
      />
      {error && <p className="text-xs text-red-600">{error}</p>}
      <div className="flex gap-2">
        <Button type="submit">{submitLabel}</Button>
        {onCancel && (
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  )
}
