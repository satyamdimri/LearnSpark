export type Category = 'ai' | 'coding' | 'devops'
export type WebinarType = 'free' | 'paid'
export type Duration = '1m' | '3m' | '6m'
export type RegistrationStatus = 'confirmed' | 'pending' | 'cancelled'
export type PaymentStatus = 'success' | 'refunded' | 'pending'
export type CourseBadge = 'popular' | 'new' | 'new-batch'

export interface Webinar {
  id: string
  title: string
  speaker: string
  date: string
  registrationDeadline: string
  type: WebinarType
  price: number
  maxSeats: number
  enrolled: number
  category: Category
  description: string
}

export interface Course {
  id: string
  title: string
  syllabus: string
  tools: string
  category: Category
  duration: Duration
  price: number
  originalPrice: number
  batchStartDate: string
  schedule: 'weekend' | 'weekdays'
  classTimings: string
  rating: number
  enrolled: number
  maxStudents: number
  badge?: CourseBadge
  certificate: boolean
}

export interface Registration {
  id: string
  name: string
  email: string
  itemId: string
  itemType: 'webinar' | 'course'
  itemTitle: string
  date: string
  status: RegistrationStatus
  typeLabel: 'free' | 'paid' | 'course'
  amount?: number
}

export interface Payment {
  id: string
  txnId: string
  name: string
  item: string
  amount: number
  gateway: string
  status: PaymentStatus
  date: string
}

export interface AppData {
  webinars: Webinar[]
  courses: Course[]
  registrations: Registration[]
  payments: Payment[]
}

export interface WebinarFormData {
  title: string
  speaker: string
  date: string
  registrationDeadline: string
  type: WebinarType
  price: string
  maxSeats: string
  category: Category
  description: string
}

export interface CourseFormData {
  title: string
  category: Category
  duration: Duration
  price: string
  originalPrice: string
  batchStartDate: string
  schedule: 'weekend' | 'weekdays'
  classTimings: string
  maxStudents: string
  syllabus: string
  tools: string
  certificate: boolean
  rating: string
}
