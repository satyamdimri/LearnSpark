import { useState } from 'react'
import { Pencil, Plus, Trash2 } from 'lucide-react'
import { useData } from '../../context/DataContext'
import type { Category, Course, CourseFormData, Duration } from '../../types'
import { Badge, categoryBadgeVariant } from '../../components/ui/Badge'
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
import { formatCurrency, formatDuration, parseDateInput, toDateInput } from '../../utils/format'

const emptyForm = (): CourseFormData => ({
  title: '',
  category: 'ai',
  duration: '3m',
  price: '',
  originalPrice: '',
  batchStartDate: '',
  schedule: 'weekend',
  classTimings: '',
  maxStudents: '40',
  syllabus: '',
  tools: '',
  certificate: true,
  rating: '4.5',
})

function courseToForm(c: Course): CourseFormData {
  return {
    title: c.title,
    category: c.category,
    duration: c.duration,
    price: String(c.price),
    originalPrice: String(c.originalPrice),
    batchStartDate: toDateInput(c.batchStartDate),
    schedule: c.schedule,
    classTimings: c.classTimings,
    maxStudents: String(c.maxStudents),
    syllabus: c.syllabus,
    tools: c.tools,
    certificate: c.certificate,
    rating: String(c.rating),
  }
}

export function CMSCoursesPage() {
  const { courses, addCourse, updateCourse, deleteCourse } = useData()
  const [form, setForm] = useState<CourseFormData>(emptyForm)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [error, setError] = useState('')

  const updateField = <K extends keyof CourseFormData>(
    key: K,
    value: CourseFormData[K],
  ) => setForm((f) => ({ ...f, [key]: value }))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.title.trim()) {
      setError('Course title is required')
      return
    }
    if (!parseDateInput(form.batchStartDate)) {
      setError('Invalid batch date. Use DD/MM/YYYY')
      return
    }
    if (editingId) {
      updateCourse(editingId, form)
    } else {
      addCourse(form)
    }
    resetForm()
  }

  const resetForm = () => {
    setForm(emptyForm())
    setEditingId(null)
    setModalOpen(false)
    setError('')
  }

  const startEdit = (c: Course) => {
    setForm(courseToForm(c))
    setEditingId(c.id)
    setModalOpen(true)
  }

  const handleDelete = (id: string, title: string) => {
    if (window.confirm(`Delete "${title}"? This cannot be undone.`)) {
      deleteCourse(id)
      if (editingId === id) resetForm()
    }
  }

  return (
    <div className="animate-in space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Manage courses</h1>
          <p className="mt-1 text-sm text-text-secondary">
            Create and manage weekend course programs.
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
          Add course
        </Button>
      </div>

      <Card padding="none">
        <Table>
          <TableHead>
            <TableHeader>Title</TableHeader>
            <TableHeader>Category</TableHeader>
            <TableHeader>Duration</TableHeader>
            <TableHeader>Price</TableHeader>
            <TableHeader>Enrolled</TableHeader>
            <TableHeader className="text-right">Actions</TableHeader>
          </TableHead>
          <TableBody>
            {courses.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="py-8 text-center text-text-secondary">
                  No courses yet. Add your first course below.
                </TableCell>
              </TableRow>
            ) : (
              courses.map((c) => (
                <TableRow key={c.id}>
                  <TableCell className="font-medium">{c.title}</TableCell>
                  <TableCell>
                    <Badge variant={categoryBadgeVariant(c.category)}>
                      {c.category === 'ai' ? 'AI' : c.category === 'coding' ? 'Coding' : 'DevOps'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-text-secondary">
                    {formatDuration(c.duration)}
                  </TableCell>
                  <TableCell className="font-medium tabular-nums">
                    {formatCurrency(c.price)}
                  </TableCell>
                  <TableCell className="tabular-nums">{c.enrolled}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <button
                        onClick={() => startEdit(c)}
                        className="rounded-lg p-2 text-text-secondary transition-colors hover:bg-gray-100 hover:text-text-primary"
                        aria-label={`Edit ${c.title}`}
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(c.id, c.title)}
                        className="rounded-lg p-2 text-red-500 transition-colors hover:bg-red-50"
                        aria-label={`Delete ${c.title}`}
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
        <h2 className="mb-4 text-sm font-semibold">Add new course</h2>
        <CourseForm
          form={form}
          updateField={updateField}
          onSubmit={handleSubmit}
          error={error}
          submitLabel="Publish course"
        />
      </Card>

      <Modal
        open={modalOpen}
        onClose={resetForm}
        title={editingId ? 'Edit course' : 'Add course'}
        wide
      >
        <CourseForm
          form={form}
          updateField={updateField}
          onSubmit={handleSubmit}
          error={error}
          submitLabel={editingId ? 'Save changes' : 'Publish course'}
          onCancel={resetForm}
        />
      </Modal>
    </div>
  )
}

interface CourseFormProps {
  form: CourseFormData
  updateField: <K extends keyof CourseFormData>(key: K, value: CourseFormData[K]) => void
  onSubmit: (e: React.FormEvent) => void
  error?: string
  submitLabel: string
  onCancel?: () => void
}

function CourseForm({
  form,
  updateField,
  onSubmit,
  error,
  submitLabel,
  onCancel,
}: CourseFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <Input
        label="Course title"
        placeholder="e.g. Machine Learning Bootcamp"
        value={form.title}
        onChange={(e) => updateField('title', e.target.value)}
        required
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <Select
          label="Category"
          value={form.category}
          onChange={(e) => updateField('category', e.target.value as Category)}
        >
          <option value="ai">AI & ML</option>
          <option value="coding">Coding</option>
          <option value="devops">DevOps</option>
        </Select>
        <Select
          label="Duration"
          value={form.duration}
          onChange={(e) => updateField('duration', e.target.value as Duration)}
        >
          <option value="1m">1 month</option>
          <option value="3m">3 months</option>
          <option value="6m">6 months</option>
        </Select>
        <Input
          label="Price (₹)"
          placeholder="e.g. 14999"
          value={form.price}
          onChange={(e) => updateField('price', e.target.value)}
        />
        <Input
          label="Original price (strikethrough)"
          placeholder="e.g. 24999"
          value={form.originalPrice}
          onChange={(e) => updateField('originalPrice', e.target.value)}
        />
        <Input
          label="Batch start date"
          placeholder="DD/MM/YYYY"
          value={form.batchStartDate}
          onChange={(e) => updateField('batchStartDate', e.target.value)}
        />
        <Select
          label="Schedule"
          value={form.schedule}
          onChange={(e) =>
            updateField('schedule', e.target.value as 'weekend' | 'weekdays')
          }
        >
          <option value="weekend">Weekend (Sat & Sun)</option>
          <option value="weekdays">Weekdays</option>
        </Select>
        <Input
          label="Class timings"
          placeholder="e.g. 10:00 AM – 1:00 PM"
          value={form.classTimings}
          onChange={(e) => updateField('classTimings', e.target.value)}
        />
        <Input
          label="Max students per batch"
          placeholder="e.g. 40"
          value={form.maxStudents}
          onChange={(e) => updateField('maxStudents', e.target.value)}
        />
        <Input
          label="Tools / stack"
          placeholder="Python · TensorFlow · Projects"
          value={form.tools}
          onChange={(e) => updateField('tools', e.target.value)}
        />
        <Input
          label="Rating"
          placeholder="4.5"
          value={form.rating}
          onChange={(e) => updateField('rating', e.target.value)}
        />
      </div>
      <Textarea
        label="Syllabus / description"
        placeholder="Topics covered, tools, and outcomes..."
        value={form.syllabus}
        onChange={(e) => updateField('syllabus', e.target.value)}
      />
      <label className="flex cursor-pointer items-center gap-2">
        <input
          type="checkbox"
          checked={form.certificate}
          onChange={(e) => updateField('certificate', e.target.checked)}
          className="rounded border-border text-brand-600 focus:ring-brand-500"
        />
        <span className="text-sm text-text-secondary">Certificate of completion</span>
      </label>
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
