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
  Payment,
  Registration,
  Webinar,
  WebinarFormData,
} from '../types'
import { parseDateInput, parseDateTimeInput } from '../utils/format'

export type ActionResult =
  | { success: true }
  | { success: false; reason: 'duplicate' | 'full' | 'not_found' }

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
  registerWebinar: (webinarId: string, userName: string, userEmail: string) => ActionResult
  enrollCourse: (courseId: string, userName: string, userEmail: string) => ActionResult
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

/** Build a TXN id that looks plausible */
function generateTxnId(): string {
  return `TXN-${String(Math.floor(Math.random() * 9000) + 1000)}`
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

  /**
   * Register a user for a webinar.
   * Returns synchronously by reading the latest state snapshot.
   */
  const registerWebinar = useCallback(
    (webinarId: string, userName: string, userEmail: string): ActionResult => {
      // Read current state synchronously via functional update peek
      let result: ActionResult = { success: true }

      setData((prev) => {
        const webinar = prev.webinars.find((w) => w.id === webinarId)
        if (!webinar) {
          result = { success: false, reason: 'not_found' }
          return prev
        }

        // Duplicate check
        const alreadyRegistered = prev.registrations.some(
          (r) =>
            r.itemId === webinarId &&
            r.itemType === 'webinar' &&
            r.email.toLowerCase() === userEmail.toLowerCase(),
        )
        if (alreadyRegistered) {
          result = { success: false, reason: 'duplicate' }
          return prev
        }

        // Seat check
        if (webinar.enrolled >= webinar.maxSeats) {
          result = { success: false, reason: 'full' }
          return prev
        }

        result = { success: true }

        const today = new Date().toISOString().slice(0, 10)
        const isPaid = webinar.type === 'paid' && webinar.price > 0

        const registration: Registration = {
          id: generateId('r'),
          name: userName,
          email: userEmail,
          itemId: webinarId,
          itemType: 'webinar',
          itemTitle: webinar.title,
          date: today,
          status: 'confirmed',
          typeLabel: isPaid ? 'paid' : 'free',
          amount: isPaid ? webinar.price : undefined,
        }

        const newPayments: Payment[] = isPaid
          ? [
              ...prev.payments,
              {
                id: generateId('p'),
                txnId: generateTxnId(),
                name: userName,
                item: webinar.title,
                amount: webinar.price,
                gateway: 'Simulated',
                status: 'success',
                date: today,
              },
            ]
          : prev.payments

        return {
          ...prev,
          webinars: prev.webinars.map((w) =>
            w.id === webinarId ? { ...w, enrolled: w.enrolled + 1 } : w,
          ),
          registrations: [...prev.registrations, registration],
          payments: newPayments,
        }
      })

      return result
    },
    [],
  )

  /**
   * Enroll a user in a course.
   * Returns synchronously by reading the latest state snapshot.
   */
  const enrollCourse = useCallback(
    (courseId: string, userName: string, userEmail: string): ActionResult => {
      let result: ActionResult = { success: true }

      setData((prev) => {
        const course = prev.courses.find((c) => c.id === courseId)
        if (!course) {
          result = { success: false, reason: 'not_found' }
          return prev
        }

        // Duplicate check
        const alreadyEnrolled = prev.registrations.some(
          (r) =>
            r.itemId === courseId &&
            r.itemType === 'course' &&
            r.email.toLowerCase() === userEmail.toLowerCase(),
        )
        if (alreadyEnrolled) {
          result = { success: false, reason: 'duplicate' }
          return prev
        }

        result = { success: true }

        const today = new Date().toISOString().slice(0, 10)

        const registration: Registration = {
          id: generateId('r'),
          name: userName,
          email: userEmail,
          itemId: courseId,
          itemType: 'course',
          itemTitle: course.title,
          date: today,
          status: 'confirmed',
          typeLabel: 'course',
          amount: course.price,
        }

        const newPayment: Payment = {
          id: generateId('p'),
          txnId: generateTxnId(),
          name: userName,
          item: course.title,
          amount: course.price,
          gateway: 'Simulated',
          status: 'success',
          date: today,
        }

        return {
          ...prev,
          courses: prev.courses.map((c) =>
            c.id === courseId ? { ...c, enrolled: c.enrolled + 1 } : c,
          ),
          registrations: [...prev.registrations, registration],
          payments: [...prev.payments, newPayment],
        }
      })

      return result
    },
    [],
  )

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
      registerWebinar,
      enrollCourse,
    }),
    [
      data,
      addWebinar,
      updateWebinar,
      deleteWebinar,
      addCourse,
      updateCourse,
      deleteCourse,
      registerWebinar,
      enrollCourse,
    ],
  )

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}

export function useData() {
  const ctx = useContext(DataContext)
  if (!ctx) throw new Error('useData must be used within DataProvider')
  return ctx
}
