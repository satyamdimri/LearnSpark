import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { generateId, loadData, saveData } from '../data/storage'
import type {
  AppData,
  Course,
  CourseFormData,
  Webinar,
  WebinarFormData,
} from '../types'
import { parseDateInput, parseDateTimeInput } from '../utils/format'

interface DataContextValue {
  data: AppData
  webinars: Webinar[]
  courses: Course[]
  addWebinar: (form: WebinarFormData) => void
  updateWebinar: (id: string, form: WebinarFormData) => void
  deleteWebinar: (id: string) => void
  addCourse: (form: CourseFormData) => void
  updateCourse: (id: string, form: CourseFormData) => void
  deleteCourse: (id: string) => void
}

const DataContext = createContext<DataContextValue | null>(null)

function webinarFromForm(form: WebinarFormData, id?: string, enrolled = 0): Webinar | null {
  const date = parseDateTimeInput(form.date)
  const deadline = parseDateTimeInput(form.registrationDeadline)
  if (!date || !deadline || !form.title.trim()) return null

  return {
    id: id ?? generateId('w'),
    title: form.title.trim(),
    speaker: form.speaker.trim(),
    date,
    registrationDeadline: deadline,
    type: form.type,
    price: form.type === 'paid' ? Number(form.price) || 0 : 0,
    maxSeats: Number(form.maxSeats) || 100,
    enrolled,
    category: form.category,
    description: form.description.trim(),
  }
}

function courseFromForm(form: CourseFormData, id?: string, enrolled = 0): Course | null {
  const batchStartDate = parseDateInput(form.batchStartDate)
  if (!batchStartDate || !form.title.trim()) return null

  return {
    id: id ?? generateId('c'),
    title: form.title.trim(),
    syllabus: form.syllabus.trim(),
    tools: form.tools.trim(),
    category: form.category,
    duration: form.duration,
    price: Number(form.price) || 0,
    originalPrice: Number(form.originalPrice) || 0,
    batchStartDate,
    schedule: form.schedule,
    classTimings: form.classTimings.trim(),
    rating: Number(form.rating) || 4.5,
    enrolled,
    maxStudents: Number(form.maxStudents) || 40,
    certificate: form.certificate,
  }
}

export function DataProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<AppData>(() => loadData())

  useEffect(() => {
    saveData(data)
  }, [data])

  const addWebinar = useCallback((form: WebinarFormData) => {
    const webinar = webinarFromForm(form)
    if (!webinar) return
    setData((prev) => ({ ...prev, webinars: [...prev.webinars, webinar] }))
  }, [])

  const updateWebinar = useCallback((id: string, form: WebinarFormData) => {
    setData((prev) => {
      const existing = prev.webinars.find((w) => w.id === id)
      const updated = webinarFromForm(form, id, existing?.enrolled ?? 0)
      if (!updated) return prev
      return {
        ...prev,
        webinars: prev.webinars.map((w) => (w.id === id ? updated : w)),
      }
    })
  }, [])

  const deleteWebinar = useCallback((id: string) => {
    setData((prev) => ({
      ...prev,
      webinars: prev.webinars.filter((w) => w.id !== id),
    }))
  }, [])

  const addCourse = useCallback((form: CourseFormData) => {
    const course = courseFromForm(form)
    if (!course) return
    setData((prev) => ({ ...prev, courses: [...prev.courses, course] }))
  }, [])

  const updateCourse = useCallback((id: string, form: CourseFormData) => {
    setData((prev) => {
      const existing = prev.courses.find((c) => c.id === id)
      const updated = courseFromForm(form, id, existing?.enrolled ?? 0)
      if (!updated) return prev
      return {
        ...prev,
        courses: prev.courses.map((c) => (c.id === id ? updated : c)),
      }
    })
  }, [])

  const deleteCourse = useCallback((id: string) => {
    setData((prev) => ({
      ...prev,
      courses: prev.courses.filter((c) => c.id !== id),
    }))
  }, [])

  const value = useMemo(
    () => ({
      data,
      webinars: data.webinars,
      courses: data.courses,
      addWebinar,
      updateWebinar,
      deleteWebinar,
      addCourse,
      updateCourse,
      deleteCourse,
    }),
    [data, addWebinar, updateWebinar, deleteWebinar, addCourse, updateCourse, deleteCourse],
  )

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}

export function useData() {
  const ctx = useContext(DataContext)
  if (!ctx) throw new Error('useData must be used within DataProvider')
  return ctx
}
